let rocChart, prChart; // Biến toàn cục để lưu instance chart

const modelInsights = {
    "Dummy": `
        • High Accuracy (0.9058) is misleading because the model predicts only the majority class.<br>
        • It missed all positive cases: TP = 0, FN = 3,584.<br>
        • Recall = 0.0000 and F1-score = 0.0000 show that the model cannot detect the minority class.<br>
        • ROC-AUC = 0.5000 means no real discriminative ability.<br>
        • This confirms that accuracy alone is not enough for imbalanced classification.`,
    
    "LogisticRegression_Balanced": `
        • The model learned meaningful patterns, with strong ROC-AUC = 0.8454 and PR-AUC = 0.3655.<br>
        • Recall = 0.7974 means it detected most actual positive cases.<br>
        • The confusion matrix shows 2,858 true positives and only 726 missed positives.<br>
        • However, Precision = 0.2467 indicates many false positives.<br>
        • This model is <strong>recall-oriented</strong>: it prioritizes detecting positive cases over minimizing false alarms.`,
    
    "RandomForest_Balanced": `
        • ROC-AUC = 0.8457 and PR-AUC = 0.3640 show that Random Forest learned meaningful patterns.<br>
        • Recall = 0.7726 means the model detected a large portion of actual positive cases.<br>
        • The confusion matrix shows 2,769 true positives and 815 missed positives.<br>
        • Compared with more recall-oriented models, Random Forest produced fewer false positives.<br>
        • This means Random Forest is <strong>more conservative</strong> when predicting positive cases.`,
    
    "ExtraTrees_Balanced": `
        • ROC-AUC = 0.8441 and PR-AUC = 0.3634 show that Extra Trees learned meaningful predictive patterns.<br>
        • Recall = 0.8022 means the model detected a very large portion of actual positive cases.<br>
        • The confusion matrix shows 2,875 true positives and only 709 missed positives.<br>
        • However, Precision = 0.2405 indicates many false positives (9,079).<br>
        • This model is <strong>recall-oriented</strong>: it prioritizes detection even at the cost of more false alarms.`,
    
    "HistGradientBoosting_Balanced": `
        • ROC-AUC = 0.8482 and PR-AUC = 0.3729 show very strong ranking performance.<br>
        • Recall = 0.8200 means the model detected the <strong>highest proportion</strong> of actual positive cases.<br>
        • The confusion matrix shows 2,939 true positives and only 645 missed positives.<br>
        • However, Precision = 0.2376 indicates many false positives (9,432).<br>
        • This model strongly prioritizes detecting positive cases over false alarms.`,
    
    "XGBoost_Balanced": `
        • ROC-AUC = 0.8485 and PR-AUC = 0.3753 show the <strong>best overall ranking performance</strong>.<br>
        • Recall = 0.8145 means the model detected most actual positive cases.<br>
        • The confusion matrix shows 2,919 true positives and 665 missed positives.<br>
        • Compared with HistGradientBoosting, XGBoost keeps strong Recall while slightly improving Precision.<br>
        • This indicates a <strong>better balance</strong> between ranking ability and minority-class detection.`
};

