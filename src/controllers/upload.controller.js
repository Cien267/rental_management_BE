const httpStatus = require('http-status');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/images');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new ApiError(httpStatus.BAD_REQUEST, 'Only image files (jpeg, jpg, png, gif, webp) are allowed!'), false);
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// Single file upload
const uploadSingle = upload.single('image');

// Multiple files upload
const uploadMultiple = upload.array('images', 10); // Maximum 10 files

const uploadImage = catchAsync(async (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: 'Kích thước file quá lớn. Kích thước tối đa là 5MB.',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: 'Tên trường không đúng. Sử dụng "image" làm tên trường.',
          });
        }
      }
      return res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Không có file hình ảnh nào được cung cấp. Vui lòng tải lên một hình ảnh.',
      });
    }

    // Return the file path relative to the project root
    const filePath = `/uploads/images/${req.file.filename}`;

    res.status(httpStatus.OK).json({
      status: 'success',
      message: 'Tải lên hình ảnh thành công',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: filePath,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  });
});

const uploadMultipleImages = catchAsync(async (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: 'Kích thước file quá lớn. Kích thước tối đa là 5MB mỗi file.',
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: 'Quá nhiều file. Tối đa 10 file được phép.',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: 'Tên trường không đúng. Sử dụng "images" làm tên trường.',
          });
        }
      }
      return res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Không có file hình ảnh nào được cung cấp. Vui lòng tải lên ít nhất một hình ảnh.',
      });
    }

    // Return the file paths relative to the project root
    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/images/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.status(httpStatus.OK).json({
      status: 'success',
      message: `Tải lên thành công ${req.files.length} hình ảnh`,
      data: {
        files: uploadedFiles,
        count: req.files.length,
      },
    });
  });
});

const deleteImage = catchAsync(async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tên file là bắt buộc');
  }

  const filePath = path.join(__dirname, '../../uploads/images', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hình ảnh');
  }

  // Delete the file
  fs.unlinkSync(filePath);

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Xóa hình ảnh thành công',
  });
});

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};
