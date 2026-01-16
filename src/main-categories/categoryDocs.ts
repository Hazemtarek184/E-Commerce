/**
 * @swagger
 * components:
 *   schemas:
 *     MainCategory:
 *       type: object
 *       required:
 *         - englishName
 *         - arabicName
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the category
 *         englishName:
 *           type: string
 *           description: The name of the category in English
 *         arabicName:
 *           type: string
 *           description: The name of the category in Arabic
 *         subCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: List of sub-category IDs
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The categories managing API
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Returns the list of all main categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: The list of the categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The auto-generated id of the category
 *                       englishName:
 *                         type: string
 *                       arabicName:
 *                         type: string
 *   post:
 *     summary: Create a new main category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - englishName
 *               - arabicName
 *             properties:
 *               englishName:
 *                 type: string
 *               arabicName:
 *                 type: string
 *     responses:
 *       201:
 *         description: The category was created
 *       400:
 *         description: Missing parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Update a main category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               englishName:
 *                 type: string
 *               arabicName:
 *                 type: string
 *     responses:
 *       200:
 *         description: The category was updated
 *       404:
 *         description: The category was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Delete a main category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category id
 *     responses:
 *       200:
 *         description: The category was deleted
 *       404:
 *         description: The category was not found
 */
