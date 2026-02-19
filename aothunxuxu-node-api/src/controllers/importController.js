const xlsx = require('xlsx');
const Product = require('../models/Product');
const fs = require('fs');

// ============================================================
//  SMART IMPORT - HELPER FUNCTIONS
// ============================================================

// Danh sách từ khóa nhận diện tự động cho từng trường
const COLUMN_KEYWORDS = {
    name: ['name', 'ten', 'tên', 'tên sản phẩm', 'ten san pham', 'san pham', 'sản phẩm', 'product', 'product name', 'ten hang', 'tên hàng', 'hang hoa', 'hàng hóa'],
    price: ['price', 'gia', 'giá', 'don gia', 'đơn giá', 'gia ban', 'giá bán', 'cost', 'gia si', 'giá sỉ', 'gia le', 'giá lẻ', 'amount'],
    category: ['category', 'danh muc', 'danh mục', 'loai', 'loại', 'nhom', 'nhóm', 'type', 'phan loai', 'phân loại'],
    description: ['description', 'mo ta', 'mô tả', 'ghi chu', 'ghi chú', 'note', 'notes', 'detail', 'chi tiet', 'chi tiết', 'desc'],
    imageUrl: ['image', 'anh', 'ảnh', 'hinh', 'hình', 'picture', 'photo', 'link anh', 'link ảnh', 'url anh', 'url ảnh', 'img', 'image url']
};

// Chuẩn hóa chuỗi để so sánh: bỏ dấu, thường hóa, cắt trắng
function normalize(str) {
    if (typeof str !== 'string') return '';
    return str.toLowerCase().trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // bỏ dấu tiếng Việt
}

// Tự động nhận diện field cho một tên cột (với độ ưu tiên: Khớp tuyệt đối > Khớp một phần)
function detectField(columnHeader) {
    const norm = normalize(columnHeader);
    if (!norm) return null;

    // Pass 1: Kiểm tra khớp tuyệt đối trên toàn bộ các trường
    for (const [field, keywords] of Object.entries(COLUMN_KEYWORDS)) {
        for (const kw of keywords) {
            if (norm === normalize(kw)) {
                return field;
            }
        }
    }

    // Pass 2: Kiểm tra khớp một phần (dùng regex word boundary để tránh "anh" khớp "danh")
    for (const [field, keywords] of Object.entries(COLUMN_KEYWORDS)) {
        for (const kw of keywords) {
            const normKw = normalize(kw);
            // Chỉ coi là khớp nếu từ khóa xuất hiện như một từ đứng riêng biệt
            const regex = new RegExp(`\\b${normKw}\\b|\\b${norm}\\b`, 'i');
            if (regex.test(norm) || regex.test(normKw)) {
                return field;
            }
        }
    }

    return null;
}

// Tìm dòng chứa header thực sự trong sheet (header detection)
function findHeaderRow(rawData) {
    if (!rawData || rawData.length === 0) return { headerRow: 0, dataRows: rawData };

    for (let i = 0; i < Math.min(rawData.length, 20); i++) {
        const row = rawData[i];
        if (!row || typeof row !== 'object') continue;
        const values = Object.values(row).filter(v => v !== null && v !== undefined && v !== '');
        if (values.length < 2) continue;

        // Kiểm tra nếu dòng này có ít nhất 1 cột khớp keyword
        const matchCount = values.filter(v => detectField(String(v))).length;
        if (matchCount >= 1) {
            return { headerRow: i, dataRows: rawData.slice(i + 1) };
        }
    }
    return { headerRow: 0, dataRows: rawData.slice(1) };
}

// =================================================================
//  STEP 1: PARSE - Đọc file, trả về headers & preview (KHÔNG lưu)
// @route   POST /api/products/import/parse
// @access  Admin
// =================================================================
exports.parseImport = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng tải lên file Excel!' });
    }

    try {
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];

        // Đọc thô, giữ nguyên header để tìm kiếm
        const rawWithHeaders = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        // Tìm dòng header thực sự
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(rawWithHeaders.length, 20); i++) {
            const row = rawWithHeaders[i];
            if (!row || row.length < 2) continue;
            const matchCount = row.filter(v => v && detectField(String(v))).length;
            if (matchCount >= 1) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
            // Mặc định dùng dòng đầu tiên có dữ liệu
            headerRowIndex = rawWithHeaders.findIndex(r => r && r.length >= 1);
            if (headerRowIndex === -1) {
                fs.unlinkSync(filePath);
                return res.status(400).json({ message: 'File không có dữ liệu hợp lệ!' });
            }
        }

        const headers = rawWithHeaders[headerRowIndex].map((h, idx) => ({
            index: idx,
            original: h || `Cột ${idx + 1}`,
            detectedField: h ? detectField(String(h)) : null
        }));

        // Lấy 5 dòng dữ liệu đầu tiên làm preview
        const dataRows = rawWithHeaders.slice(headerRowIndex + 1).filter(r => r && r.some(v => v !== null && v !== undefined && v !== ''));
        const previewRows = dataRows.slice(0, 5).map(row =>
            headers.map(h => row[h.index] !== undefined ? String(row[h.index]) : '')
        );

        // Tổng số dòng dữ liệu
        const totalDataRows = dataRows.length;

        // Lưu đường dẫn file vào session-like response để dùng ở step 2
        // (Vì serverless, ta trả về filePath để FE gửi lại, hoặc dùng upload ID)
        // Trong môi trường local, ta dùng filename
        res.json({
            headers,
            previewRows,
            totalRows: totalDataRows,
            tempFilename: req.file.filename, // FE sẽ gửi lại cái này ở step 2
            headerRowIndex,
            sheetName
        });
    } catch (err) {
        console.error('[IMPORT PARSE ERROR]', err);
        if (req.file) {
            try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        res.status(500).json({ message: 'Lỗi khi đọc file Excel. Hãy kiểm tra định dạng!' });
    }
};

