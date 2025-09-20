import express from "express";
import { getMyStats, getUserStatsById } from "../controllers/userStatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserStats
 *   description: API quản lý thống kê user
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Lấy thống kê bản thân
 *     tags: [UserStats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê user bản thân
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *                 edited_places:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     places:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           place_id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           updated_at:
 *                             type: string
 *                 reviews_created:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           review_id:
 *                             type: string
 *                           place_id:
 *                             type: string
 *                           rating:
 *                             type: number
 *                           comment:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                 votes_created:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     votes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           vote_id:
 *                             type: string
 *                           target_id:
 *                             type: string
 *                           target_type:
 *                             type: string
 *                           vote_type:
 *                             type: string
 *                           created_at:
 *                             type: string
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi server
 */
router.get("/", protect, getMyStats);

/**
 * @swagger
 * /stats/{userId}:
 *   get:
 *     summary: Lấy thống kê của user khác theo ID
 *     tags: [UserStats]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của user cần lấy thống kê
 *     responses:
 *       200:
 *         description: Thống kê user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *                 edited_places:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     places:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           place_id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           updated_at:
 *                             type: string
 *                 reviews_created:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           review_id:
 *                             type: string
 *                           place_id:
 *                             type: string
 *                           rating:
 *                             type: number
 *                           comment:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                 votes_created:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     votes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           vote_id:
 *                             type: string
 *                           target_id:
 *                             type: string
 *                           target_type:
 *                             type: string
 *                           vote_type:
 *                             type: string
 *                           created_at:
 *                             type: string
 *       404:
 *         description: User stats not found
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", getUserStatsById);

export default router;
