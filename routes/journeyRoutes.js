import express from 'express';
import {
  getMyJourneys,
  getJourneyById,
  createJourney,
  updateJourney,
  deleteJourney,
  updateJourneyStatus,
  markPlaceAsVisited
} from '../controllers/journeyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Journeys
 *   description: API quản lý journey của người dùng
 */

/**
 * @swagger
 * /api/journeys:
 *   get:
 *     summary: Lấy tất cả journey của tôi
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách journey thành công
 *       500:
 *         description: Lỗi server
 */
router.get('/', protect, getMyJourneys);

/**
 * @swagger
 * /api/journeys/{journeyId}:
 *   get:
 *     summary: Lấy thông tin một journey theo ID
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journey
 *     responses:
 *       200:
 *         description: Lấy journey thành công
 *       404:
 *         description: Không tìm thấy journey
 *       500:
 *         description: Lỗi server
 */
router.get('/:journeyId', protect, getJourneyById);

/**
 * @swagger
 * /api/journeys:
 *   post:
 *     summary: Tạo journey mới
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - places
 *             properties:
 *               places:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ID của các địa điểm
 *     responses:
 *       201:
 *         description: Tạo journey thành công
 *       500:
 *         description: Lỗi server
 */
router.post('/', protect, createJourney);

/**
 * @swagger
 * /api/journeys/{journeyId}:
 *   put:
 *     summary: Cập nhật journey (thêm/sửa danh sách địa điểm)
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - places
 *             properties:
 *               places:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ID của các địa điểm
 *     responses:
 *       200:
 *         description: Cập nhật journey thành công
 *       404:
 *         description: Không tìm thấy journey
 *       500:
 *         description: Lỗi server
 */
router.put('/:journeyId', protect, updateJourney);

/**
 * @swagger
 * /api/journeys/{journeyId}:
 *   delete:
 *     summary: Xóa journey
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journey
 *     responses:
 *       200:
 *         description: Xóa journey thành công
 *       404:
 *         description: Không tìm thấy journey
 *       500:
 *         description: Lỗi server
 */
router.delete('/:journeyId', protect, deleteJourney);

/**
 * @swagger
 * /api/journeys/{journeyId}/status:
 *   put:
 *     summary: Cập nhật trạng thái journey (ongoing hoặc suspended)
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ongoing, suspended]
 *                 description: Trạng thái mới của journey
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ hoặc journey đã hoàn thành
 *       404:
 *         description: Không tìm thấy journey
 *       500:
 *         description: Lỗi server
 */
router.put('/:journeyId/status', protect, updateJourneyStatus);

/**
 * @swagger
 * /api/journeys/{journeyId}/places/{placeId}/visit:
 *   post:
 *     summary: Đánh dấu một địa điểm đã đến trong journey
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của journey
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     responses:
 *       200:
 *         description: Đánh dấu thành công
 *       400:
 *         description: Journey không ở trạng thái ongoing
 *       404:
 *         description: Không tìm thấy journey hoặc địa điểm
 *       500:
 *         description: Lỗi server
 */
router.post('/:journeyId/places/:placeId/visit', protect, markPlaceAsVisited);

export default router;
