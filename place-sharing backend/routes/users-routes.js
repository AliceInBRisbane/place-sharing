const express =require('express');
const {check} = require('express-validator')

const UsersController = require('../controllers/user-controller')

const router = express.Router();
const fileUpload = require('../middleware/file-upload')


router.get('/',UsersController.getUsers)


router.post(
    '/signup',
    fileUpload.single('image'),
    [
    check('username')
    .not()
    .isEmpty(),
    check('email').normalizeEmail()
    .isEmail(),
    check('password').isLength({min: 7 })
],
UsersController.signup)

router.post('/login',UsersController.login)

module.exports = router;
