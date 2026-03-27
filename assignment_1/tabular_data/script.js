        // Target variable distribution
        const ctxTarget = document.getElementById('targetDistChart').getContext('2d');

        new Chart(ctxTarget, {
            type: 'bar',
            data: {
                labels: ["No Heart Disease", "Heart Disease"],
                datasets: [{
                    label: 'Count',
                    data: [229787, 23893],
                    // Giữ nguyên 2 màu Xanh lam và Tím của bạn, thêm chút opacity cho đẹp
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)', // #3b82f6
                        'rgba(139, 92, 246, 0.7)'  // #8b5cf6
                    ],
                    borderColor: [
                        '#3b82f6',
                        '#8b5cf6'
                    ],
                    borderWidth: 1,
                    barPercentage: 0.8 // Thu nhỏ bề ngang cột lại vì chỉ có 2 cột, để to quá sẽ thô
                }]
            },
            // PLUGIN: Vẽ text (229,787) lên trên đầu cột giống Plotly
            plugins: [{
                id: 'topLabels',
                afterDatasetsDraw(chart) {
                    const { ctx } = chart;
                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i);
                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            ctx.fillStyle = '#475569'; // Màu chữ text-slate-600
                            ctx.font = 'bold 14px Poppins, sans-serif'; // Đồng bộ font
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            // Vẽ số, format có dấu phẩy (toLocaleString) cách đỉnh cột 5px
                            ctx.fillText(data.toLocaleString(), bar.x, bar.y - 5);
                        });
                    });
                }
            }],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ' Count: ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Count', color: '#64748b' },
                        grid: { color: '#f1f5f9' },
                        // Thêm dấu phẩy vào trục Y (VD: 200,000 thay vì 200000)
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString(); 
                            }
                        },
                        grace: '10%' // Tăng thêm 10% khoảng trống phía trên cùng trục Y để chữ không bị cắt
                    },
                    x: {
                        grid: { display: false }, // Ẩn lưới trục X cho gọn
                        ticks: { 
                            color: '#1e293b', 
                            font: { size: 14, weight: 'bold' } 
                        }
                    }
                }
            }
        });
        // univariate analysis
        // ==========================================
        // 1. DATA TỪ FILE JSON CẬP NHẬT MỚI NHẤT
        // ==========================================
        const univariateData = {
            "continuous": {
                "BMI": {
                "labels": ["12–13", "13–14", "14–15", "15–16", "16–17", "17–18", "18–19", "19–20", "20–21", "21–22", "22–23", "23–24", "24–25", "25–26", "26–27", "27–28", "28–29", "29–30", "30–31", "31–32", "32–33", "33–34", "34–35", "35–36", "36–37", "37–38", "38–39", "39–40", "40–41", "41–42", "42–43", "43–44", "44–45", "45–46", "46–47", "47–48", "48–49", "49–50", "50–51", "51–52", "52–53", "53–54", "54–55", "55–56", "56–57", "57–58", "58–59", "59–60", "60–61", "61–62", "62–63", "63–64", "64–65", "65–66", "66–67", "67–68", "68–69", "69–70", "70–71", "71–72", "72–73", "73–74", "74–75", "75–76", "76–77", "77–78", "78–79", "79–80", "80–81", "81–82", "82–83", "83–84", "84–85", "85–86", "86–87", "87–88", "88–89", "89–90", "90–91", "91–92", "92–93", "93–94", "94–95", "95–96", "96–97", "97–98"],
                "counts": [6, 21, 41, 132, 348, 776, 1803, 3968, 6327, 9855, 13643, 15610, 19550, 17146, 20562, 24606, 16545, 14890, 14573, 12275, 10474, 8948, 7181, 5575, 4633, 4147, 3397, 2911, 2258, 1659, 1639, 1500, 1043, 819, 750, 622, 484, 416, 372, 253, 215, 237, 113, 169, 109, 86, 71, 54, 63, 35, 43, 34, 24, 19, 13, 15, 14, 9, 15, 49, 14, 47, 16, 52, 3, 55, 1, 66, 2, 49, 37, 2, 44, 1, 1, 61, 2, 28, 1, 1, 32, 0, 0, 12, 1, 7]},
                "MentHlth": {
                "labels": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
                "counts": [175680, 8538, 13054, 7381, 3789, 9030, 988, 3100, 639, 91, 6373, 41, 398, 41, 1167, 5505, 88, 54, 97, 16, 3364, 227, 63, 38, 33, 1188, 45, 79, 327, 158, 12088]},
                "PhysHlth": {
                "labels": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
                "counts": [160052, 11388, 14764, 8495, 4542, 7622, 1330, 4538, 809, 179, 5595, 60, 578, 68, 2587, 4916, 112, 96, 152, 22, 3273, 663, 70, 56, 72, 1336, 69, 99, 522, 215, 19400]}            
            },
            "categorical": {
                "Diabetes": {"labels": ["No (0)", "Borderline (1)", "Diabetes (2)"], "counts": [213703, 4631, 35346]},
                "GenHlth": {"labels": ["Excellent (1)", "Very good (2)", "Good (3)", "Fair (4)", "Poor (5)"], "counts": [45299, 89084, 75646, 31570, 12081]},
                "Age": {"labels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], "counts": [5700, 7598, 11123, 13823, 16157, 19819, 26314, 30832, 33244, 32194, 23533, 15980, 17363]},
                "Education": {"labels": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0], "counts": [174, 4043, 9478, 62750, 69910, 107325]},
                "Income": {"labels": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0], "counts": [9811, 11783, 15994, 20135, 25883, 36470, 43219, 90385]},
                "HighBP": {"labels": [0.0, 1.0], "counts": [144851, 108829]},
                "HighChol": {"labels": [0.0, 1.0], "counts": [146089, 107591]},
                "CholCheck": {"labels": [0.0, 1.0], "counts": [9470, 244210]},
                "Smoker": {"labels": [0.0, 1.0], "counts": [141257, 112423]},
                "Stroke": {"labels": [0.0, 1.0], "counts": [243388, 10292]},
                "PhysActivity": {"labels": [0.0, 1.0], "counts": [61760, 191920]},
                "Fruits": {"labels": [0.0, 1.0], "counts": [92782, 160898]},
                "Veggies": {"labels": [0.0, 1.0], "counts": [47839, 205841]},
                "HvyAlcoholConsump": {"labels": [0.0, 1.0], "counts": [239424, 14256]},
                "AnyHealthcare": {"labels": [0.0, 1.0], "counts": [12417, 241263]},
                "NoDocbcCost": {"labels": [0.0, 1.0], "counts": [232326, 21354]},
                "DiffWalk": {"labels": [0.0, 1.0], "counts": [211005, 42675]},
                "Sex": {"labels": ["Female (0)", "Male (1)"], "counts": [141974, 111706]}
            }
        };


        // ==========================================
        // BẢNG MÀU CHUẨN TAILWIND 
        // ==========================================
        const colorPalette = [
            { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.6)' }, { border: '#10b981', bg: 'rgba(16, 185, 129, 0.6)' },
            { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.6)' }, { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.6)' },
            { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.6)' }, { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.6)' },
            { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.6)' }, { border: '#84cc16', bg: 'rgba(132, 204, 22, 0.6)' },
            { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.6)' }, { border: '#14b8a6', bg: 'rgba(20, 184, 166, 0.6)' }
        ];

        // ==========================================
        // 1. VẼ NHÓM CONTINUOUS (Cột dọc)
        // ==========================================
        const numContainer = document.getElementById('continuous-charts-container');

        Object.entries(univariateData.continuous).forEach(([feature, data], index) => {
            const color = colorPalette[index % colorPalette.length];
            
            const chartDiv = document.createElement('div');
            chartDiv.className = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6";
            chartDiv.innerHTML = `
                <h3 class="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <span class="w-2 h-6 rounded-full inline-block" style="background-color: ${color.border}"></span> 
                    ${feature} Distribution
                </h3>
                <div style="height: 350px; width: 100%;">
                    <canvas id="numChart-${index}"></canvas>
                </div>
            `;
            numContainer.appendChild(chartDiv);
            
            const ctx = document.getElementById(`numChart-${index}`).getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels, 
                    datasets: [{
                        label: 'Frequency',
                        data: data.counts,
                        backgroundColor: color.bg,       
                        borderColor: color.border,       
                        borderWidth: 1,
                        categoryPercentage: feature === "BMI" ? 1.0 : 0.8,
                        barPercentage: feature === "BMI" ? 1.0 : 0.9,
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true, grid: { color: '#f1f5f9' },
                            title: { display: true, text: 'Count', color: '#64748b' },
                            ticks: { callback: value => value.toLocaleString() } 
                        },
                        x: {
                            grid: { display: false },
                            ticks: { maxRotation: 45, minRotation: 45, autoSkip: true, maxTicksLimit: 20 }
                        }
                    }
                }
            });
        });
        const labelMappings = {
            "Sex": ["Female (0)", "Male (1)"],
            "Diabetes": ["No (0)", "Borderline (1)", "Diabetes (2)"],
            "GenHlth": ["Excellent (1)", "Very Good (2)", "Good (3)", "Fair (4)", "Poor (5)"],
        };

        // ==========================================
        // 2. VẼ NHÓM CATEGORICAL (Cột ngang)
        // ==========================================
        const catContainer = document.getElementById('binary-charts-container');
        const offset = Object.keys(univariateData.continuous).length;

        Object.entries(univariateData.categorical).forEach(([feature, data], index) => {
            const color = colorPalette[(offset + index) % colorPalette.length];
            
            const chartDiv = document.createElement('div');
            chartDiv.className = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6";
            chartDiv.innerHTML = `
                <h3 class="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <span class="w-2 h-6 rounded-full inline-block" style="background-color: ${color.border}"></span> 
                    ${feature} Distribution
                </h3>
                <div style="height: 300px; width: 100%;">
                    <canvas id="catChart-${index}"></canvas>
                </div>
            `;
            catContainer.appendChild(chartDiv);
            
            let displayLabels;

            if (labelMappings[feature]) {
                displayLabels = labelMappings[feature];
            } 
            else if (data.labels.length === 2) {
                displayLabels = ["No (0)", "Yes (1)"];
            } 
            else {
                displayLabels = data.labels;
            }

            const ctx = document.getElementById(`catChart-${index}`).getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: displayLabels,
                    datasets: [{
                        label: 'Count',
                        data: data.counts,
                        backgroundColor: color.bg,     
                        borderColor: color.border,
                        borderWidth: 1,
                    }]
                },
                options: {
                    indexAxis: 'y', // Xoay ngang toàn bộ
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            beginAtZero: true, grid: { color: '#f1f5f9' },
                            title: { display: true, text: 'Count', color: '#64748b' },
                            ticks: { callback: value => value.toLocaleString() } 
                        },
                        y: {
                            grid: { display: false }
                        }
                    }
                }
            });
        });

        // Correlation Heatmap
        document.addEventListener('DOMContentLoaded', function() {
        
        const corrDiv = document.getElementById('correlationHeatmap');
        
        if (corrDiv) {
            var annotations =[];
            
            var features =[
                "HeartDiseaseorAttack", "HighBP", "HighChol", "CholCheck", "BMI", 
                "Smoker", "Stroke", "Diabetes", "PhysActivity", "Fruits", 
                "Veggies", "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", 
                "GenHlth", "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", 
                "Education", "Income"
            ];

            var matrix = [[1.0,0.209,0.181,0.044,0.053,0.114,0.203,0.18,-0.087,-0.02,-0.039,-0.029,0.019,0.031,0.258,0.065,0.182,0.213,0.086,0.222,-0.1,-0.141],[0.209,1.0,0.298,0.099,0.214,0.097,0.13,0.272,-0.125,-0.041,-0.061,-0.004,0.038,0.017,0.301,0.056,0.161,0.224,0.052,0.344,-0.141,-0.171],[0.181,0.298,1.0,0.086,0.107,0.091,0.093,0.209,-0.078,-0.041,-0.04,-0.012,0.042,0.013,0.208,0.062,0.122,0.145,0.031,0.272,-0.071,-0.085],[0.044,0.099,0.086,1.0,0.034,-0.01,0.024,0.068,0.004,0.024,0.006,-0.024,0.118,-0.058,0.047,-0.008,0.032,0.041,-0.022,0.09,0.002,0.014],[0.053,0.214,0.107,0.034,1.0,0.014,0.02,0.224,-0.147,-0.088,-0.062,-0.049,-0.018,0.058,0.239,0.085,0.121,0.197,0.043,-0.037,-0.104,-0.1],[0.114,0.097,0.091,-0.01,0.014,1.0,0.061,0.063,-0.087,-0.078,-0.031,0.102,-0.023,0.049,0.163,0.092,0.116,0.122,0.094,0.121,-0.162,-0.124],[0.203,0.13,0.093,0.024,0.02,0.061,1.0,0.107,-0.069,-0.013,-0.041,-0.017,0.009,0.035,0.178,0.07,0.149,0.177,0.003,0.127,-0.076,-0.129],[0.18,0.272,0.209,0.068,0.224,0.063,0.107,1.0,-0.122,-0.042,-0.059,-0.058,0.015,0.035,0.303,0.074,0.176,0.224,0.031,0.185,-0.131,-0.171],[-0.087,-0.125,-0.078,0.004,-0.147,-0.087,-0.069,-0.122,1.0,0.143,0.153,0.012,0.036,-0.062,-0.266,-0.126,-0.219,-0.253,0.032,-0.093,0.2,0.199],[-0.02,-0.041,-0.041,0.024,-0.088,-0.078,-0.013,-0.042,0.143,1.0,0.254,-0.035,0.032,-0.044,-0.104,-0.068,-0.045,-0.048,-0.091,0.065,0.11,0.08],[-0.039,-0.061,-0.04,0.006,-0.062,-0.031,-0.041,-0.059,0.153,0.254,1.0,0.021,0.03,-0.032,-0.123,-0.059,-0.064,-0.081,-0.065,-0.01,0.154,0.151],[-0.029,-0.004,-0.012,-0.024,-0.049,0.102,-0.017,-0.058,0.012,-0.035,0.021,1.0,-0.01,0.005,-0.037,0.025,-0.026,-0.038,0.006,-0.035,0.024,0.054],[0.019,0.038,0.042,0.118,-0.018,-0.023,0.009,0.015,0.036,0.032,0.03,-0.01,1.0,-0.233,-0.041,-0.053,-0.008,0.007,-0.019,0.138,0.123,0.158],[0.031,0.017,0.013,-0.058,0.058,0.049,0.035,0.035,-0.062,-0.044,-0.032,0.005,-0.233,1.0,0.166,0.192,0.149,0.118,-0.045,-0.12,-0.101,-0.203],[0.258,0.301,0.208,0.047,0.239,0.163,0.178,0.303,-0.266,-0.104,-0.123,-0.037,-0.041,0.166,1.0,0.302,0.524,0.457,-0.006,0.152,-0.285,-0.37],[0.065,0.056,0.062,-0.008,0.085,0.092,0.07,0.074,-0.126,-0.068,-0.059,0.025,-0.053,0.192,0.302,1.0,0.354,0.234,-0.081,-0.092,-0.102,-0.21],[0.182,0.161,0.122,0.032,0.121,0.116,0.149,0.176,-0.219,-0.045,-0.064,-0.026,-0.008,0.149,0.524,0.354,1.0,0.478,-0.043,0.099,-0.155,-0.267],[0.213,0.224,0.145,0.041,0.197,0.122,0.177,0.224,-0.253,-0.048,-0.081,-0.038,0.007,0.118,0.457,0.234,0.478,1.0,-0.07,0.204,-0.193,-0.32],[0.086,0.052,0.031,-0.022,0.043,0.094,0.003,0.031,0.032,-0.091,-0.065,0.006,-0.019,-0.045,-0.006,-0.081,-0.043,-0.07,1.0,-0.027,0.019,0.127],[0.222,0.344,0.272,0.09,-0.037,0.121,0.127,0.185,-0.093,0.065,-0.01,-0.035,0.138,-0.12,0.152,-0.092,0.099,0.204,-0.027,1.0,-0.102,-0.128],[-0.1,-0.141,-0.071,0.002,-0.104,-0.162,-0.076,-0.131,0.2,0.11,0.154,0.024,0.123,-0.101,-0.285,-0.102,-0.155,-0.193,0.019,-0.102,1.0,0.449],[-0.141,-0.171,-0.085,0.014,-0.1,-0.124,-0.129,-0.171,0.199,0.08,0.151,0.054,0.158,-0.203,-0.37,-0.21,-0.267,-0.32,0.127,-0.128,0.449,1.0]
            ];

            // 3. VÒNG LẶP TẠO CHÚ THÍCH THEO CÁCH CỦA GIẢNG VIÊN
            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    annotations.push({
                        x: j,
                        y: i,
                        text: matrix[i][j].toFixed(3),
                        showarrow: false,
                        font: {
                            color: Math.abs(matrix[i][j]) > 0.5 ? 'white' : 'black',
                            size: 9, // Với 22 biến thì size 11 là vừa vặn
                            weight: 'bold'
                        }
                    });
                }
            }

            // 4. DATA SETUP CỦA PLOTLY
            var heatmapData =[{
                z: matrix,
                x: features,
                y: features,
                type: 'heatmap',
                colorscale: 'RdBu_r',
                zmid: 0,
                showscale: true,
                colorbar: {
                    title: 'Correlation',
                    titleside: 'right'
                }
            }];
            
            // 5. LAYOUT (Đã chỉnh size và lề để phù hợp 22 features của bạn)
            var layout = {
                title: {
                    text: 'Feature Correlation Matrix',
                    x: 0.5,
                    font: {size: 18}
                },
                xaxis: {
                    title: 'Features',
                    tickangle: 45
                },
                yaxis: {
                    title: 'Features',
                    autorange: 'reversed'
                },
                annotations: annotations,
                width: null,
                height: 650, // <-- Tăng lên 900px để 22 ô vuông không bị bóp méo
                margin: {l: 180, r: 100, t: 80, b: 150} // <-- Tăng lề trái (l:180) để hiện đủ chữ HeartDiseaseorAttack
            };
            
            var config = {
                responsive: true,
                displayModeBar: true,
                displaylogo: false
            };
            
            // 6. LỆNH VẼ
            Plotly.newPlot('correlationHeatmap', heatmapData, layout, config);
        }
    });

    // 1. Data JSON của bạn (bạn có thể đang load từ file, ở đây mình gán cứng để ví dụ)
        const featureImportanceData = {
        "labels": ["BMI", "Age", "Income", "PhysHlth", "Education", "GenHlth", "MentHlth", "Fruits", "PhysActivity", "Diabetes", "Stroke", "Veggies", "HighBP", "DiffWalk", "HighChol", "Sex", "Smoker", "NoDocbcCost", "HvyAlcoholConsump", "AnyHealthcare", "CholCheck"],
        "data": [
            {"feature": "BMI", "importance": 0.195},
            {"feature": "Age", "importance": 0.11},
            {"feature": "Income", "importance": 0.103},
            {"feature": "PhysHlth", "importance": 0.086},
            {"feature": "Education", "importance": 0.073},
            {"feature": "GenHlth", "importance": 0.068},
            {"feature": "MentHlth", "importance": 0.065},
            {"feature": "Fruits", "importance": 0.033},
            {"feature": "PhysActivity", "importance": 0.029},
            {"feature": "Diabetes", "importance": 0.028},
            {"feature": "Stroke", "importance": 0.028},
            {"feature": "Veggies", "importance": 0.027},
            {"feature": "HighBP", "importance": 0.027},
            {"feature": "DiffWalk", "importance": 0.025},
            {"feature": "HighChol", "importance": 0.024},
            {"feature": "Sex", "importance": 0.023},
            {"feature": "Smoker", "importance": 0.021},
            {"feature": "NoDocbcCost", "importance": 0.015},
            {"feature": "HvyAlcoholConsump", "importance": 0.009},
            {"feature": "AnyHealthcare", "importance": 0.008},
            {"feature": "CholCheck", "importance": 0.004}
        ]
        };

        // 2. Trích xuất mảng các con số importance
        const importanceValues = featureImportanceData.data.map(item => item.importance);

        // 3. Vẽ biểu đồ lên Canvas
        const ctxFeature = document.getElementById('featureImportanceChart').getContext('2d');
        new Chart(ctxFeature, {
            type: 'bar', // Biểu đồ cột
            data: {
                labels: featureImportanceData.labels, 
                datasets: [{
                    label: 'Importance',
                    data: importanceValues,
                    // Đổi màu xanh cho tone-sur-tone với cái icon màu blue-500 của bạn (#3b82f6)
                    backgroundColor: 'rgba(59, 130, 246, 0.5)', 
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                indexAxis: 'y', 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Importance', color: '#64748b' },
                        grid: { color: '#f1f5f9' }
                    },
                    y: {
                        ticks: { 
                            autoSkip: false, // Ép hiển thị toàn bộ 21 tên biến, không bị ẩn bớt
                            color: '#475569'
                        },
                        grid: { display: false } // Ẩn lưới trục y cho biểu đồ sạch hơn
                    }
                }
            }
        });
        // ==========================================
        // 1. DATA PHÂN TÍCH FEATURES VS TARGET
        // ==========================================
        const bivariateData = {
            "target": "HeartDiseaseorAttack",
            "features": {
                "HighBP": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [138886, 90901]}, {"label": "Heart Disease", "data": [5965, 17928]}]},
                "HighChol": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [138949, 90838]}, {"label": "Heart Disease", "data": [7140, 16753]}]},
                "CholCheck": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [9199, 220588]}, {"label": "Heart Disease", "data": [271, 23622]}]},
                "Smoker": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [132165, 97622]}, {"label": "Heart Disease", "data": [9092, 14801]}]},
                "Stroke": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [223432, 6355]}, {"label": "Heart Disease", "data": [19956, 3937]}]},
                "PhysActivity": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [53167, 176620]}, {"label": "Heart Disease", "data": [8593, 15300]}]},
                "Fruits": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [83337, 146450]}, {"label": "Heart Disease", "data": [9445, 14448]}]},
                "Veggies": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [42198, 187589]}, {"label": "Heart Disease", "data": [5641, 18252]}]},
                "HvyAlcoholConsump": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [216379, 13408]}, {"label": "Heart Disease", "data": [23045, 848]}]},
                "AnyHealthcare": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [11547, 218240]}, {"label": "Heart Disease", "data": [870, 23023]}]},
                "NoDocbcCost": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [211082, 18705]}, {"label": "Heart Disease", "data": [21244, 2649]}]},
                "DiffWalk": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [197027, 32760]}, {"label": "Heart Disease", "data": [13978, 9915]}]},
                "Sex": {"labels": [0, 1], "datasets": [{"label": "No Heart Disease", "data": [131769, 98018]}, {"label": "Heart Disease", "data": [10205, 13688]}]},
                "Diabetes": {"labels": [0, 1, 2], "datasets": [{"label": "No Heart Disease", "data": [198352, 3967, 27468]}, {"label": "Heart Disease", "data": [15351, 664, 7878]}]},
                "GenHlth": {"labels": [1, 2, 3, 4, 5], "datasets": [{"label": "No Heart Disease", "data": [44283, 84956, 67732, 24842, 7974]}, {"label": "Heart Disease", "data": [1016, 4128, 7914, 6728, 4107]}]},
                "Education": {"labels": [1, 2, 3, 4, 5, 6], "datasets": [{"label": "No Heart Disease", "data": [145, 3265, 7860, 55283, 62992, 100242]}, {"label": "Heart Disease", "data": [29, 778, 1618, 7467, 6918, 7083]}]},
                "Income": {"labels": [1, 2, 3, 4, 5, 6, 7, 8], "datasets": [{"label": "No Heart Disease", "data": [8258, 9586, 13475, 17307, 22722, 32824, 39815, 85800]}, {"label": "Heart Disease", "data": [1553, 2197, 2519, 2828, 3161, 3646, 3404, 4585]}]},
                "Age": {"labels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], "datasets": [{"label": "No Heart Disease", "data": [5671, 7544, 10997, 13630, 15806, 19107, 24889, 28579, 29886, 28001, 19586, 12887, 13204]}, {"label": "Heart Disease", "data": [29, 54, 126, 193, 351, 712, 1425, 2253, 3358, 4193, 3947, 3093, 4159]}]}
            }
        };

        // 2. BỘ TỪ ĐIỂN NHÃN (LABEL MAPPING)
        const bivariateLabelMap = {
            "Sex": ["Female (0)", "Male (1)"],
            "Diabetes": ["No", "Borderline", "Diabetes"],
            "GenHlth": ["Excellent", "V.Good", "Good", "Fair", "Poor"],
            "Age": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
            "Education": [1, 2, 3, 4, 5, 6],
            "Income": [1, 2, 3, 4, 5, 6, 7, 8]
        };

        // 3. LOGIC VẼ BIỂU ĐỒ (DỌC TOÀN BỘ)
        const bivariateContainer = document.getElementById('bivariate-charts-container');

        Object.entries(bivariateData.features).forEach(([feature, featureData], index) => {
            
            // Tạo Card HTML chuẩn Tailwind
            const chartDiv = document.createElement('div');
            chartDiv.className = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow";
            chartDiv.innerHTML = `
                <h3 class="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <span class="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span> ${feature} vs Heart Disease
                </h3>
                <div style="height: 400px; width: 100%;">
                    <canvas id="bivariateChart-${index}"></canvas>
                </div>
            `;
            bivariateContainer.appendChild(chartDiv);

            // Xử lý nhãn trục X thông minh
            let xLabels;
            if (bivariateLabelMap[feature]) {
                xLabels = bivariateLabelMap[feature];
            } else {
                xLabels = ["No (0)", "Yes (1)"];
            }

            const ctx = document.getElementById(`bivariateChart-${index}`).getContext('2d');
            
            new Chart(ctx, {
                type: 'bar', // CỘT DỌC
                data: {
                    labels: xLabels,
                    datasets: [
                        {
                            label: 'No Heart Disease',
                            data: featureData.datasets[0].data,
                            backgroundColor: 'rgba(59, 130, 246, 0.7)', // Màu xanh lam đồng bộ target
                            borderColor: '#3b82f6',
                            borderWidth: 1,
                        },
                        {
                            label: 'Heart Disease',
                            data: featureData.datasets[1].data,
                            backgroundColor: 'rgba(139, 92, 246, 0.7)', // Màu tím đồng bộ target
                            borderColor: '#8b5cf6',
                            borderWidth: 1,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            position: 'top', 
                            labels: { 
                                boxWidth: 12, 
                                font: { size: 12, family: 'Poppins' },
                                padding: 15
                            } 
                        },
                        tooltip: { 
                            mode: 'index', 
                            intersect: false,
                            callbacks: {
                                label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
                            }
                        }
                    },
                    scales: {
                        x: { 
                            stacked: true, // Cột chồng
                            grid: { display: false },
                            ticks: {
                                // Tự động xoay 45 độ nếu nhãn quá dài để tránh đè chữ
                                maxRotation: 45,
                                minRotation: 45,
                                font: { size: 11 }
                            }
                        },
                        y: { 
                            stacked: true, // Cột chồng
                            beginAtZero: true,
                            title: { display: true, text: 'Sample Count', color: '#64748b' },
                            grid: { color: '#f1f5f9' },
                            ticks: { 
                                callback: value => value.toLocaleString(),
                                font: { size: 11 }
                            }
                        }
                    }
                }
            });
        });