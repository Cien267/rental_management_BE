const { GoogleGenAI } = require('@google/genai');
const multer = require('multer');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const ai = new GoogleGenAI({});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadSingle = upload.single('image');

const extractNumber = catchAsync(async (req, res) => {
  await uploadSingle(req, res, async (err) => {
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

    const base64 = req.file.buffer.toString('base64');

    const contents = [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64,
        },
      },
      {
        text: 'You are an OCR system. Extract the official meter reading number from this utility meter image (water/electric). Focus ONLY on the main billing reading. Ignore all other numbers in the image (serials, labels, stickers, handwriting, small sub-dials, etc.). The image may be rotated in any direction — rotate mentally and read correctly. Remove leading zeros.',
      },
    ];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
      });
      return res.send(response.text);
    } catch (e) {
      res.status(httpStatus.BAD_REQUEST).send({ message: 'Có lỗi xảy ra với AI!', e });
    }
  });
});

module.exports = {
  extractNumber,
};
