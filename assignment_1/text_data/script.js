// ==========================================
// 1. CATEGORY DISTRIBUTION (AI vs Human)
// ==========================================
const categoryData = {
    "title": "Category Distribution",
    "labels": [
        "METHODS",
        "RESULTS",
        "CONCLUSIONS",
        "BACKGROUND",
        "OBJECTIVE"
    ],
    "datasets": [
        {
            "label": "Count",
            "data": [
                59281,
                57953,
                27168,
                18402,
                13838
            ]
        }
    ]
};

const ctxCategory = document.getElementById('categoryDistChart').getContext('2d');

new Chart(ctxCategory, {
    type: 'doughnut', // Đổi thành 'pie' nếu bạn muốn biểu đồ tròn đặc ruột
    data: {
        labels: categoryData.labels,
        datasets: [{
            data: categoryData.datasets[0].data,
            // Dùng màu Tím (AI) và Xanh Ngọc (Human) chuẩn Tailwind để nổi bật
            backgroundColor: [
                'rgba(59, 130, 246, 0.7)',  // METHODS -> Blue-500
                'rgba(245, 158, 11, 0.7)',  // RESULTS -> Amber-500
                'rgba(239, 68, 68, 0.7)',   // CONCLUSIONS -> Red-500
                'rgba(16, 185, 129, 0.7)',  // BACKGROUND -> Emerald-500
                'rgba(139, 92, 246, 0.7)'   // OBJECTIVE -> Purple-500
            ],
            borderColor: [
                '#3b82f6',
                '#f59e0b',
                '#ef4444',
                '#10b981',
                '#8b5cf6'
            ],
            borderWidth: 1,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%', // Độ dày của vành khuyên (Xóa dòng này nếu dùng type: 'pie')
        plugins: {
            // Biểu đồ tròn thì rất cần Legend để biết màu nào của Class nào
            legend: {
                position: 'bottom',
                labels: {
                    font: { family: 'Inter', size: 14, weight: '500' },
                    padding: 20,
                    usePointStyle: true // Biến hình vuông chú thích thành hình tròn
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)', // Nền tooltip màu tối (Slate-900)
                titleFont: { family: 'Inter', size: 14 },
                bodyFont: { family: 'Inter', size: 14},
                padding: 12,
                callbacks: {
                    // Tùy chỉnh hiển thị Tooltip: Gắn thêm dấu phẩy và %
                    label: function(context) {
                        const value = context.parsed;
                        // Tính tổng để ra phần trăm
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = ((value / total) * 100).toFixed(2) + '%';
                        
                        return ` Count: ${value.toLocaleString()} documents (${percentage})`;
                    }
                }
            }
        }
    }
});

// Bạn có thể tiếp tục gửi JSON tiếp theo, mình sẽ nối code xuống dưới nhé!

// ==========================================
// 2. STOP WORDS ANALYSIS (Cột dọc - Đã sửa lỗi nhãn)
// ==========================================
const stopWordsData = {
    "title": "Top 20 Most Frequent Stop Words",
    "labels": [
        "the",
        "and",
        "of",
        "in",
        "to",
        "with",
        "a",
        "were",
        "was",
        "for",
        "patients",
        "group",
        "at",
        "or",
        "study",
        "on",
        "treatment",
        "is",
        "after",
        "by"
    ],
    "datasets": [
        {
            "label": "Frequency",
            "data": [
                170629,
                137446,
                130330,
                106501,
                76156,
                61197,
                58510,
                50373,
                46183,
                39660,
                39147,
                34559,
                24240,
                24134,
                18715,
                18530,
                18448,
                15985,
                15695,
                15565
            ]
        }
    ]
};

const ctxStopWords = document.getElementById('stopWordsChart').getContext('2d');

new Chart(ctxStopWords, {
    type: 'bar',
    data: {
        labels: stopWordsData.labels, // Đây là danh sách các từ
        datasets: [{
            label: 'Frequency',
            data: stopWordsData.datasets[0].data,
            backgroundColor: 'rgba(244, 63, 94, 0.7)', 
            borderColor: '#f43f5e',
            borderWidth: 1,
            barPercentage: 0.85
        }]
    },
    options: {
        indexAxis: 'x', // Biểu đồ cột dọc
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                // Sửa lại callback label để hiển thị đúng giá trị Y khi hover
                callbacks: {
                    label: function(context) {
                        return ` Frequency: ${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Stop words', // Nhãn cho trục X
                    font: {
                        family: 'Inter',
                        size: 12,
                        weight: '400'
                    },
                    padding: { top: 10 }
                },
                ticks: {
                    font: { family: 'Inter, sans-serif', size: 11 },
                    maxRotation: 45, // Xoay chữ 45 độ để không bị đè nhau
                    minRotation: 45,
                    autoSkip: false // Ép hiển thị toàn bộ 20 từ
                }
            },
            // TRỤC Y: Bây giờ đóng vai trò hiển thị SỐ (TẦN SUẤT)
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Frequency' },
                ticks: {
                    // Chuyển định dạng số có dấu phẩy sang trục Y
                    callback: function(value) { return value.toLocaleString(); },
                    font: { family: 'Inter, sans-serif', size: 11 }
                }
            }
        }
    }
});

// ==========================================
// 3. WORD COUNT DISTRIBUTION (Cột dọc - Histogram)
// ==========================================
const wordCountData = {
    "labels": [
        "0-9",
        "10-19",
        "20-29",
        "30-39",
        "40-49",
        "50-59",
        "60-69",
        "70-79",
        "80-89",
        "90-99",
        "100-109",
        "110-119",
        "120-129",
        "130-139",
        "140-149",
        "150-159",
        "160-169",
        "170-179",
        "180-189",
        "190-199",
        "200-209"
    ],
    "counts": [
                9877,
                53841,
                54638,
                31157,
                14223,
                6539,
                3047,
                1519,
                807,
                430,
                226,
                139,
                71,
                36,
                30,
                13,
                9,
                11,
                3,
                7,
                6
            ]
};

const ctxWordCount = document.getElementById('wordCountChart').getContext('2d');
new Chart(ctxWordCount, {
    type: 'bar',
    data: {
        labels: wordCountData.labels,
        datasets: [{
            label: 'Documents',
            data: wordCountData.counts,
            backgroundColor: 'rgba(129, 140, 248, 0.7)', // Indigo-400
            borderColor: '#818cf8',
            borderWidth: 1,
            // Ép sát các cột vào nhau để tạo cảm giác biểu đồ phân phối (Histogram)
            categoryPercentage: 0.95,
            barPercentage: 1.0 
        }]
    },
    options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { 
                title: {
                    display: true,
                    text: 'Word Count Ranges', // Nhãn cho trục X
                    font: {
                        family: 'Inter',
                        size: 12,
                    },
                    padding: { top: 10 }
                },
                ticks: { maxRotation: 45, minRotation: 45, font: {family: 'Inter', size: 11} }
            },
            y: { 
                beginAtZero: true,
                title: { display: true, text: 'Document Count'},
                ticks: { callback: value => value.toLocaleString(), font: {family: 'Inter'} },
                autoSkip: false
            }
        }
    }
});

// ==========================================
// 4. CHARACTER COUNT DISTRIBUTION (Cột dọc - Histogram)
// ==========================================
const charCountData = {
    "labels": [
        "0-99",
        "100-199",
        "200-299",
        "300-399",
        "400-499",
        "500-599",
        "600-699",
        "700-799",
        "800-899",
        "900-999",
        "1000-1099",
        "1100-1199",
        "1300-1399"
    ],
    "counts": [
                46192,
                92181,
                30575,
                6006,
                1263,
                279,
                86,
                36,
                12,
                7,
                2,
                2,
                1
            ]
};

const ctxCharCount = document.getElementById('charCountChart').getContext('2d');
new Chart(ctxCharCount, {
    type: 'bar',
    data: {
        labels: charCountData.labels,
        datasets: [{
            label: 'Documents',
            data: charCountData.counts,
            backgroundColor: 'rgba(45, 212, 191, 0.7)', // Teal-400
            borderColor: '#2dd4bf',
            borderWidth: 1,
            categoryPercentage: 0.95, barPercentage: 1.0 
        }]
    },
    options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { 
                title: {
                    display: true,
                    text: 'Character Count Ranges', // Nhãn cho trục X
                    font: {
                        family: 'Inter',
                        size: 12,
                    },
                    padding: { top: 10 }
                },
                ticks: { maxRotation: 45, minRotation: 45, font: {family: 'Inter', size: 11} }
            },
            y: { 
                beginAtZero: true, 
                title: { display: true, text: 'Document Count' },
                ticks: { callback: value => value.toLocaleString(), font: {family: 'Inter'} },
                autoSkip: false
            }
        }
    }
});

// ==========================================
// 5. VOCABULARY RICHNESS (Unique Words)
// ==========================================
const vocabData = {
    "labels": [
        "OBJECTIVE",
        "BACKGROUND",
        "CONCLUSIONS",
        "METHODS",
        "RESULTS"
    ],
    "counts": [
                0.11871305359046419,
                0.09850340369495,
                0.08749074669611544,
                0.05999634219722258,
                0.0498531311571244
            ]
};

const ctxVocab = document.getElementById('vocabRichnessChart').getContext('2d');
new Chart(ctxVocab, {
    type: 'bar',
    data: {
        labels: vocabData.labels,
        datasets: [{
            label: 'Unique Words',
            data: vocabData.counts,
            // Đồng bộ màu: AI = Tím, Human = Xanh Ngọc
            backgroundColor: [
                'rgba(139, 92, 246, 0.7)', // OBJECTIVE - Purple-500
                'rgba(16, 185, 129, 0.7)', // BACKGROUND - Emerald-500
                'rgba(239, 68, 68, 0.7)',  // CONCLUSIONS - Red-500
                'rgba(59, 130, 246, 0.7)', // METHODS - Blue-500
                'rgba(245, 158, 11, 0.7)'  // RESULTS - Amber-500
            ],
            borderColor: [
                '#8b5cf6', 
                '#10b981',
                '#ef4444',
                '#3b82f6',
                '#f59e0b'
            ],
            borderWidth: 1,
            barPercentage: 0.5 // Thu gọn độ rộng cột cho tinh tế
        }]
    },
    options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            // Plugin vẽ số trực tiếp lên đầu cột giống Plotly ban nãy
            tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y.toLocaleString()} words` } }
        },
        scales: {
            x: { 
                title: {
                    display: true,
                    text: 'Categories', // Nhãn cho trục X
                    font: {
                        family: 'Inter',
                        size: 12,
                    },
                    padding: { top: 10 }
                },
                ticks: { font: {family: 'Inter', size: 14, weight: 'bold'}}
            },
            y: { 
                beginAtZero: true,
                title: { display: true, text: 'Frequency' },
                ticks: { callback: value => value.toLocaleString() },
                grace: '5%', // Thêm khoảng trống đỉnh cột,
                autoSkip: false
            }
        }
    }
});

// ==========================================
// 6. TOP WORDS BY CATEGORY (AI vs HUMAN) - ĐÃ FIX HIỂN THỊ ĐỦ 25 LABELS
// ==========================================
const topWordsByAuthor = {
    "OBJECTIVE": {
        "labels": [
            "evaluate",
            "efficacy",
            "compare",
            "determine",
            "therapy",
            "clinical",
            "assess",
            "aim",
            "safety",
            "investigate",
            "compared",
            "pain",
            "randomized",
            "intervention",
            "risk",
            "outcomes",
            "effectiveness",
            "using",
            "disease",
            "cancer",
            "associated",
            "care",
            "children",
            "use",
            "objective"
        ],
        "data": [
            1667,
            1598,
            1324,
            1158,
            1080,
            1008,
            930,
            925,
            908,
            894,
            794,
            715,
            709,
            694,
            663,
            637,
            607,
            583,
            574,
            523,
            514,
            506,
            505,
            504,
            473
        ]
    },
    "METHODS": {
        "labels": [
            "randomized",
            "n",
            "weeks",
            "primary",
            "using",
            "months",
            "randomly",
            "control",
            "intervention",
            "received",
            "participants",
            "mg",
            "years",
            "baseline",
            "assessed",
            "outcome",
            "clinical",
            "assigned",
            "placebo",
            "controlled",
            "week",
            "included",
            "days",
            "used",
            "receive"
        ],
        "data": [
            8489,
            6062,
            4443,
            4400,
            4246,
            4191,
            4076,
            4059,
            3753,
            3609,
            3530,
            3506,
            3392,
            3186,
            3024,
            2936,
            2870,
            2858,
            2765,
            2680,
            2667,
            2656,
            2596,
            2375,
            2351
        ]
    },
    "RESULTS": {
        "labels": [
            "p",
            "significantly",
            "significant",
            "vs",
            "ci",
            "lsb",
            "rsb",
            "compared",
            "mean",
            "difference",
            "control",
            "respectively",
            "placebo",
            "months",
            "higher",
            "baseline",
            "differences",
            "time",
            "lower",
            "intervention",
            "increased",
            "rate",
            "n",
            "versus",
            "total"
        ],
        "data": [
            29337,
            7836,
            7665,
            7655,
            7124,
            6610,
            6608,
            5784,
            5303,
            4668,
            4627,
            4389,
            4017,
            3973,
            3791,
            3768,
            3163,
            3054,
            3035,
            2838,
            2818,
            2761,
            2761,
            2740,
            2621
        ]
    },
    "CONCLUSIONS": {
        "labels": [
            "effective",
            "clinical",
            "results",
            "associated",
            "compared",
            "use",
            "therapy",
            "intervention",
            "risk",
            "significant",
            "significantly",
            "did",
            "improve",
            "findings",
            "pain",
            "improved",
            "efficacy",
            "outcomes",
            "care",
            "health",
            "suggest",
            "increased",
            "reduce",
            "studies",
            "time"
        ],
        "data": [
            1830,
            1794,
            1778,
            1498,
            1489,
            1417,
            1350,
            1340,
            1338,
            1231,
            1197,
            1183,
            1104,
            1090,
            1040,
            939,
            929,
            926,
            900,
            878,
            871,
            830,
            799,
            790,
            775
        ]
    },
    "BACKGROUND": {
        "labels": [
            "efficacy",
            "risk",
            "disease",
            "therapy",
            "clinical",
            "health",
            "care",
            "studies",
            "cancer",
            "associated",
            "intervention",
            "compared",
            "pain",
            "aim",
            "randomized",
            "use",
            "outcomes",
            "effective",
            "used",
            "safety",
            "improve",
            "evaluate",
            "chronic",
            "children",
            "effectiveness"
        ],
        "data": [
            1082,
            1056,
            1042,
            994,
            966,
            885,
            880,
            876,
            861,
            816,
            805,
            793,
            769,
            754,
            744,
            732,
            714,
            659,
            642,
            629,
            616,
            580,
            580,
            559,
            558
        ]
    }
};

const termsContainer = document.getElementById('top-words-by-author-container');
termsContainer.innerHTML = ''; // Xóa sạch dữ liệu cũ trong container

Object.entries(topWordsByAuthor).forEach(([author, dataInfo]) => {
    
    const categoryThemes = {
        "OBJECTIVE": { bg: 'rgba(139, 92, 246, 0.7)', border: '#8b5cf6', icon: 'bg-purple-500' },
        "METHODS": { bg: 'rgba(59, 130, 246, 0.7)', border: '#3b82f6', icon: 'bg-blue-500' },
        "RESULTS": { bg: 'rgba(245, 158, 11, 0.7)', border: '#f59e0b', icon: 'bg-amber-500' },
        "CONCLUSIONS": { bg: 'rgba(239, 68, 68, 0.7)', border: '#ef4444', icon: 'bg-red-500' },
        "BACKGROUND": { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981', icon: 'bg-emerald-500' }
    };

    const colorTheme = categoryThemes[author];

    const chartWrapper = document.createElement('div');
    // Thay đổi UI: Xếp trên - dưới, full width
    chartWrapper.className = "mb-10 w-full"; 
    chartWrapper.innerHTML = `
        <h4 class="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
            <span class="w-2 h-6 ${colorTheme.icon} rounded-full inline-block"></span> 
            ${author} Keywords (Top 25)
        </h4>
        <!-- Tăng chiều cao lên 650px để đủ chỗ cho 25 từ -->
        <div style="height: 650px; width: 100%;" class="border border-slate-100 rounded-xl p-4 bg-slate-50">
            <canvas id="topWords-${author}"></canvas>
        </div>
    `;
    termsContainer.appendChild(chartWrapper);

    const ctx = document.getElementById(`topWords-${author}`).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataInfo.labels,
            datasets: [{
                label: 'Frequency',
                data: dataInfo.data,
                backgroundColor: colorTheme.bg,
                borderColor: colorTheme.border,
                borderWidth: 1,
            }]
        },
        options: {
            indexAxis: 'y', // Nằm ngang
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Frequency', // Nhãn cho trục X
                        font: {
                            family: 'Inter',
                            size: 12,
                        },
                        padding: { top: 10 }
                    },
                    beginAtZero: true, 
                    ticks: { callback: v => v.toLocaleString(), font: { size: 12 } }
                },
                y: { 
                    ticks: { 
                        font: { family: 'Inter', size: 12 }, 
                        autoSkip: false // QUAN TRỌNG: Ép Chart.js hiển thị đủ 100% nhãn, không được ẩn
                    }
                }
            }
        }
    });
});

