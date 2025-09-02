import express from "express";
import { createVote, getVotes, deleteVote } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Votes
 *   description: API for voting on places or reviews
 */

/**
 * @swagger
 * /votes:
 *   post:
 *     summary: Create or update a vote for a target (place or review)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [target_id, target_type, vote_type]
 *             properties:
 *               target_id:
 *                 type: string
 *                 description: ID of the place or review
 *               target_type:
 *                 type: string
 *                 enum: [place, review]
 *                 description: Type of target
 *               vote_type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: Type of vote
 *             example:
 *               target_id: "64f9b3e2c8d1234567890abc"
 *               target_type: "review"
 *               vote_type: "upvote"
 *     responses:
 *       200:
 *         description: Vote created or updated successfully
 *       500:
 *         description: Server error
 */
router.post("/", protect, createVote);

/**
 * @swagger
 * /votes:
 *   get:
 *     summary: Get all votes for a target
 *     tags: [Votes]
 *     parameters:
 *       - in: query
 *         name: target_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place or review
 *       - in: query
 *         name: target_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [place, review]
 *         description: Type of target
 *     responses:
 *       200:
 *         description: List of votes for the target
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
 *                     type: string
 *                   target_id:
 *                     type: string
 *                   target_type:
 *                     type: string
 *                   vote_type:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/", getVotes);

/**
 * @swagger
 * /votes/{id}:
 *   delete:
 *     summary: Delete a vote (only owner can delete)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vote ID
 *     responses:
 *       200:
 *         description: Vote deleted successfully
 *       404:
 *         description: Vote not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteVote);

export default router;
