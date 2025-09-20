import express from "express";
import { toggleFavorite, getUserFavorites } from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Yêu thích
 *   description: API quản lý danh sách địa điểm yêu thích của người dùng
 */

/**
 * @swagger
 * /favorites/{placeId}:
 *   post:
 *     summary: Thêm hoặc bỏ một địa điểm khỏi danh sách yêu thích của người dùng
 *     tags: [Yêu thích]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm cần thêm/bỏ yêu thích
 *     responses:
 *       200:
 *         description: Thao tác yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả thao tác
 *                 favorite_count:
 *                   type: number
 *                   description: Số lượng người yêu thích hiện tại của địa điểm
 *       404:
 *         description: Không tìm thấy địa điểm
 *       500:
 *         description: Lỗi server
 */
router.post("/:placeId", protect, toggleFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Lấy danh sách tất cả địa điểm yêu thích của người dùng đã xác thực
 *     tags: [Yêu thích]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách các địa điểm yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.get("/", protect, getUserFavorites);

export default router;