// ==========================================
// 7. TF-IDF TOP TERMS (Biểu đồ ngang)
// ==========================================
const tfidfData = {
    "METHODS": {
        "labels": [
            "randomized",
            "weeks",
            "primary",
            "using",
            "months",
            "randomly",
            "control",
            "intervention",
            "received",
            "participants",
            "mg",
            "years",
            "baseline",
            "assessed",
            "outcome",
            "clinical",
            "assigned",
            "placebo",
            "controlled",
            "week"
        ],
        "data": [
            0.3485413033677044,
            0.1824206633128414,
            0.18065516960983619,
            0.17433223867349193,
            0.17207404905336895,
            0.16735237984765733,
            0.1666543939650739,
            0.15409064807857165,
            0.14817829707315883,
            0.1449347156188004,
            0.14394932378456493,
            0.13926871257194645,
            0.13081076599475866,
            0.12415937111366923,
            0.1205462677214725,
            0.11783644017732496,
            0.11734374426020723,
            0.11352535090254479,
            0.1100354214896275,
            0.10950166757941661
        ]
    },
    "OBJECTIVE": {
        "labels": [
            "evaluate",
            "efficacy",
            "compare",
            "determine",
            "therapy",
            "clinical",
            "assess",
            "aim",
            "safety",
            "investigate",
            "compared",
            "pain",
            "randomized",
            "intervention",
            "risk",
            "outcomes",
            "effectiveness",
            "using",
            "disease",
            "cancer"
        ],
        "data": [
            0.28909843356699927,
            0.27713215167370414,
            0.229613872851054,
            0.20082542655703967,
            0.18729832528635823,
            0.17481177026726769,
            0.16128466899658625,
            0.16041754712026052,
            0.15746933274075303,
            0.155041391487041,
            0.13769895396052634,
            0.12399842831457976,
            0.12295788206298888,
            0.12035651643401168,
            0.11498036080079214,
            0.11047132704389834,
            0.10526859578594394,
            0.10110641077958042,
            0.0995455914021941,
            0.09070094826367163
        ]
    },
    "RESULTS": {
        "labels": [
            "significantly",
            "significant",
            "vs",
            "ci",
            "lsb",
            "rsb",
            "compared",
            "mean",
            "difference",
            "control",
            "respectively",
            "placebo",
            "months",
            "higher",
            "baseline",
            "differences",
            "time",
            "lower",
            "intervention",
            "increased"
        ],
        "data": [
            0.27168822484739963,
            0.2657593470463652,
            0.26541262904630475,
            0.24700190324309274,
            0.22918059803998359,
            0.2291112544399715,
            0.20054169123498716,
            0.1838645554320776,
            0.1618479624282365,
            0.1604264186279885,
            0.15217453022654887,
            0.13927662062429866,
            0.13775106142403248,
            0.13144079382293158,
            0.13064334242279246,
            0.10966690341913284,
            0.1058876772184735,
            0.10522891301835857,
            0.09839856841716693,
            0.09770513241704595
        ]
    },
    "BACKGROUND": {
        "labels": [
            "efficacy",
            "risk",
            "disease",
            "therapy",
            "clinical",
            "health",
            "care",
            "studies",
            "cancer",
            "associated",
            "intervention",
            "compared",
            "pain",
            "aim",
            "randomized",
            "use",
            "outcomes",
            "effective",
            "used",
            "safety"
        ],
        "data": [
            0.1782270722787905,
            0.17394435150314488,
            0.17163827108548954,
            0.16373170965352843,
            0.15911954881821777,
            0.14577722640178334,
            0.14495362625262073,
            0.14429474613329063,
            0.14182394568580278,
            0.13441154434333924,
            0.13259962401518147,
            0.1306229836571912,
            0.12666970294121063,
            0.12419890249372277,
            0.12255170219539753,
            0.12057506183740725,
            0.11761010130042182,
            0.10855049965963302,
            0.10575025915248012,
            0.10360889876465731
        ]
    },
    "CONCLUSIONS": {
        "labels": [
            "effective",
            "clinical",
            "results",
            "associated",
            "compared",
            "use",
            "therapy",
            "intervention",
            "risk",
            "significant",
            "significantly",
            "did",
            "improve",
            "findings",
            "pain",
            "suggest",
            "improved",
            "efficacy",
            "outcomes",
            "care"
        ],
        "data": [
            0.2009683009856532,
            0.1970148262121649,
            0.1952577263128368,
            0.1645084780745948,
            0.16352010938122272,
            0.1556131598342462,
            0.14825530400580972,
            0.14715711656872965,
            0.14693747908131363,
            0.13518687350455685,
            0.13145303621848461,
            0.1299155738065725,
            0.12123989305363994,
            0.11970243064172785,
            0.11421149345632749,
            0.11309157025065245,
            0.10311980034181877,
            0.10202161290473868,
            0.10169215667361467,
            0.09883686933720648
        ]
    }
};

