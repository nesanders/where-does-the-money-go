import pandas as pd
import json
import numpy as np

def categorize_smart(row):
    desc = str(row['disbursement_description']).upper()
    payee = str(row['recipient_name']).upper()
    
    if any(x in desc for x in ['SALARY', 'PAYROLL', 'WAGES', 'STIPEND', '401K', 'INSURANCE', 'HEALTH']) or 'GUSTO' in payee:
        return 'Staff & Payroll'
    elif any(x in desc for x in ['TRAVEL', 'UBER', 'LYFT', 'HOTEL', 'AIRFARE', 'FLIGHT', 'TAXI']) or any(x in payee for x in ['AIRLINES', 'UBER', 'LYFT', 'HOTEL', 'AMTRAK']):
        return 'Travel & Logistics'
    elif any(x in desc for x in ['ADVERTISING', 'ADS', 'MEDIA', 'FACEBOOK', 'GOOGLE']) or any(x in payee for x in ['FACEBOOK', 'GOOGLE', 'MIDDLE SEAT']):
        return 'Digital & Media Ads'
    elif any(x in desc for x in ['SOFTWARE', 'TECH', 'INTERNET', 'HOSTING', 'IT', 'DATA']) or any(x in payee for x in ['SHOPIFY', 'ACTBLUE', 'NGP VAN', 'NGPVAN', 'ZOOM', 'APPLE']):
        return 'Tech, Platforms & Tools'
    elif any(x in desc for x in ['REFUND', 'REIMBURSEMENT']):
        return 'Refunds'
    elif any(x in desc for x in ['MERCHANT', 'PROCESSING', 'FEES', 'BANK', 'CREDIT CARD']):
        return 'Financial/Processing Fees'
    elif any(x in desc for x in ['CATERING', 'FOOD', 'MEALS']):
        return 'Food & Catering'
    else:
        return 'Other Operational'

def process_data():
    df = pd.read_csv('aoc_schedule_b-2026-03-23T21_15_34.csv', low_memory=False)
    df['disbursement_date'] = pd.to_datetime(df['disbursement_date'])
    
    # Fill Nans
    df['disbursement_purpose_category'] = df['disbursement_purpose_category'].fillna("UNCLASSIFIED")
    df['recipient_name'] = df['recipient_name'].fillna("Unknown")
    df['disbursement_description'] = df['disbursement_description'].fillna("Unspecified")

    # Add Sane Category
    df['sane_category'] = df.apply(categorize_smart, axis=1)

    # 1. Total spent
    total_spent = float(df['disbursement_amount'].sum())

    # 2. Category spending
    cat_spend = df.groupby('disbursement_purpose_category')['disbursement_amount'].sum().sort_values(ascending=False)
    cat_spend_list = [{"category": str(k), "amount": float(v)} for k, v in cat_spend.items() if v > 0]

    # 3. Monthly spending (group by YYYY-MM)
    df['month_str'] = df['disbursement_date'].dt.strftime('%Y-%m')
    monthly = df.groupby('month_str')['disbursement_amount'].sum().sort_index()
    monthly_list = [{"month": str(k), "amount": float(v)} for k, v in monthly.items() if pd.notnull(k)]

    # 4. Top 20 payees
    top_payees = df.groupby('recipient_name')['disbursement_amount'].sum().sort_values(ascending=False).head(20)
    top_payees_list = [{"payee": str(k), "amount": float(v)} for k, v in top_payees.items() if v > 0]

    # 5. Focus on the "OTHER" category breakdown
    other_df = df[df['disbursement_purpose_category'] == 'OTHER']
    other_desc = other_df.groupby('disbursement_description')['disbursement_amount'].sum().sort_values(ascending=False).head(15)
    other_desc_list = [{"description": str(k), "amount": float(v)} for k, v in other_desc.items() if v > 0]
    
    other_payees = other_df.groupby('recipient_name')['disbursement_amount'].sum().sort_values(ascending=False).head(15)
    other_payees_list = [{"payee": str(k), "amount": float(v)} for k, v in other_payees.items() if v > 0]

    # 6. Sane Categories with Top Vendors
    sane_spend = df.groupby('sane_category')['disbursement_amount'].sum().sort_values(ascending=False)
    sane_spend_list = []
    for k, v in sane_spend.items():
        if v > 0:
            sub = df[df['sane_category'] == k]
            top_v = sub.groupby('recipient_name')['disbursement_amount'].sum().sort_values(ascending=False).head(5)
            sane_spend_list.append({
                "category": str(k), 
                "amount": float(v),
                "top_vendors": [{"vendor": str(vk), "amount": float(vv)} for vk, vv in top_v.items() if vv > 0]
            })

    # 7. Sane Categories by month
    sane_monthly = df.groupby(['month_str', 'sane_category'])['disbursement_amount'].sum().unstack(fill_value=0)
    sane_monthly_obj = {}
    for col in sane_monthly.columns:
        sane_monthly_obj[str(col)] = [{"month": str(idx), "amount": float(val)} for idx, val in sane_monthly[col].items() if pd.notnull(idx)]

    data = {
        "total_spent": total_spent,
        "categories": cat_spend_list,
        "monthly": monthly_list,
        "top_payees": top_payees_list,
        "other_breakdown": {
            "by_description": other_desc_list,
            "by_payee": other_payees_list
        },
        "sane_categories": sane_spend_list,
        "sane_monthly": sane_monthly_obj,
        "all_months": [str(m) for m in sane_monthly.index if pd.notnull(m)]
    }

    with open('spending_data.js', 'w') as f:
        f.write("const spendingData = " + json.dumps(data, indent=2) + ";")
    
    print("Exported data to spending_data.js")

if __name__ == "__main__":
    process_data()
