import express from 'express';
import {
  getPlaceStatusById,
  getPlaceStatusByPlaceId,
  createPlaceStatus,
  updatePlaceStatusById,
  updatePlaceStatusByPlaceId,
  deletePlaceStatusById,
  deletePlaceStatusByPlaceId
} from '../controllers/placeStatusController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PlaceStatus
 *   description: API for managing place status
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PlaceStatus:
 *       type: object
 *       required:
 *         - place_id
 *         - initial_status
 *       properties:
 *         place_id:
 *           type: string
 *           description: The ID of the place.
 *         initial_status:
 *           type: string
 *           enum: [open, closed]
 *           description: Initial status of the place.
 *         opening_time:
 *           type: string
 *           description: Opening time (optional)
 *         closing_time:
 *           type: string
 *           description: Closing time (optional)
 *         available_status:
 *           type: string
 *           enum: [available, unavailable]
 *           description: Hotel availability (only for hotels)
 *         available_rooms:
 *           type: number
 *           description: Number of available rooms (only for hotels)
 *         price:
 *           type: number
 *           description: Price of hotel rooms (only for hotels)
 *         contact:
 *           type: string
 *           description: Contact info for hotel (only for hotels)
 */

/**
 * @swagger
 * /api/place-status/place/{placeId}:
 *   get:
 *     summary: Get place status by place ID
 *     tags: [PlaceStatus]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place
 *     responses:
 *       200:
 *         description: Place status found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaceStatus'
 *       404:
 *         description: Place status not found
 */
router.get('/place/:placeId', getPlaceStatusByPlaceId);

/**
 * @swagger
 * /api/place-status/{id}:
 *   get:
 *     summary: Get place status by status ID
 *     tags: [PlaceStatus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place status
 *     responses:
 *       200:
 *         description: Place status found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaceStatus'
 *       404:
 *         description: Place status not found
 */
router.get('/:id', getPlaceStatusById);

/**
 * @swagger
 * /api/place-status:
 *   post:
 *     summary: Create a new place status
 *     tags: [PlaceStatus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaceStatus'
 *     responses:
 *       201:
 *         description: Place status created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaceStatus'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Place not found
 */
router.post('/', protect, createPlaceStatus);

/**
 * @swagger
 * /api/place-status/{id}:
 *   put:
 *     summary: Update a place status by ID
 *     tags: [PlaceStatus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaceStatus'
 *     responses:
 *       200:
 *         description: Place status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaceStatus'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Place status not found
 *   delete:
 *     summary: Delete a place status by ID
 *     tags: [PlaceStatus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place status
 *     responses:
 *       200:
 *         description: Place status deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Place status not found
 */
router.put('/:id', protect, updatePlaceStatusById);
router.delete('/:id', protect, deletePlaceStatusById);

/**
 * @swagger
 * /api/place-status/place/{placeId}:
 *   put:
 *     summary: Update a place status by place ID
 *     tags: [PlaceStatus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaceStatus'
 *     responses:
 *       200:
 *         description: Place status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaceStatus'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Place status not found
 *   delete:
 *     summary: Delete a place status by place ID
 *     tags: [PlaceStatus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place
 *     responses:
 *       200:
 *         description: Place status deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Place status not found
 */
router.put('/place/:placeId', protect, updatePlaceStatusByPlaceId);
router.delete('/place/:placeId', protect, deletePlaceStatusByPlaceId);

export default router;