const tfidfContainer = document.getElementById('tfidf-container');

// Tạo Grid 2 cột cho TF-IDF
const tfidfGrid = document.createElement('div');
tfidfGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8";
tfidfContainer.appendChild(tfidfGrid);

Object.entries(tfidfData).forEach(([author, dataInfo]) => {
    
    const categoryThemes = {
        "OBJECTIVE": { bg: 'rgba(139, 92, 246, 0.7)', border: '#8b5cf6', icon: 'bg-purple-500' },
        "METHODS": { bg: 'rgba(59, 130, 246, 0.7)', border: '#3b82f6', icon: 'bg-blue-500' },
        "RESULTS": { bg: 'rgba(245, 158, 11, 0.7)', border: '#f59e0b', icon: 'bg-amber-500' },
        "CONCLUSIONS": { bg: 'rgba(239, 68, 68, 0.7)', border: '#ef4444', icon: 'bg-red-500' },
        "BACKGROUND": { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981', icon: 'bg-emerald-500' }
    };

    const colorTheme = categoryThemes[author];

    const chartWrapper = document.createElement('div');
    chartWrapper.innerHTML = `
        <h4 class="font-bold text-md text-slate-700 mb-4 flex items-center gap-2">
            <span class="w-2 h-5 ${colorTheme.icon} rounded-full inline-block"></span> 
            TF-IDF Weighted Terms - ${author}
        </h4>
        <div style="height: 380px; width: 100%;" class="border border-slate-100 rounded-xl p-4 bg-slate-50">
            <canvas id="tfidf-${author}"></canvas>
        </div>
    `;
    tfidfGrid.appendChild(chartWrapper);

    const ctx = document.getElementById(`tfidf-${author}`).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataInfo.labels,
            datasets: [{
                label: 'TF-IDF Score',
                data: dataInfo.data,
                backgroundColor: colorTheme.bg,
                borderColor: colorTheme.border,
                borderWidth: 1,
            }]
        },
        options: {
            indexAxis: 'y', // CỘT NGANG
            responsive: true, maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: { 
                    callbacks: { label: ctx => ` Score: ${ctx.parsed.x.toFixed(4)}` }
                }
            },
            scales: {
                x: { 
                    beginAtZero: true,
                    title: { display: true, text: 'TF-IDF Score' },
                    ticks: { font: { size: 10 } }
                },
                y: { 
                    ticks: { font: { family: 'Inter' } },
                    autoSkip: false
                }
            }
        }
    });
});

