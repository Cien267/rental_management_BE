const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const roomValidation = require('../../validations/room.validation');
const roomController = require('../../controllers/room.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageRooms'), validate(roomValidation.createRoom), roomController.createRoom)
  .get(auth('getRooms'), validate(roomValidation.getRooms), roomController.getRooms);

router
  .route('/:roomId')
  .get(auth('getRooms'), validate(roomValidation.getRoom), roomController.getRoom)
  .patch(auth('manageRooms'), validate(roomValidation.updateRoom), roomController.updateRoom)
  .delete(auth('manageRooms'), validate(roomValidation.deleteRoom), roomController.deleteRoom);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */
/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List rooms
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 */
/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     summary: Get a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: No Content }
 */
