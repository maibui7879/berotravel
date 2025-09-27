import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllLogs,
  getLogById,
  deleteAllLogs,
  deleteLogById
} from "../controllers/adminLogController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminLogs
 *   description: Quản lý Admin Logs (chỉ admin mới truy cập được)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64d2f7c8a5e4c9b8f6c12345
 *         action:
 *           type: string
 *           example: Deleted user account
 *         details:
 *           type: string
 *           example: Admin đã xóa tài khoản user có email test@example.com
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 64d2f7c8a5e4c9b8f6c98765
 *             name:
 *               type: string
 *               example: Nguyễn Văn A
 *             email:
 *               type: string
 *               example: admin@example.com
 *             avatar_url:
 *               type: string
 *               example: https://example.com/avatar.jpg
 *             role:
 *               type: string
 *               example: admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-23T14:25:43.511Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-23T14:25:43.511Z
 */

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Lấy tất cả logs
 *     description: Trả về danh sách toàn bộ Admin Logs, sắp xếp theo ngày tạo mới nhất. Chỉ admin có quyền truy cập.
 *     tags: [AdminLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminLog'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/", protect, isAdmin, getAllLogs);

/**
 * @swagger
 * /api/admin/logs/{id}:
 *   get:
 *     summary: Lấy log theo ID
 *     description: Trả về chi tiết log theo ID. Chỉ admin có quyền truy cập.
 *     tags: [AdminLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của log
 *     responses:
 *       200:
 *         description: Chi tiết log
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLog'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Log không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", protect, isAdmin, getLogById);

/**
 * @swagger
 * /api/admin/logs:
 *   delete:
 *     summary: Xóa toàn bộ logs
 *     description: Xóa tất cả Admin Logs. Chỉ admin có quyền thực hiện.
 *     tags: [AdminLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đã xóa tất cả logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All logs deleted
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.delete("/", protect, isAdmin, deleteAllLogs);

/**
 * @swagger
 * /api/admin/logs/{id}:
 *   delete:
 *     summary: Xóa log theo ID
 *     description: Xóa một log theo ID. Chỉ admin có quyền thực hiện.
 *     tags: [AdminLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của log cần xóa
 *     responses:
 *       200:
 *         description: Đã xóa log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Log deleted
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Log không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", protect, isAdmin, deleteLogById);

export default router;
