const path = require('path');

// @desc    Upload image
// @route   POST /api/images/upload
// @access  Private/Admin
exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // With CloudinaryStorage, req.file.path contains the URL
    const fileUrl = req.file.path;

    res.json({
        url: fileUrl,
        filename: req.file.filename
    });
};