// ==========================================
// 8. BIGRAM ANALYSIS (Biểu đồ ngang, vẽ lên 1 thẻ HTML đã tạo sẵn)
// ==========================================
const bigramData = {
    "OBJECTIVE": {
        "labels": [
        "efficacy safety",
        "type diabetes",
        "evaluate efficacy",
        "quality life",
        "randomized controlled",
        "compare efficacy",
        "aim evaluate",
        "safety efficacy",
        "diabetes mellitus",
        "assess efficacy",
        "evaluate effectiveness",
        "risk factors",
        "physical activity",
        "heart failure",
        "blood pressure"
    ],
        "data": [
                425,
                268,
                255,
                245,
                224,
                190,
                178,
                147,
                136,
                129,
                122,
                118,
                113,
                112,
                111
            ]
    },
    "METHODS": {
        "labels": [
        "randomly assigned",
        "randomized controlled",
        "primary outcome",
        "aged years",
        "secondary outcomes",
        "quality life",
        "randomized receive",
        "primary endpoint",
        "prospective randomized",
        "randomly allocated",
        "randomized doubleblind",
        "age years",
        "end point",
        "outcome measures",
        "doubleblind placebocontrolled"
    ],
        "data": [
                2281,
                1631,
                1576,
                932,
                805,
                772,
                716,
                676,
                648,
                640,
                635,
                607,
                585,
                577,
                535
            ]
    },
    "RESULTS": {
        "labels": [
        "lsb rsb",
        "confidence interval",
        "adverse events",
        "significant differences",
        "significant difference",
        "statistically significant",
        "ci rsb",
        "lsb ci",
        "significantly higher",
        "significantly lower",
        "hazard ratio",
        "rsb vs",
        "vs lsb",
        "compared control",
        "did differ"
    ],
        "data": [
                3211,
                1677,
                1551,
                1524,
                1485,
                1442,
                1429,
                1250,
                1163,
                1012,
                872,
                778,
                747,
                706,
                655
            ]
    },
    "CONCLUSIONS": {
        "labels": [
        "results suggest",
        "quality life",
        "number nct",
        "clinicaltrialsgov number",
        "findings suggest",
        "statistically significant",
        "type diabetes",
        "physical activity",
        "adverse events",
        "safe effective",
        "weight loss",
        "clinical trials",
        "breast cancer",
        "compared placebo",
        "risk factors"
    ],
        "data": [
                328,
                302,
                239,
                218,
                206,
                183,
                182,
                168,
                168,
                166,
                163,
                159,
                153,
                152,
                151
            ]
    },
    "BACKGROUND": {
        "labels": [
        "quality life",
        "randomized controlled",
        "efficacy safety",
        "physical activity",
        "type diabetes",
        "heart failure",
        "breast cancer",
        "risk factors",
        "primary care",
        "cardiovascular disease",
        "aimed assess",
        "little known",
        "aim evaluate",
        "blood pressure",
        "mental health"
    ],
        "data": [
                286,
                269,
                256,
                229,
                198,
                195,
                195,
                149,
                146,
                132,
                128,
                127,
                125,
                121,
                116
            ]
    },
};

