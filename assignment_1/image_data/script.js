/**
 * IMAGE EDA - MAIN JAVASCRIPT (DRAWING LOGIC)
 * Render charts using data loaded from window.IMAGE_DATA
 */

(function() {
    'use strict';

    const SCATTER_MAX_POINTS = 2000;
    const PCA_MAX_COMPONENTS = 150;
    const IMAGE_SAMPLES_JSON_PATH = './Image-EDA/core_EDA/image_samples/image_samples.json';

    const CHART_COLORS = {
        trainBlue: 'rgba(54, 162, 235, 0.4)',
        evalOrange: 'rgba(255, 159, 64, 0.4)',
        testPurple: 'rgba(167, 139, 250, 0.45)'
    };

    function getElement(id) {
        return document.getElementById(id);
    }

    function getChartContext(id) {
        const element = getElement(id);
        return element ? element.getContext('2d') : null;
    }

    function createChartIfContext(id, createChartFn) {
        const ctx = getChartContext(id);
        if (!ctx) return;
        createChartFn(ctx);
    }

    function normalizeStaticImagePath(rawPath) {
        if (!rawPath) return '';
        const normalizedPath = String(rawPath).replace(/\\/g, '/').trim();
        if (!normalizedPath) return '';
        if (normalizedPath.startsWith('/static/')) {
            return `./Image-EDA${normalizedPath}`;
        }
        if (normalizedPath.startsWith('static/')) {
            return `./Image-EDA/${normalizedPath}`;
        }
        const fileName = normalizedPath.split('/').pop();
        return fileName ? `./Image-EDA/static/${fileName}` : '';
    }

    function parseSampleRowsFromJson(rawSamples) {
        if (!Array.isArray(rawSamples)) return [];
        return rawSamples
            .filter((entry) => entry && typeof entry === 'object' && typeof entry.class === 'string' && Array.isArray(entry.images))
            .map((entry) => ({
                className: entry.class.trim(),
                imagePaths: entry.images
                    .map((image) => normalizeStaticImagePath(image && image.path))
                    .filter(Boolean)
            }))
            .filter((entry) => entry.className && entry.imagePaths.length > 0);
    }

    async function loadImageSamplesJson() {
        const response = await fetch(IMAGE_SAMPLES_JSON_PATH);
        if (!response.ok) {
            throw new Error(`Không thể tải image_samples.json: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    function buildScatterPoints(items, xPrimaryKey, yPrimaryKey, xFallbackKey, yFallbackKey) {
        return (items || [])
            .slice(0, SCATTER_MAX_POINTS)
            .map((item) => ({
                x: item[xPrimaryKey] ?? item[xFallbackKey],
                y: item[yPrimaryKey] ?? item[yFallbackKey]
            }))
            .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
    }

    function buildChartAxisTitleStyle() {
        return {
            display: true,
            font: { family: 'Inter', size: 12 }
        };
    }

    // 1. HÀM RENDER IMAGE SAMPLES TỪ FILE JSON
    function renderImageSamples(samplesData) {
        const container = getElement('imageGridContainer');
        if (!container || !samplesData) return;
        container.innerHTML = '';

        const sampleRows = parseSampleRowsFromJson(samplesData);
        if (sampleRows.length === 0) {
            container.innerHTML = '<p class="text-sm text-slate-500">No sample images available.</p>';
            return;
        }

        const headerRow = document.createElement('div');
        headerRow.className = "flex gap-6 mb-6 border-b border-slate-200 pb-3 text-center";
        headerRow.innerHTML = `
            <div class="w-24 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest shrink-0">Classes</div>
            <div class="flex-1 text-left font-bold text-blue-500 uppercase text-[10px] tracking-widest">Image Samples</div>
        `;
        container.appendChild(headerRow);

        sampleRows.forEach((sample) => {
            const row = document.createElement('div');
            row.className = "flex items-center gap-6 mb-4 group";

            const label = document.createElement('div');
            label.className = "w-24 font-black text-slate-700 capitalize text-sm group-hover:text-emerald-600 transition-colors shrink-0";
            label.innerText = sample.className;
            row.appendChild(label);

            const imgContainer = document.createElement('div');
            imgContainer.className = "flex-1 grid grid-cols-4 gap-4";

            const createImgCard = (src) => {
                const div = document.createElement('div');
                div.className = "aspect-square bg-slate-200 rounded shadow-sm overflow-hidden border border-slate-200 hover:border-emerald-400 transition-all";
                div.innerHTML = `<img src="${src}" class="w-full h-full object-cover" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Error'">`;
                return div;
            };

            sample.imagePaths.forEach((path) => {
                imgContainer.appendChild(createImgCard(path));
            });

            row.appendChild(imgContainer);
            container.appendChild(row);
        });
    }

    async function renderImageSamplesSection(imageSamplesData) {
        try {
            const samplesData = Array.isArray(imageSamplesData) ? imageSamplesData : await loadImageSamplesJson();
            renderImageSamples(samplesData);
        } catch (error) {
            console.error('❌ Lỗi khi tải/hiển thị sample images:', error);
            const container = getElement('imageGridContainer');
            if (container) {
                container.innerHTML = '<p class="text-sm text-red-500">Failed to load sample images.</p>';
            }
        }
    }

    function drawClassDistributionChart(ctx, labels, distData, bgColor, axisTitleStyle) {
        if (!distData) return;
        new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [{ data: distData, backgroundColor: bgColor }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        title: { ...axisTitleStyle, text: 'Image Classes' },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    },
                    y: {
                        title: { ...axisTitleStyle, text: 'Count' }
                    }
                }
            }
        });
    }

    function drawFileSizeHistogram(core, axisTitleStyle) {
        if (!core.fileSize) return;
        createChartIfContext('fileSizeChart', (ctx) => {
            const edges = core.fileSize.bin_edges || core.fileSize.bins;
            const sizeLabels = edges.slice(0, -1).map((value) => value.toFixed(2));

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sizeLabels,
                    datasets: [{
                        data: core.fileSize.counts,
                        backgroundColor: '#90EE90',
                        borderColor: '#000000',
                        borderWidth: 1,
                        categoryPercentage: 1.0,
                        barPercentage: 1.0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            title: { ...axisTitleStyle, text: 'File Size (KB)' },
                            ticks: { maxTicksLimit: 10 }
                        },
                        y: {
                            title: { ...axisTitleStyle, text: 'Count' }
                        }
                    }
                }
            });
        });
    }

    function drawPixelIntensityChart(core, axisTitleStyle) {
        if (!core.pixelIntensity) return;
        createChartIfContext('pixelIntensityChart', (ctx) => {
            const rChannel = core.pixelIntensity.r || {};
            const gChannel = core.pixelIntensity.g || {};
            const bChannel = core.pixelIntensity.b || {};
            const edges = rChannel.bin_edges || rChannel.bins || [];
            const labels = edges.slice(0, -1).map((value) => value.toFixed(2));

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        { label: 'R channel', data: rChannel.counts, backgroundColor: 'rgba(255, 99, 132, 0.6)', categoryPercentage: 1, barPercentage: 1 },
                        { label: 'G channel', data: gChannel.counts, backgroundColor: 'rgba(75, 192, 192, 0.6)', categoryPercentage: 1, barPercentage: 1 },
                        { label: 'B channel', data: bChannel.counts, backgroundColor: 'rgba(54, 162, 235, 0.6)', categoryPercentage: 1, barPercentage: 1 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: { ...axisTitleStyle, text: 'Pixel Intensity' },
                            ticks: { maxTicksLimit: 10 }
                        },
                        y: {
                            title: { ...axisTitleStyle, text: 'Frequency' },
                            stacked: false
                        }
                    }
                }
            });
        });
    }

    function drawImageSizeScatter(core, axisTitleStyle) {
        if (!core.imageSize) return;
        createChartIfContext('imageSizeChart', (ctx) => {
            const trainData = buildScatterPoints(core.imageSize.train || core.imageSize.data, 'width', 'height', 'x', 'y');
            const evalData = buildScatterPoints(core.imageSize.eval, 'width', 'height', 'x', 'y');
            const testData = buildScatterPoints(core.imageSize.test, 'width', 'height', 'x', 'y');

            new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        { label: 'Train', data: trainData, backgroundColor: CHART_COLORS.trainBlue },
                        ...(evalData.length ? [{ label: 'Eval', data: evalData, backgroundColor: CHART_COLORS.evalOrange }] : []),
                        ...(testData.length ? [{ label: 'Test', data: testData, backgroundColor: CHART_COLORS.testPurple }] : [])
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { ...axisTitleStyle, text: 'Width' } },
                        y: { title: { ...axisTitleStyle, text: 'Height' } }
                    }
                }
            });
        });
    }

    function drawQualityScatter(core, axisTitleStyle) {
        if (!core.quality) return;
        createChartIfContext('qualityChart', (ctx) => {
            const trainData = buildScatterPoints(core.quality.train || core.quality.data, 'contrast', 'sharpness');
            const evalData = buildScatterPoints(core.quality.eval, 'contrast', 'sharpness');
            const testData = buildScatterPoints(core.quality.test, 'contrast', 'sharpness');

            new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        { label: 'Train', data: trainData, backgroundColor: CHART_COLORS.trainBlue },
                        ...(evalData.length ? [{ label: 'Eval', data: evalData, backgroundColor: CHART_COLORS.evalOrange }] : []),
                        ...(testData.length ? [{ label: 'Test', data: testData, backgroundColor: CHART_COLORS.testPurple }] : [])
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { ...axisTitleStyle, text: 'Contrast (Std Dev)' } },
                        y: { title: { ...axisTitleStyle, text: 'Sharpness (Laplacian)' } }
                    }
                }
            });
        });
    }

    function buildFrequencyMap(values) {
        const counts = {};
        (values || []).forEach((value) => {
            const key = value.toFixed(2);
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }

    function drawAspectRatioChart(core, axisTitleStyle) {
        if (!core.aspectRatio) return;
        createChartIfContext('aspectRatioChart', (ctx) => {
            const trainFrequency = buildFrequencyMap(core.aspectRatio.train || core.aspectRatio.data);
            const evalFrequency = buildFrequencyMap(core.aspectRatio.eval);
            const testFrequency = buildFrequencyMap(core.aspectRatio.test);
            const allKeys = [...new Set([...Object.keys(trainFrequency), ...Object.keys(evalFrequency), ...Object.keys(testFrequency)])].sort();
            const trainCounts = allKeys.map((key) => trainFrequency[key] || 0);
            const evalCounts = allKeys.map((key) => evalFrequency[key] || 0);
            const testCounts = allKeys.map((key) => testFrequency[key] || 0);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: allKeys,
                    datasets: [
                        { label: 'Train', data: trainCounts, backgroundColor: 'rgba(110, 168, 204, 0.6)', borderColor: '#607D8B', borderWidth: 1, categoryPercentage: 1.0, barPercentage: 1.0 },
                        ...(evalCounts.some((count) => count > 0)
                            ? [{ label: 'Eval', data: evalCounts, backgroundColor: 'rgba(222, 163, 114, 0.7)', borderColor: '#A0522D', borderWidth: 1, categoryPercentage: 1.0, barPercentage: 1.0 }]
                            : []),
                        ...(testCounts.some((count) => count > 0)
                            ? [{ label: 'Test', data: testCounts, backgroundColor: 'rgba(167, 139, 250, 0.7)', borderColor: '#7C3AED', borderWidth: 1, categoryPercentage: 1.0, barPercentage: 1.0 }]
                            : [])
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { ...axisTitleStyle, text: 'Aspect Ratio' } },
                        y: { title: { ...axisTitleStyle, text: 'Count' }, stacked: false }
                    }
                }
            });
        });
    }

    function drawClassCorrelationHeatmap(classification) {
        const corrDivId = 'classCorrelationHeatmap';
        if (!classification.classCorrelation || !getElement(corrDivId)) return;

        const flatData = classification.classCorrelation.data || classification.classCorrelation;
        const uniqueClasses = [...new Set(flatData.map((item) => item.x))];
        const corrMatrix = uniqueClasses.map((yLabel) =>
            uniqueClasses.map((xLabel) => {
                const found = flatData.find((item) => item.x === xLabel && item.y === yLabel);
                return found ? found.value : 0;
            })
        );

        const annotations = [];
        for (let rowIndex = 0; rowIndex < corrMatrix.length; rowIndex++) {
            for (let colIndex = 0; colIndex < corrMatrix[rowIndex].length; colIndex++) {
                annotations.push({
                    x: uniqueClasses[colIndex],
                    y: uniqueClasses[rowIndex],
                    text: corrMatrix[rowIndex][colIndex].toFixed(2),
                    showarrow: false,
                    font: {
                        color: corrMatrix[rowIndex][colIndex] > 0.8 ? 'white' : 'black',
                        size: 11,
                        family: 'Inter'
                    }
                });
            }
        }

        Plotly.newPlot(
            corrDivId,
            [{ z: corrMatrix, x: uniqueClasses, y: uniqueClasses, type: 'heatmap', colorscale: 'OrRd', showscale: true }],
            { margin: { t: 40, b: 80, l: 100, r: 40 }, yaxis: { autorange: 'reversed' }, annotations },
            { responsive: true, displayModeBar: false }
        );
    }

    function drawClustering(divId, rawData, titleX, titleY) {
        if (!rawData || !getElement(divId)) return;

        let groupsArray = [];

        if (Array.isArray(rawData)) {
            groupsArray = rawData;
        } else if (rawData.data && Array.isArray(rawData.data)) {
            if (rawData.data[0] && rawData.data[0].type === 'scatter') {
                Plotly.newPlot(divId, rawData.data, rawData.layout || {}, { responsive: true });
                return;
            }
            groupsArray = rawData.data;
        } else {
            console.error(`❌ Cấu trúc JSON cho biểu đồ ${divId} không hợp lệ. Mong đợi mảng (Array) nhưng nhận được:`, rawData);
            return;
        }

        try {
            const traces = groupsArray.map((group) => ({
                x: (group.data || group.points || []).map((point) => point.x),
                y: (group.data || group.points || []).map((point) => point.y),
                mode: 'markers',
                type: 'scatter',
                name: group.label || group.name || group.class || 'Unknown Class',
                marker: { size: 3, opacity: 0.6, line: { width: 0 } }
            }));

            const layout = {
                margin: { t: 40, b: 60, l: 60, r: 20 },
                hovermode: 'closest',
                xaxis: { title: { text: titleX, font: { family: 'Inter', size: 12 } }, zeroline: false },
                yaxis: { title: { text: titleY, font: { family: 'Inter', size: 12 } }, zeroline: false },
                plot_bgcolor: '#ffffff',
                paper_bgcolor: 'rgba(0,0,0,0)',
                legend: { font: { family: 'Inter', size: 11 }, orientation: 'v', x: 1.02, y: 1 }
            };

            Plotly.newPlot(divId, traces, layout, { responsive: true, displayModeBar: true, displaylogo: false });
        } catch (error) {
            console.error(`❌ Lỗi khi bóc tách dữ liệu điểm x, y cho ${divId}:`, error);
        }
    }

    function drawPcaChart(classification, axisTitleStyle) {
        const pcaDivId = 'pcaEmbeddingChart';
        const pcaContainer = getElement(pcaDivId);
        if (!classification.pcaData || !pcaContainer) return;

        pcaContainer.innerHTML = '';
        pcaContainer.style.height = '400px';

        const canvas = document.createElement('canvas');
        pcaContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const varianceData = classification.pcaData.cumulative_variance || [];
        const maxComponentsToShow = Math.min(PCA_MAX_COMPONENTS, varianceData.length);
        const displayData = varianceData.slice(0, maxComponentsToShow);
        const labels = Array.from({ length: displayData.length }, (_, index) => index + 1);

        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Cumulative Explained Variance',
                    data: displayData,
                    borderColor: '#f43f5e',
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Variance: ${(context.raw * 100).toFixed(2)}%`
                        }
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 0.95,
                                yMax: 0.95,
                                borderColor: 'gray',
                                borderWidth: 1,
                                borderDash: [5, 5],
                                label: { enabled: true, content: '95% Variance' }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { ...axisTitleStyle, text: 'Number of Components' },
                        grid: { display: false }
                    },
                    y: {
                        title: { ...axisTitleStyle, text: 'Cumulative Variance' },
                        min: 0,
                        max: 1,
                        ticks: {
                            callback: (value) => `${value * 100}%`
                        }
                    }
                }
            }
        });
    }

    async function initializeImageCharts() {
        console.log('🎨 Đang khởi tạo các biểu đồ Image EDA...');

        Chart.defaults.font.family = "'Inter', sans-serif";
        const axisTitleStyle = buildChartAxisTitleStyle();
        const data = window.IMAGE_DATA;
        if (!data) {
            console.error("❌ Không tìm thấy window.IMAGE_DATA!");
            return;
        }

        const core = data.core || {};
        const cls = data.classification || {};

        await renderImageSamplesSection(core.imageSamples);

        if (cls.classDist) {
            const classLabels = cls.classDist.classes;
            createChartIfContext('trainDistChart', (ctx) =>
                drawClassDistributionChart(ctx, classLabels, cls.classDist.train_distribution || cls.classDist.counts, '#87CEEB', axisTitleStyle)
            );
            createChartIfContext('evalDistChart', (ctx) =>
                drawClassDistributionChart(ctx, classLabels, cls.classDist.eval_distribution || cls.classDist.counts, '#FA8072', axisTitleStyle)
            );
            createChartIfContext('testDistChart', (ctx) =>
                drawClassDistributionChart(ctx, classLabels, cls.classDist.test_distribution, '#A78BFA', axisTitleStyle)
            );
        }

        drawFileSizeHistogram(core, axisTitleStyle);
        drawPixelIntensityChart(core, axisTitleStyle);
        drawImageSizeScatter(core, axisTitleStyle);
        drawQualityScatter(core, axisTitleStyle);
        drawAspectRatioChart(core, axisTitleStyle);

        drawClassCorrelationHeatmap(cls);

        drawClustering('umapEmbeddingChart', cls.umapEmbedding, 'UMAP dimension 1', 'UMAP dimension 2');
        drawClustering('tsneEmbeddingChart', cls.tsneEmbedding, 't-SNE dimension 1', 't-SNE dimension 2');
        drawPcaChart(cls, axisTitleStyle);

        console.log('🎉 Hoàn tất vẽ toàn bộ biểu đồ Image EDA!');
    }

    // Xuất hàm ra Global để data-loader.js gọi
    window.initializeImageCharts = initializeImageCharts;

})();