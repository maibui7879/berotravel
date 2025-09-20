import express from "express";
import { 
  getReviews, 
  createReview, 
  updateReview, 
  deleteReview, 
  getInitialRatingByPlace,
  getReviewsCount,
  getReviewSortByVote
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Đánh giá
 *   description: API quản lý đánh giá của địa điểm
 */
/**
 * @swagger
 * /reviews/count:
 *   get:
 *     summary: Lấy tổng số review hiện có
 *     tags: [Đánh giá]
 *     responses:
 *       200:
 *         description: Tổng số review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReviews:
 *                   type: integer
 *                   example: 42
 */

router.get("/count/", getReviewsCount);
/**
 * @swagger
 * /reviews/top:
 *   get:
 *     tags: [Đánh giá]
 *     summary: Lấy 3 review có vote cao nhất trên toàn hệ thống
 *     description: Trả về danh sách 3 review có tổng điểm vote (upvote - downvote) cao nhất.
 *     responses:
 *       200:
 *         description: Danh sách review thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID review
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *                   user_id:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avatar_url:
 *                         type: string
 *                   place_id:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   vote_score:
 *                     type: integer
 *                     description: Tổng điểm vote (upvote - downvote)
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/top", getReviewSortByVote);
/**
 * @swagger
 * /reviews/{placeId}:
 *   get:
 *     summary: Lấy tất cả đánh giá của một địa điểm
 *     tags: [Đánh giá]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 *       500:
 *         description: Lỗi server
 */
router.get("/:placeId", getReviews);

/**
 * @swagger
 * /reviews/{placeId}/rating:
 *   get:
 *     summary: Lấy đánh giá trung bình và phân phối vote của địa điểm
 *     tags: [Đánh giá]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     responses:
 *       200:
 *         description: Đánh giá trung bình và phân phối vote
 *       500:
 *         description: Lỗi server
 */
router.get("/:placeId/rating", getInitialRatingByPlace);

/**
 * @swagger
 * /reviews/{placeId}:
 *   post:
 *     summary: Tạo đánh giá mới cho một địa điểm
 *     tags: [Đánh giá]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 description: Điểm đánh giá từ 1 đến 5
 *               comment:
 *                 type: string
 *                 description: Nhận xét (tùy chọn)
 *     responses:
 *       200:
 *         description: Đánh giá mới đã được tạo
 *       500:
 *         description: Lỗi server
 */
router.post("/:placeId", protect, createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Cập nhật đánh giá (chỉ chủ sở hữu mới có thể cập nhật)
 *     tags: [Đánh giá]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đánh giá
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đánh giá đã được cập nhật
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", protect, updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Xóa đánh giá (chỉ chủ sở hữu mới có thể xóa)
 *     tags: [Đánh giá]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đánh giá
 *     responses:
 *       200:
 *         description: Đánh giá đã được xóa
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", protect, deleteReview);

export default router;
