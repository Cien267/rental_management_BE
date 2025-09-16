const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { roomService } = require('../services');

const createRoom = catchAsync(async (req, res) => {
  const room = await roomService.createRoom(req.body);
  res.status(httpStatus.CREATED).send(room);
});

const getRooms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['propertyId', 'name', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roomService.queryRooms(filter, options);
  res.send(result);
});

const getRoom = catchAsync(async (req, res) => {
  const room = await roomService.getRoomById(req.params.roomId);
  if (!room) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy phòng' });
  }
  if (req.params.propertyId && Number(room.propertyId) !== Number(req.params.propertyId)) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy phòng trong tài sản này' });
  }
  res.send(room);
});

const updateRoom = catchAsync(async (req, res) => {
  if (req.params.propertyId) {
    const existing = await roomService.getRoomById(req.params.roomId);
    if (!existing || Number(existing.propertyId) !== Number(req.params.propertyId)) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy phòng trong tài sản này' });
    }
  }
  const room = await roomService.updateRoomById(req.params.roomId, req.body);
  res.send(room);
});

const deleteRoom = catchAsync(async (req, res) => {
  if (req.params.propertyId) {
    const existing = await roomService.getRoomById(req.params.roomId);
    if (!existing || Number(existing.propertyId) !== Number(req.params.propertyId)) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Không tìm thấy phòng trong tài sản này' });
    }
  }
  await roomService.deleteRoomById(req.params.roomId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
};
