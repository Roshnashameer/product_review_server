const express = require('express')

const router = new express.Router()
const user=require("../controller/userControler")

const {createUser, loginUser}=require("../middlewares/validationMiddleware")
const { getProduct, getAllProducts, rateProduct } = require('../controller/pdtControler')
const { getComments, addComment, addReply, deleteComment, deleteReply,  likeReply, likeComment } = require('../controller/commentController');
const { jwtMiddleware } = require('../middlewares/jwtMiddleware')

// User creation
router.post('/signup',createUser,user.signUp)
// login
router.post('/signin',loginUser,user.login)
// View Products
router.get('/products', getAllProducts);
// View products by ID
router.get('/products/:id', getProduct);
// view Comments
router.get('/products/:productId/getcomments', getComments);
// Add comments
router.post('/products/addcomments/:productId',jwtMiddleware ,addComment);
// Add reply to comments
router.post('/comments/:commentId',jwtMiddleware, addReply);
// Rate Product
router.post('/:id/rate', jwtMiddleware,rateProduct);
// Delete Comment
router.delete('/comments/:commentId',jwtMiddleware, deleteComment);
// Delete reply comment
router.delete('/comments/:commentId/replies/:replyId',jwtMiddleware,deleteReply);
// like comment
// router.post('/comments/:commentId/like',jwtMiddleware, likeComment);
// like reply
// router.post('/comments/:commentId/replies/:replyId/like',jwtMiddleware, likeReply);


module.exports=router