/**
 * IMAGE EDA - DATA LOADER
 * Tải các file JSON lớn và gán vào window object
 */
(function() {
    'use strict';
  
    async function loadAllImageData() {
        console.log('⏳ Đang tải dữ liệu Image EDA...');
        
        try {
            // Tải đồng loạt tất cả các file JSON
            const responses = await Promise.all([
                // 1. CORE
                fetch('./Image-EDA/core_EDA/aspect_ratio.json'), // Dán link
                fetch('./Image-EDA/core_EDA/dataset_class_distribution.json'),
                fetch('./Image-EDA/core_EDA/file_size_distribution.json'),
                fetch('./Image-EDA/core_EDA/image_quality.json'), 
                fetch('./Image-EDA/core_EDA/pixel_intensity_distribution.json'),
                fetch('./Image-EDA/core_EDA/scatter_size.json'), // Dán link file json scatter của bạn
                
                // 2. CLASSIFICATION
                fetch('./Image-EDA/classification/class_correlation_flat.json'),
                fetch('./Image-EDA/classification/pixel_intensity_distribution.json'),
                fetch('./Image-EDA/classification/umap_embedding_grouped.json'),

                // 3. DETECTION
                fetch('./Image-EDA/detection/area_histogram.json'), // Dán link
                fetch('./Image-EDA/detection/aspect_ratio_pie.json'), // Dán link
                fetch('./Image-EDA/detection/center_bias.json'), // Dán link
                fetch('./Image-EDA/detection/grid_distribution.json'), // Dán link
                fetch('./Image-EDA/detection/heatmap.json'), // Dán link
                fetch('./Image-EDA/detection/size_bar_chart.json'), // Dán link
                fetch('./Image-EDA/detection/size_categories_pie.json'), // Dán link

                // 4. SEGMENTATION
                fetch('./Image-EDA/segmentation/boundary_complexity_hist.json'),
                fetch('./Image-EDA/segmentation/boundary_metrics.json'),
                fetch('./Image-EDA/segmentation/boundary_smoothness_hist.json'),
                fetch('./Image-EDA/segmentation/boundary_thickness_hist.json'),
                fetch('./Image-EDA/segmentation/pixel_distribution.json'),
                fetch('./Image-EDA/segmentation/pixel_stats.json'),
                fetch('./Image-EDA/segmentation/shape_metrics.json')
            ]);
  
            // Kiểm tra xem có file nào bị lỗi 404 không
            const failedRequests = responses.filter(r => !r.ok);
            if (failedRequests.length > 0) {
                const failedUrls = failedRequests.map(r => r.url).join('\n');
                throw new Error(`Lỗi tải các file JSON sau:\n${failedUrls}`);
            }

            // Gán dữ liệu vào biến Global theo đúng cấu trúc thư mục
            // (Đọc tuần tự từ mảng responses theo thứ tự fetch ở trên)
            window.IMAGE_DATA = {
                core: {
                    aspectRatio: await responses[0].json(),
                    classDist: await responses[1].json(),
                    fileSize: await responses[2].json(),
                    quality: await responses[3].json(),
                    pixelIntensity: await responses[4].json(),
                    imageSize: await responses[5].json()
                },
                classification: {
                    classCorrelation: await responses[6].json(),
                    pixelIntensityClass: await responses[7].json(),
                    umapEmbedding: await responses[8].json()
                },
                detection: {
                    areaHist: await responses[9].json(),
                    aspectRatioPie: await responses[10].json(),
                    centerBias: await responses[11].json(),
                    grid3x3: await responses[12].json(),
                    positionHeatmap: await responses[13].json(),
                    sizeBar: await responses[14].json(),
                    sizeCatPie: await responses[15].json()
                },
                segmentation: {
                    complexityHist: await responses[16].json(),
                    boundaryMetrics: await responses[17].json(),
                    smoothnessHist: await responses[18].json(),
                    thicknessHist: await responses[19].json(),
                    pixelDist: await responses[20].json(),
                    pixelStats: await responses[21].json(),
                    shapeMetrics: await responses[22].json()
                }
            };
  
            console.log('✅ Đã tải xong toàn bộ 23 file dữ liệu Image EDA!');
  
            // Gọi hàm vẽ biểu đồ từ file main.js
            if (typeof window.initializeImageCharts === 'function') {
                window.initializeImageCharts();
            } else {
                console.warn('⚠️ Chưa tìm thấy hàm window.initializeImageCharts');
            }
  
        } catch (error) {
            console.error('❌ Lỗi tải dữ liệu JSON:', error);
            alert('Không thể tải dữ liệu JSON! Hãy kiểm tra lại Tab Console để xem file nào bị lỗi đường dẫn (ví dụ sai chữ hoa/chữ thường, dư chữ .json).');
        }
    }
  
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllImageData);
    } else {
        loadAllImageData();
    }
})();