let rocChart, prChart; // Biến toàn cục để lưu instance chart

window.renderMLResults = function() {
    const data = window.TABULAR_ML.validationModels;
    const selector = document.getElementById('modelSelector');

    // Hàm cập nhật toàn bộ nội dung dựa trên model được chọn
    function updateDashboard(modelName) {
        const modelInfo = data.models.find(m => m.model_name === modelName);
        if (!modelInfo) return;

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

    // Lắng nghe sự kiện đổi model
    selector.addEventListener('change', (e) => updateDashboard(e.target.value));

    // Khởi tạo lần đầu với XGBoost
    updateDashboard('XGBoost_Balanced');
};