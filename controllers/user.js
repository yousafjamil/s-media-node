const User = require('../models/user.model');
const Post = require('../models/post.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(200).json({
            success: false,
            message: "user already exist"
        })
    }
    const hashpass = await bcrypt.hashSync(req.body.password, 10)
    const createduser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashpass,
        avatar: {
            public_id: 'some id ',
            url: 'hereis irl'
        }
    });
    let token = jwt.sign({ id: createduser.id }, 'some secret here')

    res.cookie('access_token', token, { httpOnly: true }).status(200).json({
        success: true,
        message: "user successfully registered",
        createduser,

    })
}


// login user 
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    try {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user does not exist"
            })
        }
        let matchpass = await bcrypt.compare(password, user.password);
        if (!matchpass) {
            return res.status(404).json({
                success: false,
                message: "invalid password"
            })
        } else {
            let token = jwt.sign({ id: user.id }, 'some secret here')

            return res.cookie('access_token', token, { httpOnly: true }).status(200).json({
                success: true,
                message: "user successfully Login",

            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// get all post  which user to  follow
const getAllfollowingPosts = async (req, res) => {
    try {
        // const followingposts=await User.findById(req.user.id).populate('following','posts');
        const user = await User.findById(req.user.id);
        const follwoingposts = await Post.find({
            owner: {
                $in: user.following
            }
        })
        return res.status(404).json({
            success: true,
            message: "user which you follwoing's posts ",
            follwoingposts
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// update user  profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const { email, name } = req.body;
        // if(!name || !email){
        //     return res.status(400).json({
        //         success:false,
        //         message:"name and email field not should be empty"
        //     })
        // }
        if (email) {
            user.email = email;
        }
        if (name) {
            user.name = name;
        }
        await user.save();

        return res.status(200).json({
            success: true,
            message: "profile updated"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// user  to  follow 

const userToFollowAndUnfollow = async (req, res) => {
    try {
        let userTofollow = await User.findById(req.params.id);
        let loginedUser = await User.findById(req.user.id);

        if (!userTofollow) {
            return res.status(404).json({
                success: true,
                message: "no user to  found to  follow"
            })
        }

        if (loginedUser.following.includes(userTofollow.id)) {

            let followingIndex = loginedUser.following.indexOf(userTofollow.id);
            let followersIndex = userTofollow.followers.indexOf(loginedUser.id);

            loginedUser.following.splice(followingIndex, 1)
            userTofollow.followers.splice(followersIndex, 1)

            await loginedUser.save();
            await userTofollow.save();

            res.status(200).json({
                success: true,
                message: 'user succfully Unfollowing'
            })

        } else {
            userTofollow.followers.push(loginedUser.id);
            loginedUser.following.push(userTofollow.id);

            await userTofollow.save();
            await loginedUser.save();

            return res.status(200).json({
                success: true,
                message: 'user succfully follows'
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// get  all  registered user
const getalluser = async (req, res) => {
    try {
        let alluser = await User.find({}).select('-password');
        return res.status(200).json({
            success: true,
            message: "all registred users",
            user: alluser
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// update password///////////////
const updatePassword = async (req, res) => {

    const user = await User.findById(req.user.id);
    const { oldpassword, newpassword } = req.body;

    try {

        if (!oldpassword || !oldpassword) {
            return res.status(400).json({
                success: false,
                message: 'please enter new password and old password'
            })
        }
        let matchpass = await bcrypt.compare(oldpassword, user.password);
        // console.log(matchpass)
        // user.password != oldpassword
        if (user.password != oldpassword) {

            return res.status(400).json({
                success: false,
                message: 'In correct password'
            })
        } else {
            user.password = newpassword;
            //    await bcrypt.hash(newpassword,10)
            await user.save();
            return res.status(200).json({
                success: false,
                message: 'Your password successfully updated.'
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }


}
// delete user profile
const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const posts = user.posts
        if (!user) {
            res.status(400).json({
                success: false,
                message: "user not exist"
            })
        } 
        await user.remove()
        res.cookie('access_token', null, { maxAge: 1 })
        for (let i = 0; i < posts.length; i++) {
            let post = await Post.findById(posts[i]);
            post.remove()
        }


        res.json({
            message: "user succesfully deleted"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// my profile and see my posted post
const myProfile=async(req,res)=>{
    try {
        const mypost=await User.findById(req.user.id).populate('posts');
        res.status(200).json({
            success:true,
            message:"all posts",
            mypost
        })

        
    } catch (error) {
        res.status(500).json({  
            success: false,
            message: error.message
        })
    }
}
// /////////////LOG OUt user/////////////
const logOut = async (req, res) => {
    res.cookie('access_token', null).status(200).json({
        success: true,
        message: 'user successfully log Out'
    })
}
module.exports = {
    registerUser,
    loginUser,
    getalluser,
    updatePassword,
    updateProfile,
    myProfile,
    // deleteUser,
    logOut,
    deleteProfile,
    getAllfollowingPosts,
    userToFollowAndUnfollow
}