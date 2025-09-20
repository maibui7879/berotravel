import express from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Thông báo
 *   description: API quản lý thông báo (lấy danh sách và đánh dấu đã đọc)
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lấy danh sách thông báo của người dùng đã đăng nhập
 *     tags: [Thông báo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                     description: Nội dung thông báo
 *                   read:
 *                     type: boolean
 *                     description: Trạng thái đã đọc
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Lỗi server
 */
router.get("/", protect, getNotifications);

/**
 * @swagger
 * /notifications/{notification_id}:
 *   put:
 *     summary: Đánh dấu một thông báo là đã đọc
 *     tags: [Thông báo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         description: ID của thông báo cần đánh dấu đã đọc
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông báo đã được đánh dấu là đã đọc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 message:
 *                   type: string
 *                 read:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       404:
 *         description: Không tìm thấy thông báo
 *       500:
 *         description: Lỗi server
 */
router.put("/:notification_id", protect, markNotificationAsRead);

export default router;
