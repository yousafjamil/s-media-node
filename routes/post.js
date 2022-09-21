const { createPost, postLikeAndDislike, deletePost, updatePost, addcommnent } = require('../controllers/post');
const auth = require('../middleware/auth');

const router=require('express').Router();

router.post('/createpost',auth,createPost)

router.delete('/deletepost/:id',auth,deletePost)

router.put('/updatepost/:id',auth,updatePost)

router.get('/postlikeandunlike/:id',auth,postLikeAndDislike)

router.get('/addcomment/:id',auth,addcommnent)

module.exports=router;