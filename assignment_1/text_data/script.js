// ==========================================
// 1. CATEGORY DISTRIBUTION (AI vs Human)
// ==========================================
const categoryData = {
    "title": "Author Distribution (AI vs Human)",
    "labels": ["AI", "Human"],
    "datasets": [{
        "label": "Count",
        "data": [3069, 3000]
    }]
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
                'rgba(139, 92, 246, 0.8)', // Violet-500
                'rgba(16, 185, 129, 0.8)'  // Emerald-500
            ],
            borderColor: [
                '#8b5cf6', 
                '#10b981'
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
    "title": "Top 20 Stop Words in Dataset (Raw Data)",
    "labels": ["the", "and", "of", "in", "to", "a", "for", "with", "we", "that", "this", "is", "were", "on", "by", "was", "from", "as", "study", "are"],
    "datasets": [{
        "label": "Freq",
        "data": [43149, 35379, 29168, 20593, 18661, 17094, 9740, 9640, 7314, 6906, 6202, 5546, 5250, 5057, 4937, 4566, 4196, 4194, 3590, 3089]
    }]
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
    "labels": ["0-99", "100-199", "200-299", "300-399", "400-499", "500-599", "600-699", "700-799", "800-899", "900-999", "1000+"],
    "counts": [3113, 516, 1565, 622, 200, 44, 8, 1, 0, 0, 0]
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
    "labels": ["0-499", "500-999", "1000-1499", "1500-1999", "2000-2499", "2500-2999", "3000-3499", "3500-3999", "4000+"],
    "counts": [3076, 91, 549, 1136, 756, 266, 127, 55, 13]
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
    "labels": ["AI", "Human"],
    "counts": [15113, 45242]
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
            backgroundColor: ['rgba(139, 92, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
            borderColor: ['#8b5cf6', '#10b981'],
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
                    text: 'Authors', // Nhãn cho trục X
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
                title: { display: true, text: 'Unique Word Count' },
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
    "AI": {
        "labels": ["system", "quantum", "developed", "energy", "propose", "without", "network", "learning", "water", "power", "analyzing", "economic", "neural", "dark", "social", "examines", "hydrogen", "cells", "introduce", "deep", "carbon", "new", "matter", "standard", "allows"],
        "data": [362, 344, 307, 301, 248, 247, 215, 200, 183, 166, 164, 164, 154, 153, 153, 152, 151, 139, 133, 130, 130, 128, 128, 127, 124]
    },
    "Human": {
        "labels": ["health", "patients", "methods", "among", "findings", "significant", "risk", "associated", "factors", "significantly", "across", "disease", "including", "higher", "compared", "potential", "participants", "studies", "may", "group", "use", "clinical", "care", "high", "two"],
        "data": [2283, 1652, 1444, 1421, 1395, 1312, 1238, 1189, 1156, 1070, 1052, 1004, 966, 960, 952, 950, 942, 937, 924, 888, 882, 875, 855, 853, 848]
    }
};

const termsContainer = document.getElementById('top-words-by-author-container');
termsContainer.innerHTML = ''; // Xóa sạch dữ liệu cũ trong container

Object.entries(topWordsByAuthor).forEach(([author, dataInfo]) => {
    
    // Giữ nguyên Semantic Color: AI = Tím, Human = Xanh Ngọc
    const colorTheme = author === "AI" ? 
        { bg: 'rgba(139, 92, 246, 0.7)', border: '#8b5cf6', icon: 'bg-purple-500' } : 
        { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981', icon: 'bg-emerald-500' };

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
    "AI": {
        "labels": ["quantum", "developed", "energy", "propose", "network", "learning", "water", "power", "economic", "analyzing", "neural", "social", "dark", "examines", "hydrogen"],
        "data": [0.2086, 0.1862, 0.1825, 0.1504, 0.1304, 0.1213, 0.111, 0.1007, 0.0994, 0.0994, 0.0934, 0.0928, 0.0928, 0.0922, 0.0916]
    },
    "Human": {
        "labels": ["health", "patients", "methods", "findings", "significant", "risk", "associated", "factors", "significantly", "disease", "including", "higher", "compared", "potential", "participants"],
        "data": [0.2224, 0.1609, 0.1406, 0.1359, 0.1278, 0.1206, 0.1158, 0.1126, 0.1042, 0.0978, 0.0941, 0.0935, 0.0927, 0.0925, 0.0917]
    }
};

const tfidfContainer = document.getElementById('tfidf-container');

// Tạo Grid 2 cột cho TF-IDF
const tfidfGrid = document.createElement('div');
tfidfGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8";
tfidfContainer.appendChild(tfidfGrid);

Object.entries(tfidfData).forEach(([author, dataInfo]) => {
    
    const colorTheme = author === "AI" ? 
        { bg: 'rgba(139, 92, 246, 0.7)', border: '#8b5cf6', icon: 'bg-purple-500' } : 
        { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981', icon: 'bg-emerald-500' };

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
    "AI": {
        "labels": ["dark matter", "neural network", "deep learning", "reinforcement learning", "magnetic field", "quantum computing", "dark energy", "art historical", "black hole", "large language", "carbon capture", "times faster", "graph neural", "neural networks", "fusion energy"],
        "data": [90, 73, 60, 43, 34, 34, 33, 32, 30, 27, 26, 25, 24, 24, 24]
    },
    "Human": {
        "labels": ["author summary", "mental health", "public health", "logistic regression", "machine learning", "risk factors", "findings suggest", "older adults", "findings highlight", "gene expression", "significantly associated", "statistically significant", "factors associated", "significant differences", "breast cancer"],
        "data": [408, 341, 335, 270, 209, 186, 168, 162, 148, 131, 113, 113, 111, 105, 105]
    }
};

// Tìm thẻ Canvas `bigramChart` đã khai báo trong HTML file
const bigramCanvasDiv = document.getElementById('bigramChart').parentNode;
// Xóa thẻ canvas cũ vì ta sẽ thay bằng grid 2 cột
bigramCanvasDiv.innerHTML = ''; 

// Tạo Grid 2 cột cho Bigram
const bigramGrid = document.createElement('div');
bigramGrid.className = "grid grid-cols-1 md:grid-cols-2 gap-8 h-full";
bigramCanvasDiv.appendChild(bigramGrid);

Object.entries(bigramData).forEach(([author, dataInfo]) => {
    
    const colorTheme = author === "AI" ? 
        { bg: 'rgba(139, 92, 246, 0.7)', border: '#8b5cf6', icon: 'bg-purple-500' } : 
        { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981', icon: 'bg-emerald-500' };

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
// 9. AUTHOR SIMILARITY MATRIX & INTERPRETATION GUIDE
// ==========================================
const similarityData = {
    "title": "Author Similarity Matrix (AI vs Human)",
    "authors": ["AI", "Human"],
    "matrix": [
        [0.9999999999999987, 0.5598894766435247],
        [0.5598894766435247, 1.0000000000000002]
    ]
};

const interpretationData = [
    { "range": "1.000", "label": "Same Category<br>(Perfect Match)", "color": "#e74c3c" },
    { "range": "0.80 - 0.95", "label": "High Similarity<br>(⚠️ Potential Confusion)", "color": "#f39c12" },
    { "range": "0.50 - 0.80", "label": "Moderate Similarity<br>(Acceptable Separation)", "color": "#9b59b6" },
    { "range": "0.00 - 0.50", "label": "Low Similarity<br>(✓ Easy to Distinguish)", "color": "#2980b9" }
];

// --- PHẦN 1: VẼ HEATMAP BẰNG PLOTLY (Cập nhật config công cụ) ---
const heatmapDivId = 'categorySimilarityHeatmap';
const heatmapDiv = document.getElementById(heatmapDivId);

if (heatmapDiv) {
    let annotations = [];
    let matrix = similarityData.matrix;
    let labels = similarityData.authors;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let val = matrix[i][j];
            annotations.push({
                x: labels[j],
                y: labels[i],
                text: val.toFixed(3),
                showarrow: false,
                font: {
                    color: val > 0.8 ? 'black' : 'white', 
                    size: 14,
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
        colorscale: 'magma',
        showscale: true,
        colorbar: {
            title: 'Similarity Score',
            titleside: 'right',
            tickfont: { family: 'Inter' }
        }
    }];

    let layout = {
        xaxis: { title: '', tickfont: { family: 'Inter' } },
        yaxis: { 
            title: '', 
            autorange: 'reversed',
            tickfont: { family: 'Inter' }
        },
        annotations: annotations,
        margin: { t: 40, b: 40, l: 60, r: 20 }, // Tăng margin top một chút để thanh công cụ không đè lên biểu đồ
        height: 450,
        font: { family: 'Inter' }
    };

    // CẬP NHẬT CONFIG TẠI ĐÂY
    let config = { 
        responsive: true, 
        displayModeBar: true,  // BẬT THANH TIỆN ÍCH
        displaylogo: false,    // Ẩn logo Plotly cho sạch giao diện
        modeBarButtonsToRemove: ['select2d', 'lasso2d'], // Xóa các nút chọn vùng không cần thiết cho Heatmap
        toImageButtonOptions: {
            format: 'png', // Định dạng ảnh khi tải về
            filename: 'author_similarity_matrix',
            height: 500,
            width: 700,
            scale: 2 // Tăng chất lượng ảnh (x2) khi tải về
        }
    };

    Plotly.newPlot(heatmapDivId, plotData, layout, config);

    // --- PHẦN 2: THÊM SUBTITLE VÀ INTERPRETATION GUIDE ---
    // Lấy vùng chứa cha (thẻ div card màu trắng bao ngoài)
    const parentContainer = heatmapDiv.parentElement;

    // 1. Tạo Subtitle màu xanh lá cây
    const subtitle = document.createElement('p');
    subtitle.className = "text-green-700 font-medium text-sm mt-2 mb-8";
    subtitle.innerHTML = "Stopwords Removed - Content-based category similarity (mean pairwise)";
    
    // 2. Tạo phần Interpretation Guide Header
    const guideHeader = document.createElement('h3');
    guideHeader.className = "font-bold text-xl text-slate-700 mb-6";
    guideHeader.innerHTML = "Interpretation Guide";

    // 3. Tạo Grid chứa 4 ô màu
    const guideGrid = document.createElement('div');
    guideGrid.className = "grid grid-cols-1 md:grid-cols-4 gap-4";

    interpretationData.forEach(item => {
        const card = document.createElement('div');
        // Sử dụng inline-style cho background-color để nhận mã HEX chính xác từ JSON
        card.style.backgroundColor = item.color;
        card.className = "p-6 rounded-sm text-white text-center shadow-sm flex flex-col justify-center min-h-[120px]";
        
        card.innerHTML = `
            <div class="font-bold text-xl mb-2">${item.range}</div>
            <div class="text-xs opacity-90 leading-tight">${item.label}</div>
        `;
        guideGrid.appendChild(card);
    });

    // Chèn các phần tử vừa tạo vào sau thẻ div Plotly
    parentContainer.appendChild(subtitle);
    parentContainer.appendChild(guideHeader);
    parentContainer.appendChild(guideGrid);
}

// ==========================================
// 10. MOST FREQUENT WORDS OVERALL (Biểu đồ cột dọc)
// ==========================================
const overallFrequentData = {
    "title": "Top 20 Frequent Words",
    "labels": ["health", "patients", "methods", "findings", "among", "significant", "risk", "associated", "factors", "significantly", "across", "disease", "compared", "potential", "higher", "system", "including", "studies", "high", "participants"],
    "datasets": [{
        "label": "Frequency",
        "data": [2355, 1706, 1491, 1442, 1438, 1376, 1303, 1208, 1170, 1169, 1115, 1037, 1036, 1032, 1021, 1020, 984, 973, 969, 963]
    }]
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