// Tìm thẻ Canvas `bigramChart` đã khai báo trong HTML file
const bigramCanvasDiv = document.getElementById('bigramChart').parentNode;
// Xóa thẻ canvas cũ vì ta sẽ thay bằng grid 2 cột
bigramCanvasDiv.innerHTML = ''; 

// Tạo Grid 2 cột cho Bigram
const bigramGrid = document.createElement('div');
bigramGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8";
bigramCanvasDiv.appendChild(bigramGrid);

Object.entries(bigramData).forEach(([author, dataInfo]) => {
    
    const categoryThemes = {
        "OBJECTIVE": { bg: 'rgba(139, 92, 246, 0.7)', border: '#8b5cf6', icon: 'bg-purple-500' },
        "METHODS": { bg: 'rgba(59, 130, 246, 0.7)', border: '#3b82f6', icon: 'bg-blue-500' },
        "RESULTS": { bg: 'rgba(245, 158, 11, 0.7)', border: '#f59e0b', icon: 'bg-amber-500' },
        "CONCLUSIONS": { bg: 'rgba(239, 68, 68, 0.7)', border: '#ef4444', icon: 'bg-red-500' },
        "BACKGROUND": { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981', icon: 'bg-emerald-500' }
    };

    const colorTheme = categoryThemes[author];

    const chartWrapper = document.createElement('div');
    chartWrapper.innerHTML = `
        <h4 class="font-bold text-md text-slate-700 mb-4 flex items-center gap-2">
            <span class="w-2 h-5 ${colorTheme.icon} rounded-full inline-block"></span> 
            ${author} Bigrams
        </h4>
        <div style="height: 380px; width: 100%;" class="border border-slate-100 rounded-xl p-4 bg-slate-50">
            <canvas id="bigram-${author}"></canvas>
        </div>
    `;
    bigramGrid.appendChild(chartWrapper);

    const ctx = document.getElementById(`bigram-${author}`).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataInfo.labels,
            datasets: [{
                label: 'Frequency',
                data: dataInfo.data,
                backgroundColor: colorTheme.bg,
                borderColor: colorTheme.border,
                borderWidth: 1,
            }]
        },
        options: {
            indexAxis: 'y', // CỘT NGANG
            responsive: true, maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: { 
                    callbacks: { label: ctx => ` Frequency: ${ctx.parsed.x.toLocaleString()}` }
                }
            },
            scales: {
                x: { 
                    beginAtZero: true,
                    title: { display: true, text: 'TF-IDF Score' },
                    ticks: { callback: v => v.toLocaleString(), font: { size: 10 } }
                },
                y: { 
                    ticks: { font: { family: 'Inter' } },
                    autoSkip: false
                }
            }
        }
    });
});

