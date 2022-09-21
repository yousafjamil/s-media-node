const { registerUser, loginUser,getalluser, userToFollowAndUnfollow, getAllfollowingPosts, logOut, updatePassword, updateProfile, deleteProfile, myProfile, } = require('../controllers/user');
const auth = require('../middleware/auth');

const router=require('express').Router();

router.post('/register',registerUser)

router.post('/login',loginUser)

router.get('/alluser',auth,getalluser)

router.put('/updatepassword',auth,updatePassword)

router.put('/updateprofile',auth,updateProfile)

router.delete('/deleteprofile',auth,deleteProfile)

router.get('/myprofile',auth,myProfile)

// router.delete('/deleteuser',auth,deleteUser)

router.get('/logout',logOut)

router.get('/followingposts',auth,getAllfollowingPosts)

router.get('/usertofollow/:id',auth,userToFollowAndUnfollow)


module.exports=router;