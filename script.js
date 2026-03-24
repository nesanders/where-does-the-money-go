// Configuration for Chart.js Defaults
Chart.defaults.color = '#8b949e';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(22, 27, 34, 0.9)';
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: '600' };
Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };
Chart.defaults.plugins.tooltip.cornerRadius = 8;

const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
};

// Colors
const colors = {
    primary: 'rgba(88, 166, 255, 0.85)',
    secondary: 'rgba(210, 168, 255, 0.85)',
    tertiary: 'rgba(63, 185, 80, 0.85)',
    danger: 'rgba(248, 81, 73, 0.85)',
    warning: 'rgba(210, 153, 34, 0.85)',
    grid: 'rgba(255, 255, 255, 0.05)',
    gradientStart: 'rgba(31, 111, 235, 0.5)',
    gradientEnd: 'rgba(31, 111, 235, 0.0)'
};

// 1. Initial Data Setup
document.getElementById('totalSpent').textContent = formatMoney(spendingData.total_spent);

// 2. Category Chart
const ctxCategory = document.getElementById('categoryChart').getContext('2d');
new Chart(ctxCategory, {
    type: 'bar',
    data: {
        labels: spendingData.categories.map(d => d.category),
        datasets: [{
            label: 'Amount Spent',
            data: spendingData.categories.map(d => d.amount),
            backgroundColor: colors.primary,
            borderRadius: 6,
            barPercentage: 0.7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => formatMoney(ctx.raw) } }
        },
        scales: {
            y: { grid: { color: colors.grid }, ticks: { callback: (val) => formatMoney(val) } },
            x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } }
        }
    }
});

// 3. Inside "OTHER" - By Description
const ctxOtherDesc = document.getElementById('otherDescChart').getContext('2d');
new Chart(ctxOtherDesc, {
    type: 'bar',
    data: {
        labels: spendingData.other_breakdown.by_description.map(d => d.description),
        datasets: [{
            label: 'Amount (OTHER)',
            data: spendingData.other_breakdown.by_description.map(d => d.amount),
            backgroundColor: colors.secondary,
            borderRadius: 6
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => formatMoney(ctx.raw) } }
        },
        scales: {
            x: { grid: { color: colors.grid }, ticks: { callback: (val) => formatMoney(val) } },
            y: { grid: { display: false }, ticks: { autoSkip: false, font: {size: 10} } }
        }
    }
});

// 4. Inside "OTHER" - By Payee
const ctxOtherPayees = document.getElementById('otherPayeesChart').getContext('2d');
new Chart(ctxOtherPayees, {
    type: 'bar',
    data: {
        labels: spendingData.other_breakdown.by_payee.map(d => d.payee),
        datasets: [{
            label: 'Amount Received (OTHER)',
            data: spendingData.other_breakdown.by_payee.map(d => d.amount),
            backgroundColor: colors.warning,
            borderRadius: 6
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => formatMoney(ctx.raw) } }
        },
        scales: {
            x: { grid: { color: colors.grid }, ticks: { callback: (val) => formatMoney(val) } },
            y: { grid: { display: false }, ticks: { autoSkip: false, font: {size: 10} } }
        }
    }
});

// 5. Timeline Chart
const ctxTimeline = document.getElementById('timelineChart').getContext('2d');

// Create gradient for fill
const gradientLine = ctxTimeline.createLinearGradient(0, 0, 0, 400);
gradientLine.addColorStop(0, colors.gradientStart);
gradientLine.addColorStop(1, colors.gradientEnd);

new Chart(ctxTimeline, {
    type: 'line',
    data: {
        labels: spendingData.monthly.map(d => d.month),
        datasets: [{
            label: 'Monthly Spending',
            data: spendingData.monthly.map(d => d.amount),
            borderColor: colors.tertiary,
            backgroundColor: gradientLine,
            borderWidth: 3,
            fill: true,
            pointBackgroundColor: '#0d1117',
            pointBorderColor: colors.tertiary,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3 // smooth curves
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => formatMoney(ctx.raw) } },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        scaleID: 'x',
                        value: '2024-06',
                        borderColor: 'rgba(255, 99, 132, 0.8)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: 'NY Primary (June 2024)',
                            position: 'start',
                            backgroundColor: 'rgba(255, 99, 132, 0.8)'
                        }
                    },
                    line2: {
                        type: 'line',
                        scaleID: 'x',
                        value: '2024-11',
                        borderColor: 'rgba(54, 162, 235, 0.8)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: 'General Election (Nov 2024)',
                            position: 'center',
                            backgroundColor: 'rgba(54, 162, 235, 0.8)'
                        }
                    }
                }
            }
        },
        scales: {
            y: { grid: { color: colors.grid }, ticks: { callback: (val) => formatMoney(val) } },
            x: { grid: { color: colors.grid } }
        }
    }
});

