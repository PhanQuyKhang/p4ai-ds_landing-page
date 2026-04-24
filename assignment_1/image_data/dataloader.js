/**
 * IMAGE EDA - DATA LOADER (UPDATED)
 * Tải các file JSON và gán vào window object
 */
(function() {
    'use strict';
  
    async function loadAllImageData() {
        console.log('⏳ Đang tải dữ liệu Image EDA...');
        
        try {
            // Tải đồng loạt tất cả các file JSON theo cấu trúc thư mục mới
            const responses = await Promise.all([
                // --- 1. CORE EDA ---
                fetch('./Image-EDA/core_EDA/aspect_ratio/aspect_ratio.json'),                   // 0
                fetch('./Image-EDA/core_EDA/file_size_distribution/file_size_distribution.json'), // 1
                fetch('./Image-EDA/core_EDA/image_quality/image_quality.json'),                 // 2
                fetch('./Image-EDA/core_EDA/image_resolution/scatter_size.json'),               // 3
                fetch('./Image-EDA/core_EDA/image_samples/image_samples.json'),                 // 4
                fetch('./Image-EDA/core_EDA/RGB_distribution/pixel_intensity_distribution.json'), // 5
                
                // --- 2. CLASSIFICATION ---
                fetch('./Image-EDA/classification/class_correlation/class_correlation_flat.json'),         // 6
                fetch('./Image-EDA/classification/class_distribution/dataset_class_distribution.json'),    // 7
                fetch('./Image-EDA/classification/feature_clustering/tsne_embedding_grouped.json'),       // 8
                fetch('./Image-EDA/classification/feature_clustering/umap_embedding_grouped.json'),       // 9
                fetch('./Image-EDA/classification/PCA/pca_data.json')                                      // 10
            ]);
  
            // Kiểm tra xem có file nào bị lỗi 404 không
            const failedRequests = responses.filter(r => !r.ok);
            if (failedRequests.length > 0) {
                const failedUrls = failedRequests.map(r => r.url).join('\n');
                throw new Error(`Lỗi tải các file JSON sau:\n${failedUrls}`);
            }

            // Gán dữ liệu vào biến Global theo cấu trúc logic
            // (Đọc tuần tự từ mảng responses theo đúng thứ tự fetch ở trên)
            window.IMAGE_DATA = {
                core: {
                    aspectRatio: await responses[0].json(),
                    fileSize: await responses[1].json(),
                    quality: await responses[2].json(),
                    imageSize: await responses[3].json(),      // scatter_size
                    imageSamples: await responses[4].json(),   // Data lấy mẫu ảnh
                    pixelIntensity: await responses[5].json()
                },
                classification: {
                    classCorrelation: await responses[6].json(),
                    classDist: await responses[7].json(),      // Phân phối class
                    tsneEmbedding: await responses[8].json(),  // T-SNE mới thêm
                    umapEmbedding: await responses[9].json(),
                    pcaData: await responses[10].json()        // PCA mới thêm
                }
            };
  
            console.log('✅ Đã tải xong toàn bộ 11 file dữ liệu Image EDA!');
  
            // Gọi hàm vẽ biểu đồ từ file script.js (hoặc file xử lý chart của bạn)
            if (typeof window.initializeImageCharts === 'function') {
                window.initializeImageCharts();
            } else {
                console.warn('⚠️ Chưa tìm thấy hàm window.initializeImageCharts để vẽ biểu đồ.');
            }
  
        } catch (error) {
            console.error('❌ Lỗi tải dữ liệu JSON:', error);
            alert('Không thể tải dữ liệu JSON! Hãy kiểm tra lại Tab Console xem đường dẫn file có chính xác không.');
        }
    }
  
    // Đảm bảo DOM đã load xong mới chạy fetch
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllImageData);
    } else {
        loadAllImageData();
    }
})();