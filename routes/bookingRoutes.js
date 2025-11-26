import express from "express";
import {
  getBookingsByUser,
  createBooking,
  updateBookingById,
  updateConfirmStatus,
  updatePaymentStatus,
  deleteBookingById, // import hàm delete mới
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: API quản lý đặt chỗ
 */

/**
 * @swagger
 * /api/bookings/user/{userId}:
 *   get:
 *     summary: Lấy danh sách booking theo userId
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/user/:userId", protect, getBookingsByUser);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Tạo booking mới
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - place
 *               - numberOfPeople
 *               - bookingDateTime
 *               - checkoutDateTime
 *             properties:
 *               place:
 *                 type: string
 *               numberOfPeople:
 *                 type: integer
 *               bookingDateTime:
 *                 type: string
 *                 format: date-time
 *               checkoutDateTime:
 *                 type: string
 *                 format: date-time
 *             description: "user sẽ tự động lấy từ token, totalPrice do backend tính"
 *     responses:
 *       201:
 *         description: Tạo booking thành công
 *       400:
 *         description: Thiếu dữ liệu hoặc thời gian không hợp lệ
 *       404:
 *         description: Không tìm thấy place hoặc placeStatus
 *       500:
 *         description: Lỗi server
 */
router.post("/", protect, createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Cập nhật booking theo ID
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               place:
 *                 type: string
 *               numberOfPeople:
 *                 type: integer
 *               bookingDateTime:
 *                 type: string
 *                 format: date-time
 *               checkoutDateTime:
 *                 type: string
 *                 format: date-time
 *             description: "Nếu thay đổi place hoặc thời gian, totalPrice sẽ được backend tự tính lại"
 *     responses:
 *       200:
 *         description: Cập nhật booking thành công
 *       400:
 *         description: Thời gian không hợp lệ
 *       403:
 *         description: Không có quyền cập nhật
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", protect, updateBookingById);

/**
 * @swagger
 * /api/bookings/{id}/confirm:
 *   patch:
 *     summary: Xác nhận booking (isConfirmed = true) - admin
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking
 *     responses:
 *       200:
 *         description: Booking được xác nhận
 *       403:
 *         description: Không có quyền admin
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id/confirm", protect, updateConfirmStatus);

/**
 * @swagger
 * /api/bookings/{id}/pay:
 *   patch:
 *     summary: Cập nhật trạng thái thanh toán booking (isPaid = true) - admin
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking
 *     responses:
 *       200:
 *         description: Booking đã thanh toán
 *       403:
 *         description: Không có quyền admin
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id/pay", protect, updatePaymentStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Xóa booking theo ID
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking
 *     responses:
 *       200:
 *         description: Booking đã bị xóa và notification gửi cho user
 *       403:
 *         description: Không có quyền xóa
 *       404:
 *         description: Không tìm thấy booking
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", protect, deleteBookingById);

export default router;
