/**
 * ASSIGNMENT 2 - IMAGE ML - DATA LOADER
 * Load all model result JSON files into window.ASS2_IMAGE_RESULTS
 */
(function() {
    'use strict';

    const RESULT_FILES = [
        // Traditional ML
        { id: 'traditional_LogisticRegression', label: 'Logistic Regression', group: 'Traditional ML', path: './results/traditional_ML/LogisticRegression/results.json' },
        { id: 'traditional_SVM', label: 'SVM', group: 'Traditional ML', path: './results/traditional_ML/SVM/results.json' },
        { id: 'traditional_DecisionTree', label: 'Decision Tree', group: 'Traditional ML', path: './results/traditional_ML/DecisionTree/results.json' },
        { id: 'traditional_RandomForest', label: 'Random Forest', group: 'Traditional ML', path: './results/traditional_ML/RandomForest/results.json' },
        { id: 'traditional_NaiveBayes', label: 'Naive Bayes', group: 'Traditional ML', path: './results/traditional_ML/NaiveBayes/results.json' },
        { id: 'traditional_AdaBoost', label: 'AdaBoost', group: 'Traditional ML', path: './results/traditional_ML/AdaBoost/results.json' },
        { id: 'traditional_VotingClassifier', label: 'Voting Classifier', group: 'Traditional ML', path: './results/traditional_ML/VotingClassifier/results.json' },

        // Pipelines
        { id: 'pipeline_PCA_LogisticRegression', label: 'PCA + Logistic Regression', group: 'Pipelines', path: './results/pipeline/PCA_LogisticRegression/results.json' },
        { id: 'pipeline_PCA_DecisionTree', label: 'PCA + Decision Tree', group: 'Pipelines', path: './results/pipeline/PCA_DecisionTree/results.json' },
        { id: 'pipeline_PCA_SVC', label: 'PCA + SVC', group: 'Pipelines', path: './results/pipeline/PCA_SVC/results.json' },
        { id: 'pipeline_UMAP_LogisticRegression', label: 'UMAP + Logistic Regression', group: 'Pipelines', path: './results/pipeline/UMAP_LogisticRegression/results.json' },
        { id: 'pipeline_UMAP_DecisionTree', label: 'UMAP + Decision Tree', group: 'Pipelines', path: './results/pipeline/UMAP_DecisionTree/results.json' },
        { id: 'pipeline_UMAP_SVC', label: 'UMAP + SVC', group: 'Pipelines', path: './results/pipeline/UMAP_SVC/results.json' },

        // Fine-tuning
        { id: 'finetune_ViT16B', label: 'ViT-Base/16 Fine-tuning', group: 'Fine-tuning', path: './results/Fine-tuning/ViT16B/results.json' },
        { id: 'finetune_ResNet18_None', label: 'ResNet18 Fine-tuning', group: 'Fine-tuning', path: './results/Fine-tuning/ResNet18_None/results.json' }
    ];

    async function loadJson(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Fetch failed: ${path} (${response.status} ${response.statusText})`);
        }
        return response.json();
    }

    async function loadAllResults() {
        console.log('⏳ Loading Assignment 2 Image ML results...');

        try {
            const results = await Promise.all(
                RESULT_FILES.map(async (meta) => ({
                    ...meta,
                    data: await loadJson(meta.path)
                }))
            );

            window.ASS2_IMAGE_RESULTS = {
                generatedAt: new Date().toISOString(),
                models: results
            };

            console.log(`✅ Loaded ${results.length} model result files.`);

            if (typeof window.initializeAss2ImageMl === 'function') {
                window.initializeAss2ImageMl();
            } else {
                console.warn('⚠️ Missing window.initializeAss2ImageMl() to render results.');
            }
        } catch (error) {
            console.error('❌ Failed to load results:', error);
            const errorBox = document.getElementById('pageErrorBox');
            if (errorBox) {
                errorBox.classList.remove('hidden');
                errorBox.innerText = `Failed to load ML results. Check console for details.\n${error.message || error}`;
            } else {
                alert('Không thể tải kết quả ML! Hãy kiểm tra Console để xem lỗi đường dẫn hoặc JSON.');
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllResults);
    } else {
        loadAllResults();
    }
})();
