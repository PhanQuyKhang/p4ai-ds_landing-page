/**
 * IMAGE EDA - MAIN JAVASCRIPT (DRAWING LOGIC)
 * Render charts using data loaded from window.IMAGE_DATA
 */

// =========================================================================
// 1. HARDCODED DATA: IMAGE SAMPLES (32x32 CIFAR-10)
// =========================================================================
const imageSamplesData = [
    {
        "class": "airplane",
        "train": ["./Image-EDA/static/train/train_0_0.png", "./Image-EDA/static/train/train_0_1.png", "./Image-EDA/static/train/train_0_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_0_0.png", "./Image-EDA/static/eval/eval_0_1.png", "./Image-EDA/static/eval/eval_0_2.png"]
    },
    {
        "class": "automobile",
        "train": ["./Image-EDA/static/train/train_1_0.png", "./Image-EDA/static/train/train_1_1.png", "./Image-EDA/static/train/train_1_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_1_0.png", "./Image-EDA/static/eval/eval_1_1.png", "./Image-EDA/static/eval/eval_1_2.png"]
    },
    {
        "class": "bird",
        "train": ["./Image-EDA/static/train/train_2_0.png", "./Image-EDA/static/train/train_2_1.png", "./Image-EDA/static/train/train_2_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_2_0.png", "./Image-EDA/static/eval/eval_2_1.png", "./Image-EDA/static/eval/eval_2_2.png"]
    },
    {
        "class": "cat",
        "train": ["./Image-EDA/static/train/train_3_0.png", "./Image-EDA/static/train/train_3_1.png", "./Image-EDA/static/train/train_3_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_3_0.png", "./Image-EDA/static/eval/eval_3_1.png", "./Image-EDA/static/eval/eval_3_2.png"]
    },
    {
        "class": "deer",
        "train": ["./Image-EDA/static/train/train_4_0.png", "./Image-EDA/static/train/train_4_1.png", "./Image-EDA/static/train/train_4_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_4_0.png", "./Image-EDA/static/eval/eval_4_1.png", "./Image-EDA/static/eval/eval_4_2.png"]
    },
    {
        "class": "dog",
        "train": ["./Image-EDA/static/train/train_5_0.png", "./Image-EDA/static/train/train_5_1.png", "./Image-EDA/static/train/train_5_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_5_0.png", "./Image-EDA/static/eval/eval_5_1.png", "./Image-EDA/static/eval/eval_5_2.png"]
    },
    {
        "class": "frog",
        "train": ["./Image-EDA/static/train/train_6_0.png", "./Image-EDA/static/train/train_6_1.png", "./Image-EDA/static/train/train_6_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_6_0.png", "./Image-EDA/static/eval/eval_6_1.png", "./Image-EDA/static/eval/eval_6_2.png"]
    },
    {
        "class": "horse",
        "train": ["./Image-EDA/static/train/train_7_0.png", "./Image-EDA/static/train/train_7_1.png", "./Image-EDA/static/train/train_7_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_7_0.png", "./Image-EDA/static/eval/eval_7_1.png", "./Image-EDA/static/eval/eval_7_2.png"]
    },
    {
        "class": "ship",
        "train": ["./Image-EDA/static/train/train_8_0.png", "./Image-EDA/static/train/train_8_1.png", "./Image-EDA/static/train/train_8_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_8_0.png", "./Image-EDA/static/eval/eval_8_1.png", "./Image-EDA/static/eval/eval_8_2.png"]
    },
    {
        "class": "truck",
        "train": ["./Image-EDA/static/train/train_9_0.png", "./Image-EDA/static/train/train_9_1.png", "./Image-EDA/static/train/train_9_2.png"],
        "eval": ["./Image-EDA/static/eval/eval_9_0.png", "./Image-EDA/static/eval/eval_9_1.png", "./Image-EDA/static/eval/eval_9_2.png"]
    }
];


