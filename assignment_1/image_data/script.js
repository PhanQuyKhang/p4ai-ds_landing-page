/**
 * IMAGE EDA - MAIN JAVASCRIPT (DRAWING LOGIC)
 * Render charts using data loaded from window.IMAGE_DATA
 */

(function() {
    'use strict';

    // 1. HÀM RENDER IMAGE SAMPLES TỪ FILE JSON
    function renderImageSamples(samplesData) {
        const container = document.getElementById('imageGridContainer');
        if (!container || !samplesData) return;
        
        container.innerHTML = ''; 
        
        // Tạo Header
        const headerRow = document.createElement('div');
        headerRow.className = "grid grid-cols-7 gap-4 mb-6 border-b border-slate-200 pb-3 text-center";
        headerRow.innerHTML = `
            <div class="text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Classes</div>
            <div class="col-span-6 font-bold text-blue-500 uppercase text-[10px] tracking-widest">Image Samples</div>
        `;
        container.appendChild(headerRow);

        // Duyệt qua dữ liệu JSON
        samplesData.forEach(item => {
            const row = document.createElement('div');
            row.className = "grid grid-cols-7 gap-4 items-center mb-4 group";
            
            // Tên Class
            const label = document.createElement('div');
            label.className = "font-black text-slate-700 capitalize text-sm group-hover:text-emerald-600 transition-colors";
            label.innerText = item.class || item.label || 'Unknown';
            row.appendChild(label);

            const createImg = (src) => {
                const div = document.createElement('div');
                div.className = "aspect-square bg-slate-200 rounded shadow-sm overflow-hidden border border-slate-200 hover:border-emerald-400 transition-all flex items-center justify-center";
                // Thêm onerror để nếu thiếu ảnh sẽ không bị vỡ khung UI
                div.innerHTML = `<img src="${src}" class="w-full h-full object-cover" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">`;
                return div;
            };

            let imagePaths = [];
            if (item.train) imagePaths = imagePaths.concat(item.train);
            if (item.eval) imagePaths = imagePaths.concat(item.eval);
            if (item.images) imagePaths = imagePaths.concat(item.images);

            // XỬ LÝ ĐƯỜNG DẪN TRỎ VÀO FOLDER STATIC
            imagePaths.forEach(imgData => {
                let rawString = "";
                
                // Lấy chuỗi từ object hoặc mảng
                if (typeof imgData === 'string') {
                    rawString = imgData;
                } else if (typeof imgData === 'object' && imgData !== null) {
                    rawString = imgData.path || imgData.url || imgData.src || Object.values(imgData)[0];
                }

                if (rawString) {
                    // Lấy ra tên file cuối cùng (vd: "0_0.png" từ "C:/.../0_0.png" hoặc "static/0_0.png")
                    const fileName = String(rawString).split('/').pop().split('\\').pop();
                    
                    // Ghép vào đường dẫn chuẩn xác trên web
                    const finalSrc = `./Image-EDA/static/${fileName}`;

                    row.appendChild(createImg(finalSrc));
                }
            });
            
            container.appendChild(row);
        });
    }


    function initializeImageCharts() {
        console.log('🎨 Đang khởi tạo các biểu đồ Image EDA...');

        Chart.defaults.font.family = "'Inter', sans-serif";
        const axisTitleStyle = { display: true, font: { family: 'Inter', size: 12} };

        const data = window.IMAGE_DATA;
        if (!data) {
            console.error("❌ Không tìm thấy window.IMAGE_DATA!");
            return;
        }

        const getCtx = (id) => {
            const el = document.getElementById(id);
            return el ? el.getContext('2d') : null;
        };

        const core = data.core;
        const cls = data.classification;

        // ==========================================
        // 1. VẼ CORE EDA
        // ==========================================
        
        // --- 1.0 Load Image Samples Dynamic ---
        if (core.imageSamples) {
            renderImageSamples(core.imageSamples);
        }

        // --- 1.1 Class Dist (ĐÃ CHUYỂN TỪ CORE SANG CLASSIFICATION THEO CẤU TRÚC MỚI) ---
        if (cls.classDist && getCtx('trainDistChart')) {
            const drawClassDist = (ctx, distData, bgColor) => {
                if (!distData) return;
                new Chart(ctx, {
                    type: 'bar',
                    data: { labels: cls.classDist.classes, datasets: [{ data: distData, backgroundColor: bgColor }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { ...axisTitleStyle, text: 'Image Classes' }, ticks: { maxRotation: 45, minRotation: 45 } }, y: {title: {...axisTitleStyle, text: 'Count'}} } }
                });
            };
            drawClassDist(getCtx('trainDistChart'), cls.classDist.train_distribution || cls.classDist.counts, '#87CEEB');
            drawClassDist(getCtx('evalDistChart'), cls.classDist.eval_distribution || cls.classDist.counts, '#FA8072');
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

        // --- 1.4 Image Size Scatter (Đổi biến thành imageSize theo dataloader) ---
        if (core.imageSize && getCtx('imageSizeChart')) {
            const trainData = (core.imageSize.train || core.imageSize.data || []).slice(0, 2000).map(item => ({ x: item.width || item.x, y: item.height || item.y }));
            const evalData = (core.imageSize.eval || []).slice(0, 2000).map(item => ({ x: item.width || item.x, y: item.height || item.y }));
            
            new Chart(getCtx('imageSizeChart'), {
                type: 'scatter',
                data: {
                    datasets: [
                        { label: 'Train', data: trainData, backgroundColor: 'rgba(54, 162, 235, 0.4)' },
                        ...(evalData.length ? [{ label: 'Eval', data: evalData, backgroundColor: 'rgba(255, 159, 64, 0.4)' }] : [])
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { ...axisTitleStyle, text: 'Width' } }, y: { title: { ...axisTitleStyle, text: 'Height' } } } }
            });
        }

        // --- 1.5 Image Quality Scatter ---
        if (core.quality && getCtx('qualityChart')) {
            const trainData = (core.quality.train || core.quality.data || []).slice(0, 2000).map(item => ({ x: item.contrast, y: item.sharpness }));
            const evalData = (core.quality.eval || []).slice(0, 2000).map(item => ({ x: item.contrast, y: item.sharpness }));
            
            new Chart(getCtx('qualityChart'), {
                type: 'scatter',
                data: {
                    datasets: [
                        { label: 'Train', data: trainData, backgroundColor: 'rgba(54, 162, 235, 0.4)' },
                        ...(evalData.length ? [{ label: 'Eval', data: evalData, backgroundColor: 'rgba(255, 159, 64, 0.4)' }] : [])
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { ...axisTitleStyle, text: 'Contrast (Std Dev)' } }, y: { title: { ...axisTitleStyle, text: 'Sharpness (Laplacian)' } } } }
            });
        }

        // --- 1.6 Aspect Ratio ---
        if (core.aspectRatio && getCtx('aspectRatioChart')) {
            const countFreq = (arr) => {
                let counts = {};
                arr.forEach(val => { let k = val.toFixed(2); counts[k] = (counts[k] || 0) + 1; });
                return counts;
            };
            const trainFreq = countFreq(core.aspectRatio.train || core.aspectRatio.data || []);
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
                        ...(evalCounts.some(v => v > 0) ? [{ label: 'Eval', data: evalCounts, backgroundColor: 'rgba(222, 163, 114, 0.7)', borderColor: '#A0522D', borderWidth: 1, categoryPercentage: 1.0, barPercentage: 1.0 }] : [])
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { ...axisTitleStyle, text: 'Aspect Ratio' } }, y: { title: { ...axisTitleStyle, text: 'Count' }, stacked: false } } }
            });
        }

        // ==========================================
        // 2. CLASSIFICATION EDA
        // ==========================================
        
        // --- 2.1 Class Correlation Heatmap ---
        const corrDivId = 'classCorrelationHeatmap';
        if (cls.classCorrelation && document.getElementById(corrDivId)) {
            const flatData = cls.classCorrelation.data || cls.classCorrelation;
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
// --- HÀM VẼ CLUSTERING CHUNG (Đã sửa lỗi cấu trúc JSON) ---
        const drawClustering = (divId, rawData, titleX, titleY) => {
            if (!rawData || !document.getElementById(divId)) return;

            let groupsArray = [];

            // 1. Xử lý linh hoạt các kiểu file JSON
            // Trường hợp A: JSON là một mảng trực tiếp []
            if (Array.isArray(rawData)) {
                groupsArray = rawData;
            } 
            // Trường hợp B: Mảng nằm bên trong key "data" -> { data: [] }
            else if (rawData.data && Array.isArray(rawData.data)) {
                
                // Trường hợp B.1: File JSON này được xuất trực tiếp từ lệnh fig.write_json() của Plotly
                // Nếu đúng như vậy, ta lấy luôn dữ liệu đó vẽ, không cần map gì cả.
                if (rawData.data[0] && rawData.data[0].type === 'scatter') {
                    Plotly.newPlot(divId, rawData.data, rawData.layout || {}, { responsive: true });
                    return; // Dừng hàm tại đây
                }
                
                // Trường hợp B.2: Mảng tự build có key data
                groupsArray = rawData.data;
            } 
            else {
                console.error(`❌ Cấu trúc JSON cho biểu đồ ${divId} không hợp lệ. Mong đợi mảng (Array) nhưng nhận được:`, rawData);
                return;
            }

            // 2. Map dữ liệu để đưa vào Plotly
            try {
                const traces = groupsArray.map(group => ({
                    // Hỗ trợ cả 2 tên biến phổ biến (group.data hoặc group.points)
                    x: (group.data || group.points || []).map(point => point.x), 
                    y: (group.data || group.points || []).map(point => point.y),
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
                    plot_bgcolor: '#ffffff', paper_bgcolor: 'rgba(0,0,0,0)',
                    legend: { font: { family: 'Inter', size: 11 }, orientation: 'v', x: 1.02, y: 1 }
                };
                
                Plotly.newPlot(divId, traces, layout, { responsive: true, displayModeBar: true, displaylogo: false });
            } catch (error) {
                console.error(`❌ Lỗi khi bóc tách dữ liệu điểm x, y cho ${divId}:`, error);
            }
        };

        // --- 2.2 Vẽ UMAP, TSNE, PCA ---
        drawClustering('umapEmbeddingChart', cls.umapEmbedding, 'UMAP dimension 1', 'UMAP dimension 2');
        drawClustering('tsneEmbeddingChart', cls.tsneEmbedding, 't-SNE dimension 1', 't-SNE dimension 2');
        // --- 2.3 Vẽ PCA Cumulative Variance (Biểu đồ đường) ---
        const pcaDivId = 'pcaEmbeddingChart'; // Dùng lại thẻ canvas/div có sẵn trong HTML
        if (cls.pcaData && document.getElementById(pcaDivId)) {
            
            // Vì HTML cũ đang dùng thẻ <div> cho Plotly, nhưng Chart.js cần thẻ <canvas>
            // Ta sẽ tự động thay thế <div> thành <canvas> để vẽ bằng Chart.js
            const pcaContainer = document.getElementById(pcaDivId);
            pcaContainer.innerHTML = ''; // Xoá trắng thẻ div
            pcaContainer.style.height = '400px'; // Đặt chiều cao cho đẹp
            
            const canvas = document.createElement('canvas');
            pcaContainer.appendChild(canvas);
            const ctx = canvas.getContext('2d');

            const varianceData = cls.pcaData.cumulative_variance;
            
            // Chỉ lấy 100 components đầu tiên để vẽ cho đẹp (nếu bạn muốn hiện cả 768 thì bỏ .slice(0, 100))
            const maxComponentsToShow = Math.min(150, varianceData.length); 
            const displayData = varianceData.slice(0, maxComponentsToShow);
            
            // Tạo nhãn trục X: [1, 2, 3, ..., 100]
            const labels = Array.from({length: displayData.length}, (_, i) => i + 1);

            // Tìm số component cần thiết để đạt 95% variance (0.95)
            const target95Index = varianceData.findIndex(v => v >= 0.95);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cumulative Explained Variance',
                        data: displayData,
                        borderColor: '#f43f5e', // Màu rose-500
                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        pointRadius: 0, // Ẩn các điểm tròn đi cho đường mượt
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
                                label: function(context) {
                                    return `Variance: ${(context.raw * 100).toFixed(2)}%`;
                                }
                            }
                        },
                        // Thêm đường kẻ ngang tại 95% nếu bạn muốn (tuỳ chọn)
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
                                callback: function(value) {
                                    return (value * 100) + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        console.log('🎉 Hoàn tất vẽ toàn bộ biểu đồ Image EDA!');
    }

    // Xuất hàm ra Global để data-loader.js gọi
    window.initializeImageCharts = initializeImageCharts;

})();