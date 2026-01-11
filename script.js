// 设置 PDF.js 的 worker 地址
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const printType = document.getElementById('printType');

// 价格规则配置
const PRICE_RULES = {
    bw_double: 0.05,    // 黑白双面，每面0.05
    bw_single: 0.07,    // 黑白单面，每张0.07
    color_double: 0.3,  // 彩色双面，每面0.3
    color_single: 0.35  // 彩色单面，每张0.35
};

// 点击上传
dropZone.onclick = () => fileInput.click();

fileInput.onchange = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
};

async function processFiles(files) {
    const tbody = document.querySelector('#resultTable tbody');
    const type = printType.value;
    const unitPrice = PRICE_RULES[type];
    
    let totalP = 0;
    let totalA = 0;

    for (const file of files) {
        if (file.type !== "application/pdf") continue;

        // 读取 PDF 页数
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const pageCount = pdf.numPages;

        // 计算单行价格
        const subtotal = (pageCount * unitPrice).toFixed(2);
        
        // 渲染表格行
        const row = `<tr>
            <td>${file.name}</td>
            <td>${pageCount}</td>
            <td>${unitPrice}</td>
            <td>￥${subtotal}</td>
        </tr>`;
        tbody.innerHTML += row;

        totalP += pageCount;
        totalA += parseFloat(subtotal);
    }

    // 更新汇总信息
    document.getElementById('totalFiles').innerText = files.length;
    document.getElementById('totalPages').innerText = totalP;
    document.getElementById('finalAmount').innerText = totalA.toFixed(2);
}