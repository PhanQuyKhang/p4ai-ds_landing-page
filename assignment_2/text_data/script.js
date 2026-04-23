/**
 * TEXT ML - MAIN SCRIPT (Group APlus)
 */

// ==========================================
// 1. HÀM CHUYỂN TAB (SWITCH TAB)
// ==========================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(section => section.classList.add('hidden'));
    const activeSection = document.getElementById(`section-${tabId}`);
    if (activeSection) activeSection.classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-purple-600', 'text-purple-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });

    const activeBtn = document.getElementById(`btn-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'text-gray-500');
        activeBtn.classList.add('border-purple-600', 'text-purple-600');
    }
}

// ==========================================
// 2. HÀM RENDER CHÍNH (Được gọi từ dataloader.js)
// ==========================================
window.renderAllMLCharts = function() {
    const data = window.TEXT_ML_DATA;
    if (!data) return;

    console.log("🎨 Đang render toàn bộ dữ liệu từ 22 file...");

    // ==========================================
    // 1. TAB 1: TRADITIONAL ML
    // ==========================================
    const trad = data.traditional;
    // Bảng Performance
    renderPerformanceTable('traditional-results-table', trad.performance);
    // Config Cards
    const tradConfig = parseTraditionalML(trad.config);
    uiRenderConfig('traditional-config-container', tradConfig);
    // Toàn bộ 6 Ma trận Confusion Matrix
    const tradGrid = document.getElementById('traditional-matrix-grid');
    if (tradGrid) {
        tradGrid.innerHTML = ''; // Xóa trắng trước khi vẽ
        renderConfusionMatrix('traditional-matrix-grid', 'Logistic Regression', trad.matrix.logistic);
        renderConfusionMatrix('traditional-matrix-grid', 'Naive Bayes', trad.matrix.naive_bayes);
        renderConfusionMatrix('traditional-matrix-grid', 'Linear SVM', trad.matrix.linear_svm);
        renderConfusionMatrix('traditional-matrix-grid', 'SGD (Logistic)', trad.matrix.sgd_logistic);
        renderConfusionMatrix('traditional-matrix-grid', 'SGD (SVM)', trad.matrix.sgd_svm);
        renderConfusionMatrix('traditional-matrix-grid', 'XGBoost', trad.matrix.xgboost);
    }


    // ==========================================
    // 2. TAB 2: TRADITIONAL PIPELINE
    // ==========================================
    const pipe = data.pipeline;
    // Bảng Performance
    renderPerformanceTable('pipeline-results-table', pipe.performance);
    // Config Cards
    const pipeConfig = parsePipeline(pipe.config);
    uiRenderConfig('pipeline-config-grid', pipeConfig);
    // Toàn bộ 2 Ma trận Confusion Matrix
    const pipeGrid = document.getElementById('pipeline-matrix-grid');
    if (pipeGrid) {
        pipeGrid.innerHTML = '';
        renderConfusionMatrix('pipeline-matrix-grid', 'BoW + Chi2 + SGD', pipe.matrix.bow_chi2_sgd);
        renderConfusionMatrix('pipeline-matrix-grid', 'BoW + None + SGD', pipe.matrix.bow_none_sgd);
    }


    // ==========================================
    // 3. TAB 3: DEEP LEARNING (BERT)
    // ==========================================
    const dl = data.deeplearning;
    // Bảng Performance (Results Summary Final)
    renderPerformanceTable('deeplearning-results-table', dl.performance);
    // Config Cards (Hyperparameters)
    const dlConfig = parseDeepLearning(dl.config);
    uiRenderConfig('deeplearning-config-grid', dlConfig);
    // Toàn bộ 8 Ma trận Confusion Matrix (Quan trọng - Đủ 8 biến thể)
    const dlGrid = document.getElementById('deeplearning-matrix-grid');
    if (dlGrid) {
        dlGrid.innerHTML = '';
        // PubMedBERT Variants
        renderConfusionMatrix('deeplearning-matrix-grid', 'PubMedBERT + CLS', dl.matrix.pubmed_cls);
        renderConfusionMatrix('deeplearning-matrix-grid', 'PubMedBERT + Mean', dl.matrix.pubmed_mean);
        renderConfusionMatrix('deeplearning-matrix-grid', 'PubMedBERT + Pooler', dl.matrix.pubmed_pooler);
        // DistilBERT Variants
        renderConfusionMatrix('deeplearning-matrix-grid', 'DistilBERT + CLS', dl.matrix.distil_cls);
        renderConfusionMatrix('deeplearning-matrix-grid', 'DistilBERT + Mean', dl.matrix.distil_mean);
        // TinyBERT Variants
        renderConfusionMatrix('deeplearning-matrix-grid', 'TinyBERT + CLS', dl.matrix.tiny_cls);
        renderConfusionMatrix('deeplearning-matrix-grid', 'TinyBERT + Mean', dl.matrix.tiny_mean);
        renderConfusionMatrix('deeplearning-matrix-grid', 'TinyBERT + Pooler', dl.matrix.tiny_pooler);
    }

    console.log('✅ Hoàn tất render toàn bộ 22 biểu đồ và bảng biểu!');
};

// ==========================================
// 3. CÁC HÀM HELPER RENDER
// ==========================================

// --- Vẽ Bảng Kết Quả Performance ---
function renderPerformanceTable(containerId, csvData) {
    if (!csvData || csvData.length === 0) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `<div class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table class="w-full text-left text-sm font-medium">`;
    
    csvData.forEach((row, index) => {
        const isHeader = index === 0;
        const tag = isHeader ? 'th' : 'td';
        const rowClass = isHeader ? 'bg-purple-600 text-white uppercase tracking-wider' : 'border-b hover:bg-slate-50 transition';
        
        html += `<tr class="${rowClass}">`;
        row.forEach((cell, cellIdx) => {
            // Highlight cột Rank hoặc tên Model
            const cellClass = cellIdx === 1 && !isHeader ? "font-bold text-slate-800" : "";
            html += `<${tag} class="p-4 ${cellClass}">${cell}</${tag}>`;
        });
        html += `</tr>`;
    });
    
    html += `</table></div>`;
    container.innerHTML = html;
}

// --- Vẽ Ma Trận Nhầm Lẫn (Confusion Matrix) 5x5 + F1 Row ---
function renderConfusionMatrix(containerId, modelName, csvData) {
    if (!csvData || csvData.length < 6) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    const headers = csvData[0]; // BACKGROUND, CONCLUSIONS...
    const matrixBody = csvData.slice(1, 6); // Lấy 5 dòng dữ liệu chính
    const f1Row = csvData[csvData.length - 1]; // Dòng cuối cùng (F1 Score) theo yêu cầu của Khoa

    const wrapper = document.createElement('div');
    wrapper.className = "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4";
    
    let html = `
        <h4 class="font-bold text-slate-700 flex items-center gap-2">
            <span class="w-1 h-4 bg-orange-400 rounded-full"></span> ${modelName}
        </h4>
        <div class="grid grid-cols-6 gap-1 text-[10px] sm:text-xs text-center font-bold">
            <div class="p-2 bg-slate-100 italic text-slate-400">Act\\Pre</div>
            ${headers.slice(1).map(h => `<div class="p-2 bg-slate-800 text-white uppercase">${h.substring(0,4)}</div>`).join('')}
    `;

    matrixBody.forEach((row, i) => {
        // Label cột bên trái
        html += `<div class="p-2 bg-slate-100 text-slate-600 flex items-center justify-center uppercase font-black border-r">${row[0].substring(0,4)}</div>`;
        
        // Dữ liệu số
        row.slice(1).forEach((val, j) => {
            const isDiagonal = (i === j); // Đường chéo chính
            const num = parseInt(val);
            // Màu xanh cho đúng, màu cam đậm nhạt cho sai
            let colorClass = isDiagonal ? "bg-emerald-500 text-white shadow-inner" : "bg-slate-50 text-slate-400";
            if (!isDiagonal && num > 10) colorClass = "bg-orange-100 text-orange-800";
            if (!isDiagonal && num > 100) colorClass = "bg-orange-200 text-orange-900";

            html += `<div class="${colorClass} p-2 flex items-center justify-center rounded-sm transition-all hover:scale-110 cursor-default" title="Actual: ${row[0]}, Pred: ${headers[j+1]}">${num.toLocaleString()}</div>`;
        });
    });

    // Thêm dòng F1 Score cuối cùng
    html += `<div class="p-2 bg-purple-600 text-white rounded-bl-lg flex items-center justify-center">F1</div>`;
    f1Row.slice(1).forEach(score => {
        html += `<div class="p-2 bg-purple-50 text-purple-700 font-black border-t border-purple-100">${score}</div>`;
    });

    html += `</div>`;
    wrapper.innerHTML = html;
    container.appendChild(wrapper);
}

function parseTraditionalML(text) {
    const sections = [];
    const blocks = text.split(/\n(?=\d+\.)/g);
    blocks.forEach(block => {
        const lines = block.trim().split('\n');
        const title = lines[0].replace(/^\d+\.\s*/, '').trim();
        const params = [];
        lines.slice(1).forEach(line => {
            if (line.includes(':')) {
                const [k, v] = line.split(':');
                params.push({ key: k.trim(), value: v.trim() });
            }
        });
        if (title) sections.push({ title, params, icon: '⚙️' });
    });
    return sections;
}

function parsePipeline(text) {
    const sections = [];
    // Tách riêng phần Summary đầu file (Base Features, Total Features)
    const parts = text.split(/\n(?=1\.)/g);
    
    // Xử lý phần Summary (Card đầu tiên)
    const summaryLines = parts[0].trim().split('\n');
    const summaryParams = [];
    summaryLines.forEach(line => {
        if (line.includes(':')) {
            const [k, v] = line.split(':');
            summaryParams.push({ key: k.trim(), value: v.trim() });
        }
    });
    sections.push({ title: "Pipeline Summary", params: summaryParams, icon: '📊' });

    // Xử lý các Pipeline cụ thể (từ mục 1 trở đi)
    if (parts[1]) {
        const blocks = parts[1].split(/\n(?=\d+\.)/g);
        blocks.forEach(block => {
            const lines = block.trim().split('\n');
            const title = lines[0].replace(/^\d+\.\s*/, '').trim();
            const params = [];
            lines.slice(1).forEach(line => {
                // Xóa emoji trang trí ở đầu dòng để lấy Key sạch
                let cleanLine = line.replace(/^[🔢🎯🤖📊\s]+/, '');
                if (cleanLine.includes(':')) {
                    const [k, v] = cleanLine.split(':');
                    params.push({ key: k.trim(), value: v.trim() });
                }
            });
            sections.push({ title, params, icon: '🚀' });
        });
    }
    return sections;
}

function parseDeepLearning(text) {
    const sections = [];
    // Tách dựa trên Emoji ở đầu dòng
    const blocks = text.split(/\n(?=🔤|🤖)/g);
    blocks.forEach(block => {
        const lines = block.trim().split('\n');
        const title = lines[0].replace(/[🔤🤖]/g, '').trim();
        const icon = lines[0].includes('🔤') ? '🔤' : '🤖';
        const params = [];
        lines.slice(1).forEach(line => {
            if (line.includes(':')) {
                const [k, v] = line.split(':');
                params.push({ key: k.trim(), value: v.trim() });
            }
        });
        if (title) sections.push({ title, params, icon });
    });
    return sections;
}

function uiRenderConfig(containerId, structuredData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    structuredData.forEach(section => {
        const card = document.createElement('div');
        card.className = "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full";
        
        const paramsHtml = section.params.map(p => `
            <div class="flex justify-between items-start py-2 border-b border-slate-50 last:border-0">
                <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-tight">${p.key}</span>
                <span class="text-[11px] text-slate-800 font-bold text-right ml-4">${p.value}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 text-lg">${section.icon}</div>
                <h4 class="font-bold text-xs text-indigo-900 uppercase tracking-tighter">${section.title}</h4>
            </div>
            <div class="flex-grow space-y-0.5">${paramsHtml}</div>
        `;
        container.appendChild(card);
    });
}
