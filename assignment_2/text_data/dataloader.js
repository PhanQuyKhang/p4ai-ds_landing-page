(function() {
    'use strict';

    // Khởi tạo cấu trúc rỗng để tránh lỗi "undefined" ngay từ đầu
    window.TEXT_ML_DATA = {
        traditional: { results: [], performance: [], config: "", matrix: {} },
        pipeline: { results: [], performance: [], config: "", matrix: {} },
        deeplearning: { results: [], performance: [], config: "", matrix: {} }
    };

    // Hàm chuyển đổi nội dung CSV sang mảng 2 chiều và LÀM TRÒN SỐ LUÔN
    function parseCSV(text) {
        if (!text || text.trim() === "") return [];
        
        return text.trim().split("\n").map(line => 
            line.split(",").map(cell => {
                let cleanCell = cell.trim().replace(/^"|"$/g, ''); // Xóa dấu ngoặc kép nếu có
                
                // LOGIC XỬ LÝ SỐ TỔNG THỂ:
                // Kiểm tra nếu ô không trống và là một con số hợp lệ
                if (cleanCell !== "" && !isNaN(cleanCell) && !isNaN(parseFloat(cleanCell))) {
                    const num = parseFloat(cleanCell);
                    
                    // Nếu là số nguyên (như 73, 100) thì giữ nguyên
                    if (Number.isInteger(num)) {
                        return num.toString();
                    }
                    
                    // Nếu là số thập phân, làm tròn lấy 2 chữ số
                    return num.toFixed(2);
                }
                
                return cleanCell; // Nếu là chữ (Header) thì giữ nguyên
            })
        );
    }

    async function loadAllTextMLData() {
        console.log("⏳ Đang tải toàn bộ dữ liệu Machine Learning...");
        const baseUrl = './data'; 

        try {
            const responses = await Promise.all([
                // --- Traditional ML (Index 0-7) ---
                fetch(`${baseUrl}/traditional_ml/traditional_ml_result.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/traditional_ml/traditional_ml_config.txt`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/traditional_ml/traditional_ml_logistic.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/traditional_ml/traditional_ml_naive_bayes.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/traditional_ml/traditional_ml_linear_svm.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/traditional_ml/traditional_ml_sgd_logistic.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/traditional_ml/traditional_ml_sgd_svm.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/traditional_ml/traditional_ml_xgboost.csv`).then(r => r.ok ? r.text() : ""),
                
                // --- Pipeline (Index 8-14) ---
                fetch(`${baseUrl}/pipeline_traditional/traditional_pipeline_result.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/pipeline_traditional/traditional_pipeline_config.txt`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/pipeline_traditional/traditional_pipeline_bow-chi2-sgd.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/pipeline_traditional/traditional_pipeline_bow-none-sgd.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/pipeline_traditional/traditional_pipeline_tfidf_chi2_log.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/pipeline_traditional/traditional_pipeline_tfidf_none_log.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/pipeline_traditional/traditional_pipeline_tfidf_none_sgd.csv`).then(r => r.ok ? r.text() : ""),
                
                // --- Deep Learning (Index 15-24) ---
                fetch(`${baseUrl}/bert_finetune_pubmed/results_sumary_final.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_config.txt`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_pubmed-cls.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_pubmed-mean.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_pubmed-pooler.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_distil-cls.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_distil-mean.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_tiny-cls.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_tiny-mean.csv`).then(r => r.ok ? r.text() : ""),
                fetch(`${baseUrl}/bert_finetune_pubmed/deeplearning_tiny-pooler.csv`).then(r => r.ok ? r.text() : "")
            ]);

            // Gán dữ liệu Traditional
            window.TEXT_ML_DATA.traditional = {
                performance: parseCSV(responses[0]),
                config: responses[1],
                matrix: {
                    logistic: parseCSV(responses[2]),
                    naive_bayes: parseCSV(responses[3]),
                    linear_svm: parseCSV(responses[4]),
                    sgd_logistic: parseCSV(responses[5]),
                    sgd_svm: parseCSV(responses[6]),
                    xgboost: parseCSV(responses[7])
                }
            };

            // Gán dữ liệu Pipeline
            window.TEXT_ML_DATA.pipeline = {
                performance: parseCSV(responses[8]),
                config: responses[9],
                matrix: {
                    bow_chi2_sgd: parseCSV(responses[10]),
                    bow_none_sgd: parseCSV(responses[11]),
                    tfidf_chi2_log: parseCSV(responses[12]),
                    tfidf_none_log: parseCSV(responses[13]),
                    tfidf_none_sgd: parseCSV(responses[14]),
                }
            };

            // Gán dữ liệu Deep Learning (Đầy đủ các biến thể)
            window.TEXT_ML_DATA.deeplearning = {
                performance: parseCSV(responses[15]),
                config: responses[16],
                matrix: {
                    pubmed_cls: parseCSV(responses[17]),
                    pubmed_mean: parseCSV(responses[18]),
                    pubmed_pooler: parseCSV(responses[19]),
                    distil_cls: parseCSV(responses[20]),
                    distil_mean: parseCSV(responses[21]),
                    tiny_cls: parseCSV(responses[22]),
                    tiny_mean: parseCSV(responses[23]),
                    tiny_pooler: parseCSV(responses[24])
                }
            };

            console.log("✅ Đã tải thành công 24 file dữ liệu!");
            if (typeof window.renderAllMLCharts === 'function') window.renderAllMLCharts();
        } catch (error) {
            console.error("❌ Lỗi load dữ liệu:", error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllTextMLData);
    } else {
        loadAllTextMLData();
    }
})();