(function() {
    'use strict';

    function renderImageSamples() {
        const container = document.getElementById('imageGridContainer');
        if (!container) return;
        container.innerHTML = '';
        const headerRow = document.createElement('div');
        headerRow.className = "grid grid-cols-7 gap-4 mb-6 border-b border-slate-200 pb-3 text-center";
        headerRow.innerHTML = `
            <div class="text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Classes</div>
            <div class="col-span-3 font-bold text-blue-500 uppercase text-[10px] tracking-widest">Train Set Samples</div>
            <div class="col-span-3 font-bold text-orange-500 uppercase text-[10px] tracking-widest">Eval Set Samples</div>
        `;
        container.appendChild(headerRow);

        imageSamplesData.forEach(item => {
            const row = document.createElement('div');
            row.className = "grid grid-cols-7 gap-4 items-center mb-4 group";
            const label = document.createElement('div');
            label.className = "font-black text-slate-700 capitalize text-sm group-hover:text-emerald-600 transition-colors";
            label.innerText = item.class;
            row.appendChild(label);

            const createImg = (src) => {
                const div = document.createElement('div');
                div.className = "aspect-square bg-slate-200 rounded shadow-sm overflow-hidden border border-slate-200 hover:border-emerald-400 transition-all";
                div.innerHTML = `<img src="${src}" class="w-full h-full object-contain" style="image-rendering: pixelated;">`;
                return div;
            };
            item.train.forEach(path => row.appendChild(createImg(path)));
            item.eval.forEach(path => row.appendChild(createImg(path)));
            container.appendChild(row);
        });
    }


    function initializeImageCharts() {
        console.log('🎨 Đang khởi tạo các biểu đồ Image EDA...');

        // Cấu hình Style chung cho Chart.js
        Chart.defaults.font.family = "'Inter', sans-serif";
        const axisTitleStyle = { display: true, font: { family: 'Inter', size: 12} };

        // Lấy Data từ DataLoader
        const data = window.IMAGE_DATA;
        if (!data) {
            console.error("❌ Không tìm thấy window.IMAGE_DATA!");
            return;
        }

        // Hàm hỗ trợ: Lấy Context an toàn tránh lỗi
        const getCtx = (id) => {
            const el = document.getElementById(id);
            return el ? el.getContext('2d') : null;
        };

        // ==========================================
        // 1. VẼ CORE EDA
        // ==========================================
        const core = data.core;

        // --- 1.1 Train & Eval Class Dist ---
        if (core.classDist && getCtx('trainDistChart')) {
            const drawClassDist = (ctx, distData, bgColor) => {
                new Chart(ctx, {
                    type: 'bar',
                    data: { labels: core.classDist.classes, datasets: [{ data: distData, backgroundColor: bgColor }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { ...axisTitleStyle, text: 'Image Classes' }, ticks: { maxRotation: 45, minRotation: 45 } }, y: {title: {...axisTitleStyle, text: 'Count'}} } }
                });
            };
            drawClassDist(getCtx('trainDistChart'), core.classDist.train_distribution, '#87CEEB');
            drawClassDist(getCtx('evalDistChart'), core.classDist.eval_distribution, '#FA8072');
        }

        // --- 1.2 File Size Histogram ---
        if (core.fileSize && getCtx('fileSizeChart')) {
            const edges = core.fileSize.bin_edges || core.fileSize.bins;
            const sizeLabels = edges.slice(0, -1).map(val => val.toFixed(2));
            new Chart(getCtx('fileSizeChart'), {
                type: 'bar',
                data: { labels: sizeLabels, datasets: [{ data: core.fileSize.counts, backgroundColor: '#90EE90', borderColor: '#000000', borderWidth: 1, categoryPercentage: 1.0, barPercentage: 1.0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { ...axisTitleStyle, text: 'File Size (KB)' }, ticks: { maxTicksLimit: 10 } }, y: {title: {...axisTitleStyle, text: 'Count'}} } }
            });
        }

        // --- 1.3 Pixel Intensity ---
        if (core.pixelIntensity && getCtx('pixelIntensityChart')) {
            const edges = core.pixelIntensity.r.bin_edges || core.pixelIntensity.r.bins;
            const pxLabels = edges.slice(0, -1).map(val => val.toFixed(2));
            new Chart(getCtx('pixelIntensityChart'), {
                type: 'bar',
                data: {
                    labels: pxLabels,
                    datasets: [
                        { label: 'R channel', data: core.pixelIntensity.r.counts, backgroundColor: 'rgba(255, 99, 132, 0.6)', categoryPercentage: 1, barPercentage: 1 },
                        { label: 'G channel', data: core.pixelIntensity.g.counts, backgroundColor: 'rgba(75, 192, 192, 0.6)', categoryPercentage: 1, barPercentage: 1 },
                        { label: 'B channel', data: core.pixelIntensity.b.counts, backgroundColor: 'rgba(54, 162, 235, 0.6)', categoryPercentage: 1, barPercentage: 1 }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { ...axisTitleStyle, text: 'Pixel Intensity' }, ticks: {maxTicksLimit: 10} }, y: { title: { ...axisTitleStyle, text: 'Frequency' }, stacked: false } } }
            });
        }

        // --- 1.4 Image Size Scatter (CẮT MAX 2000 ĐIỂM ĐỂ WEB KHÔNG GIẬT) ---
        if (core.imageSize && getCtx('imageSizeChart')) {
            const trainData = (core.imageSize.train || []).slice(0, 2000).map(item => ({ x: item.width, y: item.height }));
            const evalData = (core.imageSize.eval || []).slice(0, 2000).map(item => ({ x: item.width, y: item.height }));
            
            new Chart(getCtx('imageSizeChart'), {
                type: 'scatter',
                data: {
                    datasets: [
                        { label: 'Train', data: trainData, backgroundColor: 'rgba(54, 162, 235, 0.4)' },
                        { label: 'Eval', data: evalData, backgroundColor: 'rgba(255, 159, 64, 0.4)' }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { ...axisTitleStyle, text: 'Width' } }, y: { title: { ...axisTitleStyle, text: 'Height' } } } }
            });
        }

        // --- 1.5 Image Quality Scatter (CẮT MAX 2000 ĐIỂM) ---
        if (core.quality && getCtx('qualityChart')) {
            const trainData = (core.quality.train || []).slice(0, 2000).map(item => ({ x: item.contrast, y: item.sharpness }));
            const evalData = (core.quality.eval || []).slice(0, 2000).map(item => ({ x: item.contrast, y: item.sharpness }));
            
            new Chart(getCtx('qualityChart'), {
                type: 'scatter',
                data: {
                    datasets: [
                        { label: 'Train', data: trainData, backgroundColor: 'rgba(54, 162, 235, 0.4)' },
                        { label: 'Eval', data: evalData, backgroundColor: 'rgba(255, 159, 64, 0.4)' }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { ...axisTitleStyle, text: 'Contrast (Std Dev)' } }, y: { title: { ...axisTitleStyle, text: 'Sharpness (Laplacian)' } } } }
            });
        }

        // --- 1.6 Aspect Ratio (Tự động gom nhóm mảng thô thành tần suất) ---
        if (core.aspectRatio && getCtx('aspectRatioChart')) {
            const countFreq = (arr) => {
                let counts = {};
                arr.forEach(val => { let k = val.toFixed(2); counts[k] = (counts[k] || 0) + 1; });
                return counts;
            };
            const trainFreq = countFreq(core.aspectRatio.train || []);
            const evalFreq = countFreq(core.aspectRatio.eval || []);
            const uniqueKeys = [...new Set([...Object.keys(trainFreq), ...Object.keys(evalFreq)])].sort();

            const trainCounts = uniqueKeys.map(k => trainFreq[k] || 0);
            const evalCounts = uniqueKeys.map(k => evalFreq[k] || 0);

            new Chart(getCtx('aspectRatioChart'), {
                type: 'bar',
                data: {
                    labels: uniqueKeys,
                    datasets: [
                        { label: 'Train', data: trainCounts, backgroundColor: 'rgba(110, 168, 204, 0.6)', borderColor: '#607D8B', borderWidth: 1, categoryPercentage: 1.0, barPercentage: 1.0 },
                        { label: 'Eval', data: evalCounts, backgroundColor: 'rgba(222, 163, 114, 0.7)', borderColor: '#A0522D', borderWidth: 1, categoryPercentage: 1.0, barPercentage: 1.0 }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { ...axisTitleStyle, text: 'Aspect Ratio' } }, y: { title: { ...axisTitleStyle, text: 'Count' }, stacked: false } } }
            });
        }

        // ==========================================
        // 2. CLASSIFICATION EDA
        // ==========================================
        const cls = data.classification;
        
        // --- 2.1 Class Correlation Heatmap (Giữ nguyên) ---
        const corrDivId = 'classCorrelationHeatmap';
        if (cls.classCorrelation && document.getElementById(corrDivId)) {
            const flatData = cls.classCorrelation.data;
            const uniqueClasses = [...new Set(flatData.map(d => d.x))];
            
            const corrMatrix = uniqueClasses.map(yLabel => 
                uniqueClasses.map(xLabel => {
                    const found = flatData.find(item => item.x === xLabel && item.y === yLabel);
                    return found ? found.value : 0;
                })
            );

            let annotations = [];
            for (let i = 0; i < corrMatrix.length; i++) {
                for (let j = 0; j < corrMatrix[i].length; j++) {
                    annotations.push({ 
                        x: uniqueClasses[j], 
                        y: uniqueClasses[i], 
                        text: corrMatrix[i][j].toFixed(2), 
                        showarrow: false, 
                        font: { color: corrMatrix[i][j] > 0.8 ? 'white' : 'black', size: 11, family: 'Inter' } 
                    });
                }
            }

            Plotly.newPlot(corrDivId, [{ 
                z: corrMatrix, x: uniqueClasses, y: uniqueClasses, type: 'heatmap', colorscale: 'OrRd', showscale: true 
            }], { 
                margin: { t: 40, b: 80, l: 100, r: 40 }, yaxis: { autorange: 'reversed' }, annotations: annotations
            }, { responsive: true, displayModeBar: false });
        }

        // --- 2.2 UMAP Embedding (Sửa lỗi theo cấu trúc JSON mới) ---
        const umapDivId = 'umapEmbeddingChart';
        if (cls.umapEmbedding && document.getElementById(umapDivId)) {
            
            // Chuyển đổi cấu trúc: Từ Array of {x, y} sang 2 mảng x:[], y:[] cho Plotly
            const umapTraces = cls.umapEmbedding.map(group => {
                return {
                    // group.data là mảng [{"x":1, "y":2}, ...]
                    // Chúng ta cần lấy toàn bộ x ra 1 mảng và y ra 1 mảng
                    x: group.data.map(point => point.x), 
                    y: group.data.map(point => point.y),
                    mode: 'markers',
                    type: 'scatter',
                    name: group.label, // Lấy tên class từ key "label"
                    marker: { 
                        size: 3,        // Kích thước điểm chấm nhỏ cho giống hình mẫu
                        opacity: 0.6,    // Độ trong suốt để thấy vùng đậm nhạt
                        line: { width: 0 } // Bỏ viền điểm chấm cho mượt
                    }
                };
            });

            const layout = {
                margin: { t: 40, b: 60, l: 60, r: 20 },
                hovermode: 'closest',
                xaxis: { 
                    title: { text: 'UMAP dimension 1', font: { family: 'Inter', size: 12 } },
                    zeroline: false
                },
                yaxis: { 
                    title: { text: 'UMAP dimension 2', font: { family: 'Inter', size: 12 } },
                    zeroline: false
                },
                plot_bgcolor: '#ffffff',
                paper_bgcolor: 'rgba(0,0,0,0)',
                legend: {
                    font: { family: 'Inter', size: 11 },
                    orientation: 'v',
                    x: 1.02,
                    y: 1
                }
            };

            const config = {
                responsive: true,
                displayModeBar: true,
                displaylogo: false
            };

            Plotly.newPlot(umapDivId, umapTraces, layout, config);
        }


        // ==========================================
        // 3. DETECTION EDA
        // ==========================================
        const det = data.detection;
        const detBgColor = 'rgba(6, 182, 212, 0.7)';

        // 3.1 Size Stats
        if (det.sizeBar && getCtx('detSizeStatsChart')) {
            new Chart(getCtx('detSizeStatsChart'), {
                type: 'bar',
                data: { labels: det.sizeBar.labels, datasets: [{ data: det.sizeBar.values || det.sizeBar.counts, backgroundColor: detBgColor }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { ...axisTitleStyle, text: 'Image Size' } } }, y: {title: {...axisTitleStyle, text: 'Count'}} }
            });
        }

        // 3.2 Area Dist
        if (det.areaHist && getCtx('detAreaChart')) {
            const edges = det.areaHist.bins || det.areaHist.bin_edges;
            const areaLabels = edges.slice(0, -1).map((val, i) => `${val.toFixed(1)} - ${edges[i+1].toFixed(1)}`);
            new Chart(getCtx('detAreaChart'), {
                type: 'bar',
                data: { labels: areaLabels, datasets: [{ data: det.areaHist.counts, backgroundColor: detBgColor, categoryPercentage: 1.0, barPercentage: 1.0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { ...axisTitleStyle, text: 'Area (Pixels)' }, ticks: { display: false } } }, y: {title: {...axisTitleStyle, text: 'Count'}} }
            });
        }

        // --- Hàm vẽ Pie Chart ---
        const drawDetPie = (canvasId, jsonObj) => {
            if (!jsonObj || !getCtx(canvasId)) return;
            new Chart(getCtx(canvasId), {
                type: 'pie',
                data: { labels: jsonObj.labels, datasets: [{ data: jsonObj.values || jsonObj.counts, backgroundColor: ['#0ea5e9', '#94a3b8', '#f59e0b', '#10b981'], borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'left' } } }
            });
        };

        drawDetPie('detAspectRatioChart', det.aspectRatioPie);
        drawDetPie('detCenterBiasChart', det.centerBias);
        drawDetPie('detSizeCatChart', det.sizeCatPie);

        // 3.6 Heatmap 3x3
        if (det.grid3x3 && document.getElementById('detGridHeatmap')) {
            Plotly.newPlot('detGridHeatmap', [{ z: det.grid3x3.grid || det.grid3x3.matrix, type: 'heatmap', colorscale: 'Viridis' }], { margin: { t: 10, b: 30, l: 30, r: 10 }, yaxis: { autorange: 'reversed' } }, { displayModeBar: false });
        }

        // 3.7 Heatmap Position 32x32
        if (det.positionHeatmap && document.getElementById('detPositionHeatmap')) {
            Plotly.newPlot('detPositionHeatmap', [{ z: det.positionHeatmap.heatmap || det.positionHeatmap.matrix, type: 'heatmap', colorscale: 'Viridis' }], { margin: { t: 20, b: 40, l: 40, r: 20 }, yaxis: { autorange: 'reversed' } }, { displayModeBar: false });
        }


        // ==========================================
        // 4. SEGMENTATION EDA
        // ==========================================
        const seg = data.segmentation;

        // Metric Values (Cập nhật text HTML)
        if (seg.boundaryMetrics) {
            const metricsData = seg.boundaryMetrics.mean_values || seg.boundaryMetrics.values || [0,0,0];
            const tEl = document.getElementById('metric-thickness'); if(tEl) tEl.innerText = metricsData[0]?.toFixed(3);
            const sEl = document.getElementById('metric-smoothness'); if(sEl) sEl.innerText = metricsData[1]?.toFixed(3);
            const cEl = document.getElementById('metric-complexity'); if(cEl) cEl.innerText = metricsData[2]?.toFixed(3);
        }

        // Hàm vẽ Segment Histograms
        const drawSegHist = (canvasId, histData, color) => {
            if(!histData || !getCtx(canvasId)) return;
            const edges = histData.bins || histData.bin_edges;
            const labels = edges.slice(0, -1).map(v => v.toFixed(2));
            new Chart(getCtx(canvasId), {
                type: 'bar',
                data: { labels: labels, datasets: [{ data: histData.counts, backgroundColor: color, categoryPercentage: 1.0, barPercentage: 1.0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: {y: {title: {...axisTitleStyle, text: 'Count'}}}}
            });
        };
        drawSegHist('segThicknessHist', seg.thicknessHist, '#1e90ff');
        drawSegHist('segSmoothnessHist', seg.smoothnessHist, '#ffa500');
        drawSegHist('segComplexityHist', seg.complexityHist, '#008000');

        // Pixel Dist (Pie)
        if (seg.pixelDist && getCtx('segPixelDistChart')) {
            new Chart(getCtx('segPixelDistChart'), {
                type: 'pie',
                data: { labels: seg.pixelDist.labels, datasets: [{ data: seg.pixelDist.values || seg.pixelDist.counts, backgroundColor: ['#64748b', '#f59e0b', '#6366f1'], borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'left' } } }
            });
        }

        // Pixel Mean (Bar)
        if (seg.pixelStats && getCtx('segPixelMeanChart')) {
            new Chart(getCtx('segPixelMeanChart'), {
                type: 'bar',
                data: { labels: seg.pixelStats.classes, datasets: [{ label: 'Mean', data: seg.pixelStats.mean, backgroundColor: 'rgba(20, 184, 166, 0.7)' }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { title: { ...axisTitleStyle, text: 'Mean Value' } } } }
            });
        }

        // Shape Metrics Overview (Bar dọc)
        if (seg.shapeMetrics && getCtx('segShapeMetricsChart')) {
            new Chart(getCtx('segShapeMetricsChart'), {
                type: 'bar',
                data: {
                    labels: seg.shapeMetrics.labels,
                    datasets: [{ data: seg.shapeMetrics.mean_values || seg.shapeMetrics.values, backgroundColor: ['#87ceeb', '#fa8072', '#334155'], barPercentage: 0.6 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { ...axisTitleStyle, text: 'Metric Name' } }, y: { max: 1.1, title: { ...axisTitleStyle, text: 'Mean Value' } } } }
            });
        }

        // Boundary Metrics Comparison (Bar dọc)
        if (seg.boundaryMetrics && getCtx('segBoundaryMetricsChart')) {
            new Chart(getCtx('segBoundaryMetricsChart'), {
                type: 'bar',
                data: {
                    labels: seg.boundaryMetrics.labels,
                    datasets: [{ data: seg.boundaryMetrics.mean_values || seg.boundaryMetrics.values, backgroundColor: ['#1e90ff', '#ffa500', '#008000'], barPercentage: 0.6 }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { ...axisTitleStyle, text: 'Metric Name' }}, y: { title: { ...axisTitleStyle, text: 'Metric Value' } } } }
            });
        }
        renderImageSamples();

        console.log('🎉 Hoàn tất vẽ toàn bộ biểu đồ Image EDA!');
    }

    // Xuất hàm ra Global để data-loader.js gọi
    window.initializeImageCharts = initializeImageCharts;

})();