// 6. Top Overall Payees Chart
const ctxTopPayees = document.getElementById('topPayeesChart').getContext('2d');
new Chart(ctxTopPayees, {
    type: 'bar',
    data: {
        labels: spendingData.top_payees.map(d => d.payee),
        datasets: [{
            label: 'Total Received',
            data: spendingData.top_payees.map(d => d.amount),
            backgroundColor: colors.danger,
            borderRadius: 6
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => formatMoney(ctx.raw) } }
        },
        scales: {
            x: { grid: { color: colors.grid }, ticks: { callback: (val) => formatMoney(val) } },
            y: { grid: { display: false }, ticks: { autoSkip: false, font: {size: 10} } }
        }
    }
});

// 7. Sane Categories Bar Chart
const ctxSaneCat = document.getElementById('saneCategoryChart').getContext('2d');
new Chart(ctxSaneCat, {
    type: 'bar',
    data: {
        labels: spendingData.sane_categories.map(d => d.category),
        datasets: [{
            label: 'Amount Spent',
            data: spendingData.sane_categories.map(d => d.amount),
            backgroundColor: [
                'rgba(138, 43, 226, 0.8)',
                'rgba(58, 134, 255, 0.8)',
                'rgba(63, 185, 80, 0.8)',
                'rgba(248, 81, 73, 0.8)',
                'rgba(210, 168, 255, 0.8)',
                'rgba(210, 153, 34, 0.8)',
                'rgba(88, 166, 255, 0.8)'
            ],
            borderRadius: 6
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { 
                callbacks: { 
                    label: (ctx) => {
                        let dataPoint = spendingData.sane_categories[ctx.dataIndex];
                        let lines = ['Total: ' + formatMoney(dataPoint.amount)];
                        if (dataPoint.top_vendors && dataPoint.top_vendors.length > 0) {
                            lines.push('Top Vendors:');
                            dataPoint.top_vendors.forEach(v => {
                                lines.push(`  • ${v.vendor}: ${formatMoney(v.amount)}`);
                            });
                        }
                        return lines;
                    } 
                } 
            }
        },
        scales: {
            x: { grid: { color: colors.grid }, ticks: { callback: (val) => formatMoney(val) } },
            y: { grid: { display: false }, ticks: { autoSkip: false } }
        }
    }
});

// 8. Sane Categories Timeline
const ctxSaneTimeline = document.getElementById('saneTimelineChart').getContext('2d');

const saneCatKeys = Object.keys(spendingData.sane_monthly);
const colorVars = [
    'rgba(138, 43, 226, 0.8)',
    'rgba(58, 134, 255, 0.8)',
    'rgba(63, 185, 80, 0.8)',
    'rgba(248, 81, 73, 0.8)',
    'rgba(210, 168, 255, 0.8)',
    'rgba(210, 153, 34, 0.8)',
    'rgba(88, 166, 255, 0.8)'
];

const datasets = saneCatKeys.map((cat, i) => {
    return {
        label: cat,
        data: spendingData.all_months.map(m => {
            const point = spendingData.sane_monthly[cat] ? spendingData.sane_monthly[cat].find(x => x.month === m) : null;
            return point ? point.amount : 0;
        }),
        borderColor: colorVars[i % colorVars.length],
        fill: false,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 2,
        pointHoverRadius: 5
    };
});

new Chart(ctxSaneTimeline, {
    type: 'line',
    data: {
        labels: spendingData.all_months,
        datasets: datasets
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: { 
                display: true, 
                position: 'bottom', 
                labels: { color: '#8b949e', font: {size: 11} } 
            },
            tooltip: { 
                mode: 'index',
                intersect: false,
                callbacks: { label: (ctx) => ctx.dataset.label + ': ' + formatMoney(ctx.raw) } 
            }
        },
        scales: {
            y: { grid: { color: colors.grid }, ticks: { callback: (val) => formatMoney(val) } },
            x: { grid: { color: colors.grid } }
        }
    }
});