// ==========================================
// 9. CATEGORY SIMILARITY MATRIX & INTERPRETATION GUIDE
// ==========================================
const similarityData = {
    "title": "Category Similarity Matrix",
    "categories": [
        "BACKGROUND",
        "CONCLUSIONS",
        "METHODS",
        "OBJECTIVE",
        "RESULTS"
    ],
    "matrix": [
        [1.000, 0.826, 0.566, 0.875, 0.397],
        [0.826, 1.000, 0.535, 0.699, 0.560],
        [0.566, 0.535, 1.000, 0.550, 0.522],
        [0.875, 0.699, 0.550, 1.000, 0.369],
        [0.397, 0.560, 0.522, 0.369, 1.000]
    ]
};

const interpretationData = [
    { "range": "1.000", "label": "Same Category (Perfect Match)", "color": "#f860b7" },
    { "range": "0.75 - 0.99", "label": "Very High Similarity (Strong Overlap in Vocabulary)", "color": "#d94fd1" },
    { "range": "0.60 - 0.75", "label": "High Similarity (Potential Confusion)", "color": "#9945dc" },
    { "range": "0.45 - 0.60", "label": "Moderate Similarity (Acceptable Separation)", "color": "#6a34b8" },
    { "range": "0.00 - 0.45", "label": "Low Similarity (Clearly Distinct Categories)", "color": "#361b8f" }
];

