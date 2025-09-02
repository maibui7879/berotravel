import express from "express";
import { getReplies, createReply, updateReply, deleteReply } from "../controllers/replyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Replies
 *   description: API for managing replies to reviews
 */

/**
 * @swagger
 * /replies/{reviewId}:
 *   get:
 *     summary: Get all replies for a review
 *     tags: [Replies]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: List of replies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user_id:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       avatar_url:
 *                         type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/:reviewId", getReplies);

/**
 * @swagger
 * /replies/{reviewId}:
 *   post:
 *     summary: Create a reply to a review
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 description: Reply content
 *             example:
 *               content: "Thanks for your review!"
 *     responses:
 *       200:
 *         description: Created reply object
 *       500:
 *         description: Server error
 */
router.post("/:reviewId", protect, createReply);

/**
 * @swagger
 * /replies/{id}:
 *   put:
 *     summary: Update a reply (only the owner can update)
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reply ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated reply object
 *       404:
 *         description: Reply not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateReply);

/**
 * @swagger
 * /replies/{id}:
 *   delete:
 *     summary: Delete a reply (only the owner can delete)
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reply ID
 *     responses:
 *       200:
 *         description: Reply deleted successfully
 *       404:
 *         description: Reply not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteReply);

export default router;
