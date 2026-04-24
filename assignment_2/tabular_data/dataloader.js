async function loadTabularMLData() {
    console.log("⏳ Loading Tabular ML Data...");
    try {
        const [modelsRes, thresholdRes, testRes] = await Promise.all([
            fetch('./data/validation_charts_6_models_2.json'),
            fetch('./data/threshold_tuning_best_model.json'),
            fetch('./data/best_model_test_chart_2.json')
        ]);

        window.TABULAR_ML = {
            validationModels: await modelsRes.json(),
            thresholdTuning: await thresholdRes.json(),
            bestModelTest: await testRes.json()
        };

        console.log("✅ Tabular ML Data Ready!");
        if (typeof window.renderMLResults === 'function') window.renderMLResults();
    } catch (e) {
        console.error("❌ Error loading Tabular JSON:", e);
    }
}
loadTabularMLData();