// --- PHẦN 1: VẼ HEATMAP BẰNG PLOTLY ---
const heatmapDivId = 'categorySimilarityHeatmap';
const heatmapDiv = document.getElementById(heatmapDivId);

if (heatmapDiv) {
    heatmapDiv.innerHTML = '';
    
    let annotations = [];
    let matrix = similarityData.matrix;
    let labels = similarityData.categories;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let val = matrix[i][j];
            annotations.push({
                x: labels[j],
                y: labels[i],
                text: val.toFixed(3),
                showarrow: false,
                font: {
                    // Nếu ô màu quá đỏ (giá trị cao > 0.6), chữ màu trắng, ngược lại chữ đen
                    color: val > 0.6 ? 'white' : 'black', 
                    size: 12,
                    family: 'Inter'
                }
            });
        }
    }

    let plotData = [{
        z: matrix,
        x: labels,
        y: labels,
        type: 'heatmap',
        colorscale: [
            [0, '#361b8f'],    // Màu cho mức Low (0.0)
            [0.45, '#6a34b8'],  // Mức Moderate (0.5)
            [0.6, '#9945dc'],  // Mức High (0.7)
            [0.75, '#d94fd1'], // Mức Very High (0.85)
            [1, '#f860b7']     // Mức Perfect Match (1.0)
        ],
        showscale: true,
        colorbar: {
            title: 'Similarity',
            titleside: 'right',
            tickfont: { family: 'Inter' }
        }
    }];

    let layout = {
        xaxis: { 
            side: 'bottom',
            tickangle: 0, // Đã sửa: Chữ nằm ngang
            tickfont: { family: 'Inter', size: 10 } // Giảm size 1 chút để không chạm nhau
        },
        yaxis: { 
            autorange: 'reversed',
            tickfont: { family: 'Inter', size: 11 }
        },
        annotations: annotations,
        margin: { t: 40, b: 50, l: 120, r: 20 }, // Tăng lề trái (l:120) để hiện đủ chữ BACKGROUND
        height: 500,
        font: { family: 'Inter' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot(heatmapDivId, plotData, layout, { responsive: true, displayModeBar: true, displaylogo: false });

    // --- PHẦN 2: INTERPRETATION GUIDE ---
    const parentContainer = heatmapDiv.parentElement;
    const existingGuide = parentContainer.querySelector('.interpretation-guide-container');
    if (existingGuide) existingGuide.remove();

    const guideWrapper = document.createElement('div');
    guideWrapper.className = "interpretation-guide-container";

    const subtitle = document.createElement('p');
    subtitle.className = "text-green-700 font-medium text-sm mt-6 mb-10 border-l-4 border-green-500 pl-3";
    
    const guideHeader = document.createElement('h3');
    guideHeader.className = "font-bold text-xl text-slate-700 mb-6";
    guideHeader.innerHTML = "Interpretation Guide";

    // Đã sửa: md:grid-cols-5 để 5 thẻ nằm trên 1 hàng
    const guideGrid = document.createElement('div');
    guideGrid.className = "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3";

    interpretationData.forEach(item => {
        const card = document.createElement('div');
        card.style.backgroundColor = item.color;
        card.className = `p-4 rounded-xl text-white text-center shadow-sm flex flex-col justify-center min-h-[110px] transition-transform hover:scale-105 duration-300`;
        
        card.innerHTML = `
            <div class="font-bold text-lg mb-1">${item.range}</div>
            <div class="text-[10px] font-bold opacity-90 leading-tight uppercase tracking-wide">${item.label}</div>
        `;
        guideGrid.appendChild(card);
    });

    guideWrapper.appendChild(subtitle);
    guideWrapper.appendChild(guideHeader);
    guideWrapper.appendChild(guideGrid);
    parentContainer.appendChild(guideWrapper);
}

// ==========================================
// 11. CATEGORY DISTRIBUTION BY SENTENCE POSITION (Đã sửa nhãn trục X)
// ==========================================
const positionData = {
    "x_labels": [
        "(-0.001, 0.05]", "(0.05, 0.1]", "(0.1, 0.15]", "(0.15, 0.2]",
        "(0.2, 0.25]", "(0.25, 0.3]", "(0.3, 0.35]", "(0.35, 0.4]",
        "(0.4, 0.45]", "(0.45, 0.5]", "(0.5, 0.55]", "(0.55, 0.6]",
        "(0.6, 0.65]", "(0.65, 0.7]", "(0.7, 0.75]", "(0.75, 0.8]",
        "(0.8, 0.85]", "(0.85, 0.9]", "(0.9, 0.95]", "(0.95, 1.0]"
    ],
    "y_labels": ["BACKGROUND", "CONCLUSIONS", "METHODS", "OBJECTIVE", "RESULTS"],
    "matrix": [
        [7471, 4403, 2179, 1995, 1050, 516, 296, 242, 91, 94, 17, 22, 10, 6, 1, 2, 0, 3, 4, 0],
        [13, 4, 5, 0, 0, 0, 1, 9, 4, 17, 7, 37, 54, 136, 357, 845, 1454, 4155, 5360, 14710],
        [106, 2852, 3317, 6049, 6489, 6124, 5757, 7600, 4727, 6543, 1759, 3072, 1364, 1196, 777, 494, 332, 320, 159, 244],
        [7540, 2394, 1440, 1261, 629, 277, 133, 83, 31, 24, 5, 5, 5, 3, 3, 0, 2, 1, 2, 0],
        [0, 34, 73, 176, 281, 438, 665, 1742, 1818, 5077, 2521, 6509, 5269, 7713, 7633, 6464, 4719, 4737, 1960, 124]
    ]
};

const posDivId = 'positionHeatmap';
if (document.getElementById(posDivId)) {
    const dataPlot = [{
        z: positionData.matrix,
        x: positionData.x_labels,
        y: positionData.y_labels,
        type: 'heatmap',
        colorscale: 'YlGnBu', // Đổi sang dải màu Vàng-Xanh y hệt hình mẫu
        showscale: true,
        colorbar: {
            title: 'Count',
            titleside: 'right',
            tickfont: { family: 'Inter', size: 10 }
        }
    }];

    const layoutPlot = {
        xaxis: { 
            title: { text: 'Sentence Position (binned)', font: { size: 12 }, standoff: 20 },
            type: 'category', // ÉP HIỂN THỊ DẠNG PHÂN LOẠI (Để hiện đủ 20 nhãn)
            tickangle: -90,   // XOAY NHÃN 90 ĐỘ y hệt hình mẫu
            tickfont: { size: 9 },
            gridcolor: 'rgba(0,0,0,0)',
            automargin: true  // Tự động căn lề để không bị mất chữ khi xoay
        },
        yaxis: { 
            autorange: 'reversed', 
            tickfont: { family: 'Inter', size: 11 },
            automargin: true
        },
        margin: { t: 30, b: 20, l: 30, r: 30 }, // Để margin nhỏ lại vì automargin sẽ tự lo phần chữ
        height: 450, // Giảm chiều cao xuống 450px để nằm gọn trong card trắng
        font: { family: 'Inter' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot(posDivId, dataPlot, layoutPlot, { responsive: true, displayModeBar: true, displaylogo: false });
}

// ==========================================
// 10. MOST FREQUENT WORDS OVERALL (Biểu đồ cột dọc)
// ==========================================
const overallFrequentData = {
    "title": "Top 20 Frequent Words",
    "labels": [
        "p",
        "randomized",
        "compared",
        "control",
        "significant",
        "intervention",
        "significantly",
        "n",
        "months",
        "vs",
        "rsb",
        "lsb",
        "clinical",
        "placebo",
        "baseline",
        "ci",
        "weeks",
        "primary",
        "mean",
        "using"
    ],
    "datasets": [
        {
            "label": "Frequency",
            "data": [
                29990,
                11495,
                10647,
                10166,
                9479,
                9430,
                9240,
                9043,
                8993,
                8383,
                8200,
                8198,
                7651,
                7539,
                7421,
                7306,
                6991,
                6847,
                6715,
                6549
            ]
        }
    ]
};

const ctxOverallFreq = document.getElementById('mostFrequentChart').getContext('2d');

new Chart(ctxOverallFreq, {
    type: 'bar',
    data: {
        labels: overallFrequentData.labels, // Nhãn chữ (health, patients...)
        datasets: [{
            label: 'Frequency',
            data: overallFrequentData.datasets[0].data,
            backgroundColor: 'rgba(168, 85, 247, 0.7)', 
            borderColor: '#a855f7',
            borderWidth: 1,
            barPercentage: 0.85
        }]
    },
    options: {
        indexAxis: 'x', // Chuyển về cột dọc
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, 
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                // Sửa tooltip để đọc giá trị từ trục Y (vẽ dọc)
                callbacks: {
                    label: function(context) {
                        return ` Frequency: ${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Words', // Nhãn cho trục X
                    font: {
                        family: 'Inter',
                        size: 12,
                    },
                    padding: { top: 10 }
                },
                ticks: {
                    // Hiển thị nhãn chữ trên trục X
                    font: { family: 'Inter, sans-serif', size: 11 },
                    maxRotation: 45, // Xoay chữ để không bị đè
                    minRotation: 45,
                    autoSkip: false // Hiện đầy đủ 20 nhãn
                }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Frequency' },
                ticks: {
                    // Định dạng số có dấu phẩy trên trục Y
                    callback: function(value) { return value.toLocaleString(); },
                    font: { family: 'Inter, sans-serif', size: 11 }
                }
            }
        }
    }
});