// =================================================================
//  STEP 2: CONFIRM - Nhận mapping từ FE, đọc lại file, lưu vào DB
// @route   POST /api/products/import/confirm
// @access  Admin
// =================================================================
exports.confirmImport = async (req, res) => {
    const { mapping, tempFilename, headerRowIndex } = req.body;

    if (!tempFilename || !mapping) {
        return res.status(400).json({ message: 'Thiếu thông tin mapping hoặc file!' });
    }

    // Tìm file temp (multer lưu trong /tmp/)
    const tmpDir = process.platform === 'win32' ? require('os').tmpdir() : '/tmp';
    const filePath = require('path').join(tmpDir, tempFilename);

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'File tạm đã hết hạn! Vui lòng upload lại.' });
    }

    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const rawWithHeaders = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        const headerRow = rawWithHeaders[headerRowIndex] || rawWithHeaders[0];
        const dataRows = rawWithHeaders.slice(Number(headerRowIndex) + 1).filter(r => r && r.some(v => v !== null && v !== undefined && v !== ''));

        // mapping = { name: 0, price: 2, category: 1, ... } (field -> column index)
        const parsedMapping = typeof mapping === 'string' ? JSON.parse(mapping) : mapping;

        const productsToCreate = [];
        const errors = [];
        let skippedCount = 0;

        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            const rowNum = i + 2; // 1-indexed + skip header

            const getValue = (field) => {
                const colIdx = parsedMapping[field];
                if (colIdx === undefined || colIdx === null || colIdx === '') return '';
                return row[colIdx] !== undefined ? String(row[colIdx]).trim() : '';
            };

            const name = getValue('name');
            let priceRaw = getValue('price');
            const category = getValue('category');
            const description = getValue('description');
            const imageUrl = getValue('imageUrl') || '/placeholder.jpg';

            // Làm sạch giá
            if (priceRaw) {
                priceRaw = priceRaw.replace(/[^0-9.]/g, '');
            }

            // Validate bắt buộc
            if (!name) {
                errors.push({ row: rowNum, field: 'name', message: 'Thiếu Tên sản phẩm' });
                skippedCount++;
                continue;
            }
            if (!priceRaw || isNaN(parseFloat(priceRaw))) {
                errors.push({ row: rowNum, field: 'price', message: `Giá không hợp lệ: "${getValue('price')}"` });
                skippedCount++;
                continue;
            }

            productsToCreate.push({
                name,
                price: parseFloat(priceRaw),
                description,
                category: category || 'AoThun',
                imageUrl
            });
        }

        // Kiểm tra trùng lặp (theo tên)
        const existingProducts = await Product.findAll({ attributes: ['name'] });
        const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().trim()));

        const duplicates = [];
        const uniqueProducts = productsToCreate.filter(p => {
            if (existingNames.has(p.name.toLowerCase().trim())) {
                duplicates.push(p.name);
                return false;
            }
            return true;
        });

        if (uniqueProducts.length > 0) {
            await Product.bulkCreate(uniqueProducts);
        }

        // Cleanup file temp
        try { fs.unlinkSync(filePath); } catch (e) { }

        res.status(200).json({
            message: 'Import hoàn thành!',
            imported: uniqueProducts.length,
            skipped: skippedCount,
            duplicates: duplicates.length,
            duplicateNames: duplicates,
            errors,
            total: dataRows.length
        });

    } catch (err) {
        console.error('[IMPORT CONFIRM ERROR]', err);
        try { fs.unlinkSync(filePath); } catch (e) { }
        res.status(500).json({ message: 'Lỗi khi lưu dữ liệu: ' + err.message });
    }
};

// =================================================================
//  LEGACY: Nhập trực tiếp (giữ lại để tương thích ngược)
// @route   POST /api/products/import
// @access  Admin
// =================================================================
exports.importProducts = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an Excel file' });
    }

    try {
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const productsToCreate = [];
        let skippedCount = 0;

        for (const row of sheet) {
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                if (key) normalizedRow[normalize(key)] = row[key];
            });

            const name = Object.keys(normalizedRow).reduce((found, k) => {
                if (found) return found;
                return detectField(k) === 'name' ? String(normalizedRow[k]) : null;
            }, null);

            let priceVal = Object.keys(normalizedRow).reduce((found, k) => {
                if (found !== null) return found;
                return detectField(k) === 'price' ? normalizedRow[k] : null;
            }, null);

            if (typeof priceVal === 'string') priceVal = priceVal.replace(/[^0-9.]/g, '');

            if (!name || !priceVal) { skippedCount++; continue; }

            const category = Object.keys(normalizedRow).reduce((f, k) => f || (detectField(k) === 'category' ? String(normalizedRow[k]) : null), null);
            const description = Object.keys(normalizedRow).reduce((f, k) => f || (detectField(k) === 'description' ? String(normalizedRow[k]) : null), null);
            const imageUrl = Object.keys(normalizedRow).reduce((f, k) => f || (detectField(k) === 'imageUrl' ? String(normalizedRow[k]) : null), null);

            productsToCreate.push({ name, price: parseFloat(priceVal), description: description || '', category: category || 'AoThun', imageUrl: imageUrl || '/placeholder.jpg' });
        }

        if (productsToCreate.length > 0) await Product.bulkCreate(productsToCreate);
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'Import successful', count: productsToCreate.length, skipped: skippedCount, total: sheet.length });
    } catch (err) {
        console.error('Import error:', err);
        if (req.file) { try { fs.unlinkSync(req.file.path); } catch (e) { } }
        res.status(500).json({ message: 'Server error during import' });
    }
};
