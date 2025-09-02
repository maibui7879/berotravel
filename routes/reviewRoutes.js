import express from "express";
import { 
  getReviews, 
  createReview, 
  updateReview, 
  deleteReview, 
  getInitialRatingByPlace 
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing reviews of places
 */

/**
 * @swagger
 * /reviews/{placeId}:
 *   get:
 *     summary: Get all reviews of a place
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place
 *     responses:
 *       200:
 *         description: List of reviews
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
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/:placeId", getReviews);

/**
 * @swagger
 * /reviews/{placeId}/rating:
 *   get:
 *     summary: Get average rating and vote distribution of a place
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place
 *     responses:
 *       200:
 *         description: Average rating and distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: number
 *                 totalVotes:
 *                   type: number
 *                 distribution:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Server error
 */
router.get("/:placeId/rating", getInitialRatingByPlace);

/**
 * @swagger
 * /reviews/{placeId}:
 *   post:
 *     summary: Create a new review for a place
 *     tags: [Reviews]
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
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Optional comment
 *     responses:
 *       200:
 *         description: Created review object
 *       500:
 *         description: Server error
 */
router.post("/:placeId", protect, createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review (only the owner can update)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
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
 *         description: Updated review object
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review (only the owner can delete)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteReview);

export default router;