window.renderMLResults = function() {
    const data = window.TABULAR_ML.validationModels;
    const selector = document.getElementById('modelSelector');

    // Hàm cập nhật toàn bộ nội dung dựa trên model được chọn
    function updateDashboard(modelName) {
        const modelInfo = data.models.find(m => m.model_name === modelName);
        if (!modelInfo) return;

        const insightContainer = document.getElementById('individual-insight');
        const text = modelInsights[modelName] || "No insights available for this model.";

        insightContainer.innerHTML = `
            <div class="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 border-l-4 border-l-indigo-500 shadow-sm transition-all duration-500">
                <h5 class="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <span>💡</span> Model Specific Insight
                </h5>
                <p class="text-xs text-slate-600 leading-relaxed font-medium italic">
                    "${text}"
                </p>
            </div>
        `;
        
        // 1. Cập nhật Metrics
        const metricsContainer = document.getElementById('individual-metrics');
        const m = modelInfo.metrics;
        const metricsToShow = [
            { label: 'ROC-AUC', val: m.roc_auc, color: 'text-indigo-600' },
            { label: 'PR-AUC', val: m.pr_auc, color: 'text-rose-600' },
            { label: 'F1-Score', val: m.f1, color: 'text-purple-600' },
            { label: 'Recall', val: m.recall, color: 'text-emerald-600' }
        ];
        metricsContainer.innerHTML = metricsToShow.map(item => `
            <div class="bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                <div class="text-[10px] text-slate-400 uppercase font-bold">${item.label}</div>
                <div class="text-xl font-black ${item.color}">${item.val.toFixed(4)}</div>
            </div>
        `).join('');

        // 2. Cập nhật Confusion Matrix
        const cm = modelInfo.confusion_matrix;
        document.getElementById('individual-cm').innerHTML = `
            <div class="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div class="p-2"></div>
                <div class="p-2 bg-slate-200 rounded text-slate-600">Pred: NO</div>
                <div class="p-2 bg-slate-200 rounded text-slate-600">Pred: YES</div>
                <div class="p-2 bg-slate-200 rounded flex items-center justify-center text-slate-600">Actual: NO</div>
                <div class="p-4 bg-emerald-500 text-white rounded shadow-inner">${cm.matrix[0][0]}</div>
                <div class="p-4 bg-orange-100 text-orange-800 rounded">${cm.matrix[0][1]}</div>
                <div class="p-2 bg-slate-200 rounded flex items-center justify-center text-slate-600">Actual: YES</div>
                <div class="p-4 bg-orange-100 text-orange-800 rounded">${cm.matrix[1][0]}</div>
                <div class="p-4 bg-emerald-500 text-white rounded shadow-inner">${cm.matrix[1][1]}</div>
            </div>
        `;

        // 3. Vẽ ROC Curve
        if (rocChart) rocChart.destroy();
        rocChart = new Chart(document.getElementById('rocCurveChart'), {
            type: 'line',
            data: {
                labels: modelInfo.roc_curve.fpr,
                datasets: [{
                    label: 'ROC Curve',
                    data: modelInfo.roc_curve.tpr,
                    borderColor: '#4f46e5',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.05)',
                    pointRadius: 0
                }, {
                    label: 'Baseline',
                    data: [0, 1], // Đường chéo 45 độ
                    borderColor: '#cbd5e1',
                    borderDash: [5, 5],
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { 
                    x: { title: { display: true, text: 'False Positive Rate' }, type: 'linear', min: 0, max: 1 },
                    y: { title: { display: true, text: 'True Positive Rate' }, min: 0, max: 1 }
                },
                plugins: { legend: { display: false } }
            }
        });

        // 4. Vẽ PR Curve
        if (prChart) prChart.destroy();
        prChart = new Chart(document.getElementById('prCurveChart'), {
            type: 'line',
            data: {
                labels: modelInfo.pr_curve.recall,
                datasets: [{
                    label: 'PR Curve',
                    data: modelInfo.pr_curve.precision,
                    borderColor: '#f43f5e',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: 'rgba(244, 63, 94, 0.05)',
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { 
                    x: { title: { display: true, text: 'Recall' }, type: 'linear', min: 0, max: 1 },
                    y: { title: { display: true, text: 'Precision' }, min: 0, max: 1 }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
    // ==========================================
    // 10. VẼ BIỂU ĐỒ THRESHOLD TUNING // ==========================================
// 10. VẼ BIỂU ĐỒ THRESHOLD TUNING (BẢN FIX GIỐNG MẪU 100%)
// ==========================================
const threshData = window.TABULAR_ML.thresholdTuning;
const ctxThresh = document.getElementById('thresholdTuningChart');

if (threshData && ctxThresh) {
    // 1. QUAN TRỌNG: Gộp và Sắp xếp data theo Threshold tăng dần (0.1 -> 0.9)
    // Nếu không có bước này, biểu đồ sẽ bị răng cưa/nét vẽ chồng chéo
    const points = threshData.curves.threshold.map((t, i) => ({
        x: t,
        f1: threshData.curves.f1[i],
        pre: threshData.curves.precision[i],
        rec: threshData.curves.recall[i]
    })).sort((a, b) => a.x - b.x);

    new Chart(ctxThresh.getContext('2d'), {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'F1',
                    data: points.map(p => ({ x: p.x, y: p.f1 })),
                    borderColor: '#1f77b4', // Màu xanh dương chuẩn Matplotlib
                    backgroundColor: '#1f77b4',
                    borderWidth: 2,
                    pointRadius: 0, // Ẩn điểm chấm để đường mượt như Python
                    fill: false,
                    tension: 0.1 // Độ cong nhẹ
                },
                {
                    label: 'Recall',
                    data: points.map(p => ({ x: p.x, y: p.rec })),
                    borderColor: '#ff7f0e', // Màu cam chuẩn Matplotlib
                    backgroundColor: '#ff7f0e',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Precision',
                    data: points.map(p => ({ x: p.x, y: p.pre })),
                    borderColor: '#2ca02c', // Màu xanh lá chuẩn Matplotlib
                    backgroundColor: '#2ca02c',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                // Đặt chú thích nằm bên trong khung hoặc bên trái
                legend: {
                    display: true,
                    position: 'left', 
                    labels: { boxWidth: 15, font: { family: 'Inter', size: 12 } }
                },
                // Vẽ đường đỏ đứt đoạn "Best threshold = 0.69"
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            xMin: 0.69,
                            xMax: 0.69,
                            borderColor: 'red',
                            borderWidth: 2,
                            borderDash: [6, 6], // Nét đứt
                            label: {
                                display: true,
                                content: 'Best threshold = 0.69',
                                position: 'start', // Đặt nhãn ở phía trên
                                yAdjust: -10,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                color: 'red',
                                font: { size: 11, weight: 'bold', family: 'Inter' }
                            }
                        }
                    }
                },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: {
                    type: 'linear', // Dùng linear để khoảng cách các mốc chính xác
                    min: 0.1,
                    max: 0.9,
                    title: { display: true, text: 'Threshold', font: { weight: 'bold', size: 13 } },
                    grid: { color: '#f1f5f9' },
                    ticks: { stepSize: 0.1 }
                },
                y: {
                    min: 0,
                    max: 1.0,
                    title: { display: true, text: 'Score', font: { weight: 'bold', size: 13 } },
                    grid: { color: '#f1f5f9' }
                }
            }
        }
    });
}
    // Lắng nghe sự kiện đổi model
    selector.addEventListener('change', (e) => updateDashboard(e.target.value));

    // Khởi tạo lần đầu với XGBoost
    updateDashboard('XGBoost_Balanced');
};