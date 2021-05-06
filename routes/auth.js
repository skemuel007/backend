const { Router } = require('express');
const authController = require('../controllers/authControllers');
const router = Router();
const auth = require('../middlewares/auth');
const schemas = require('../middlewares/schemas');
const validator = require('../middlewares/validator');

// https://dev.to/itnext/joi-awesome-code-validation-for-node-js-and-express-35pk

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registers a user.
 *     description:  Registers a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: Leanne Graham
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: johndoe@somemail.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: P@_3883&&**
 *     responses:
 *       201:
 *         description: Registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: boolean
 *                       description: True or false.
 *                       example: true
 *                     message:
 *                       type: string
 *                       description: The response message.
 *                       example: User created
 *                     data:
 *                       type: object
 *                       description: Data returned, either an array or object.
 *                       example:
 */
router.post('/register', validator(schemas.signUpSchema), authController.signup);
router.post('/login', validator(schemas.sigInSchema), authController.login);
router.get('/user', auth, authController.get_user);

module.exports = router;
