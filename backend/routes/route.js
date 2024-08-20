const router = require('express').Router();;
const {addToFav,addToDis,getFromFav} = require('../controllers/userController');
const {signup,login, checkAuth} = require('../controllers/authController');
const {getUsers} = require('../controllers/userController');
const {verifyToken} = require('../middlewares/verifyToken');
//Authenticating the user

//signup route
 router.post('/signup',signup);
//login route
router.post('/login',login);
//checkauth route
router.get('/checkAuth',verifyToken,checkAuth);


//User routes
router.get('/getUsers',getUsers);
router.put('/addToFav/:id',verifyToken,addToFav);
router.put('/addToDis/:id',verifyToken,addToDis);
router.get('/getFromFav',verifyToken,getFromFav);


module.exports = router;