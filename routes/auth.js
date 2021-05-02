const { Router } = require('express');
const authController = require('../controllers/authControllers');
const router = Router();
const auth = require('../middlewares/auth');
const schemas = require('../middlewares/schemas');

// https://dev.to/itnext/joi-awesome-code-validation-for-node-js-and-express-35pk

router.post('/register', validator(schemas.signUpSchema), authController.signup);
router.post('/login', validator(schemas.sigInSchema), authController.login);
router.get('/user', auth, authController.get_user);

module.exports = router;
