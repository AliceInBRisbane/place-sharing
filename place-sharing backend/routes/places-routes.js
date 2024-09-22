const express =require('express');
const fileUpload = require('../middleware/file-upload')
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth')
const PlaceController = require('../controllers/places-controller')

const router = express.Router();



router.get('/:pid',PlaceController.getPlaceById)

router.get('/user/:uid',PlaceController.getPlacesbyUserId)

router.use(checkAuth);

router.post(
    '/',
    fileUpload.single('image'),
    [
    check('title')
     .not()
     .isEmpty(),
    check('description').isLength({min:5}),
    check('address')
    .not()
    .isEmpty()
],
    PlaceController.createPlace)

router.patch('/:pid',
[
    check('title')
     .not()
     .isEmpty(),
    check('description').isLength({min:5})  

],
PlaceController.updatePlace)

router.delete('/:pid',PlaceController.deletePlace)

module.exports = router;
