/**
 * ASSIGNMENT 2 - IMAGE ML - MAIN JAVASCRIPT (RENDERING)
 * Render model comparison + per-model details using data in window.ASS2_IMAGE_RESULTS
 */
(function() {
    'use strict';

    const COLORS = {
        emerald: '#10b981',
        blue: '#60a5fa',
        orange: '#fb923c',
        violet: '#a78bfa',
        slate: '#334155'
    };

    const CHART_INSTANCES = new Map();

    function getElement(id) {
        return document.getElementById(id);
    }

    function safeNumber(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function formatSeconds(seconds) {
        const s = safeNumber(seconds, 0);
        if (s < 60) return `${s.toFixed(1)}s`;
        const minutes = Math.floor(s / 60);
        const remain = s - minutes * 60;
        return `${minutes}m ${remain.toFixed(0)}s`;
    }

    function toPercent(value, digits = 2) {
        return `${(safeNumber(value, 0) * 100).toFixed(digits)}%`;
    }

    function getOverallMetrics(modelData) {
        const report = modelData.classification_report || {};
        return {
            accuracy: safeNumber(modelData.accuracy ?? report.accuracy, NaN),
            f1: safeNumber(modelData.f1_score ?? report['weighted avg']?.['f1-score'], NaN),
            trainingTimeSeconds: safeNumber(modelData.training_time_seconds, NaN)
        };
    }

    function destroyChartIfExists(canvasId) {
        const existing = CHART_INSTANCES.get(canvasId);
        if (existing) {
            existing.destroy();
            CHART_INSTANCES.delete(canvasId);
        }
    }

    function renderBarChart(canvasId, labels, datasets, yLabel) {
        const canvas = getElement(canvasId);
        if (!canvas) return;

        destroyChartIfExists(canvasId);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        Chart.defaults.font.family = "'Inter', sans-serif";
        const chart = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { intersect: false, mode: 'index' }
                },
                scales: {
                    x: { ticks: { maxRotation: 45, minRotation: 45 } },
                    y: { title: { display: true, text: yLabel }, beginAtZero: true }
                }
            }
        });

        CHART_INSTANCES.set(canvasId, chart);
    }

    function buildConfusionMatrix(classes, flatList) {
        const classIndex = new Map(classes.map((c, i) => [c, i]));
        const matrix = Array.from({ length: classes.length }, () => Array(classes.length).fill(0));

        (flatList || []).forEach((cell) => {
            const xLabel = cell?.x; // predicted
            const yLabel = cell?.y; // true
            const value = safeNumber(cell?.value, 0);
            if (!classIndex.has(xLabel) || !classIndex.has(yLabel)) return;
            matrix[classIndex.get(yLabel)][classIndex.get(xLabel)] = value;
        });

        return matrix;
    }

    function renderConfusionMatrix(divId, classes, flatList) {
        const container = getElement(divId);
        if (!container) return;

        const z = buildConfusionMatrix(classes, flatList);

        const annotations = [];
        for (let i = 0; i < classes.length; i++) {
            for (let j = 0; j < classes.length; j++) {
                const value = z[i][j];
                annotations.push({
                    x: classes[j],
                    y: classes[i],
                    text: String(Math.round(value)),
                    showarrow: false,
                    font: { color: value > 0.6 * Math.max(...z[i]) ? 'white' : 'black', size: 11, family: 'Inter' }
                });
            }
        }

        Plotly.newPlot(
            divId,
            [{
                z,
                x: classes,
                y: classes,
                type: 'heatmap',
                colorscale: 'Blues',
                showscale: true,
                hovertemplate: 'True=%{y}<br>Pred=%{x}<br>Count=%{z}<extra></extra>'
            }],
            {
                margin: { t: 40, b: 80, l: 100, r: 20 },
                yaxis: { autorange: 'reversed', title: { text: 'True label' } },
                xaxis: { title: { text: 'Predicted label' } },
                annotations
            },
            { responsive: true, displayModeBar: false }
        );
    }

    function renderClassificationReportTable(tableBodyId, report) {
        const tbody = getElement(tableBodyId);
        if (!tbody) return;
        tbody.innerHTML = '';

        const rows = Object.entries(report || {})
            .filter(([key, value]) => value && typeof value === 'object' && 'precision' in value && 'recall' in value && 'f1-score' in value)
            .map(([label, value]) => ({
                label,
                precision: safeNumber(value.precision, NaN),
                recall: safeNumber(value.recall, NaN),
                f1: safeNumber(value['f1-score'], NaN),
                support: safeNumber(value.support, NaN)
            }));

        const accentFor = (label) => {
            const key = String(label).toLowerCase();
            if (key.includes('weighted')) return 'bg-violet-50 text-violet-700 border-violet-200';
            if (key.includes('macro')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            return 'bg-slate-50 text-slate-700 border-slate-200';
        };

        const f1BarColorFor = (label) => {
            const key = String(label).toLowerCase();
            if (key.includes('weighted')) return 'bg-violet-500';
            if (key.includes('macro')) return 'bg-emerald-500';
            return 'bg-blue-500';
        };

        rows.forEach((row, index) => {
            const isSummary = String(row.label).toLowerCase().includes('avg');
            const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40';
            const tr = document.createElement('tr');
            tr.className = `border-b border-slate-100 hover:bg-amber-50/30 transition ${rowBg}`;
            tr.innerHTML = `
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                        <span class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${accentFor(row.label)}">
                            ${isSummary ? 'Summary' : 'Class'}
                        </span>
                        <span class="font-semibold text-slate-800 ${isSummary ? '' : 'capitalize'}">${row.label}</span>
                    </div>
                </td>
                <td class="py-3 px-4 tabular-nums font-semibold text-slate-700">${toPercent(row.precision, 2)}</td>
                <td class="py-3 px-4 tabular-nums font-semibold text-slate-700">${toPercent(row.recall, 2)}</td>
                <td class="py-3 px-4 tabular-nums font-extrabold text-slate-900">${toPercent(row.f1, 2)}</td>
                <td class="py-3 px-4 tabular-nums text-slate-700">${Number.isFinite(row.support) ? row.support.toFixed(0) : '-'}</td>
                <td class="py-3 px-4">
                    <div class="w-full max-w-[240px] h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div class="h-full ${f1BarColorFor(row.label)}" style="width:${Math.max(0, Math.min(100, safeNumber(row.f1, 0) * 100))}%"></div>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderModelCards(metrics) {
        const accEl = getElement('selectedAccuracy');
        const f1El = getElement('selectedF1');
        const timeEl = getElement('selectedTime');
        if (accEl) accEl.innerText = Number.isFinite(metrics.accuracy) ? toPercent(metrics.accuracy, 2) : '-';
        if (f1El) f1El.innerText = Number.isFinite(metrics.f1) ? toPercent(metrics.f1, 2) : '-';
        if (timeEl) timeEl.innerText = Number.isFinite(metrics.trainingTimeSeconds) ? formatSeconds(metrics.trainingTimeSeconds) : '-';
    }

    function renderModelDetails(model) {
        const modelTitle = getElement('selectedModelTitle');
        if (modelTitle) modelTitle.innerText = model.label;

        const { accuracy, f1, trainingTimeSeconds } = getOverallMetrics(model.data || {});
        renderModelCards({ accuracy, f1, trainingTimeSeconds });

        const report = model.data?.classification_report || {};
        const classes = Object.keys(report).filter((k) => report[k] && typeof report[k] === 'object' && 'support' in report[k] && !k.includes('avg'));
        const classesFallback = ['buildings', 'forest', 'glacier', 'mountain', 'sea', 'street'];
        const classList = classes.length ? classes : classesFallback;

        renderConfusionMatrix('confusionMatrixHeatmap', classList, model.data?.confusion_matrix);
        renderClassificationReportTable('classReportTableBody', report);
    }

    function renderOverview(models) {
        const labels = models.map((m) => m.label);
        const accuracies = models.map((m) => getOverallMetrics(m.data || {}).accuracy);
        const f1s = models.map((m) => getOverallMetrics(m.data || {}).f1);
        const times = models.map((m) => getOverallMetrics(m.data || {}).trainingTimeSeconds);

        renderBarChart(
            'overviewAccuracyChart',
            labels,
            [{
                label: 'Accuracy',
                data: accuracies,
                backgroundColor: COLORS.emerald
            }],
            'Accuracy'
        );

        renderBarChart(
            'overviewF1Chart',
            labels,
            [{
                label: 'Weighted F1',
                data: f1s,
                backgroundColor: COLORS.blue
            }],
            'Weighted F1'
        );

        renderBarChart(
            'overviewTimeChart',
            labels,
            [{
                label: 'Training time (seconds)',
                data: times,
                backgroundColor: COLORS.orange
            }],
            'Seconds'
        );
    }

    function buildModelSelect(models) {
        const select = getElement('modelSelect');
        if (!select) return;

        select.innerHTML = '';
        const groups = new Map();
        models.forEach((model) => {
            if (!groups.has(model.group)) groups.set(model.group, []);
            groups.get(model.group).push(model);
        });

        for (const [groupName, groupModels] of groups.entries()) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = groupName;
            groupModels.forEach((model) => {
                const option = document.createElement('option');
                option.value = model.id;
                option.innerText = model.label;
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        }
    }

    function wireInteractions(models) {
        const select = getElement('modelSelect');
        if (!select) return;

        select.addEventListener('change', () => {
            const selected = models.find((m) => m.id === select.value) || models[0];
            renderModelDetails(selected);
        });

        const defaultModel = models.find((m) => m.id === select.value) || models[0];
        if (defaultModel) renderModelDetails(defaultModel);
    }

    function initializeAss2ImageMl() {
        const payload = window.ASS2_IMAGE_RESULTS;
        const models = payload?.models || [];
        if (!models.length) {
            const errorBox = getElement('pageErrorBox');
            if (errorBox) {
                errorBox.classList.remove('hidden');
                errorBox.innerText = 'No model results found.';
            }
            return;
        }

        buildModelSelect(models);
        renderOverview(models);
        wireInteractions(models);
    }

    window.initializeAss2ImageMl = initializeAss2ImageMl;
})();

