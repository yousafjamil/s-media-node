const Post = require('../models/post.model');
const User = require('../models/user.model');
const createPost = async (req, res, next) => {
    try {

        const createdpost = await Post.create({
            caption: req.body.caption,
            img: {
                public_id: "some string here",
                url: "some url"
            },
            owner: req.user.id
        })
        const user = await User.findById(req.user.id);

        user.posts.push(createdpost.id)
        await user.save();
        return res.status(200).json({
            message: 'post successfully created',
            success: true,
            post: createdpost
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
// post  delete conroller
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                success: true,
                message: 'post not found'
            })
        }
        if (post.owner.toString() !== req.user.id.toString()) {
            return res.status(400).json({
                success: true,
                message: 'Un authorized user'
            })
        }

        await post.remove();

        const user = await User.findById(req.user.id);
        let index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        user.save();

        return res.status(200).json({
            success: true,
            message: "post  successfully deleted."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// post  like and dislike controller

const postLikeAndDislike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                success: true,
                message: 'post not found'
            })
        }

        if (post.likes.includes(req.user.id)) {

            let index = post.likes.indexOf(req.user.id);
            post.likes.splice(index, 1);
            await post.save();
            return res.status(400).json({
                success: true,
                message: 'post Unlike'
            })
        } else {

            post.likes.push(req.user.id);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "post liked"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// update post/////////////
const updatePost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "post not found"
            })
        }
        if (post.owner.toString() !== req.user.id.toString()) {
            res.status(400).json({
                success: false,
                message: "Un Authorized user"
            })
        } else {

            post.caption = req.body.caption;
            await post.save();
            res.status(200).json({
                success: true,
                message: "post successfully updated"
            })
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// add commnents on a post
const addcommnent = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "post  not found"
            })
        }
        let commentexist = false;
        post.comments.forEach((item) => {
            if (item.user.toString() === req.user.id.toString()) {
                commentexist = true
            }
        })
// if comment exist thrn  updated th comement 
        if (commentexist) {
            post.comments[1].comment = req.body.comment
            await post.save();
            res.status(200).json({
                success: true,
                message: "comment updated"
            })
        } else {
            post.comments.push({
                user: req.user.id,
                comment: req.body.comment
            })
            await post.save();
            return res.status(200).json({
                success: true,
                message: "comments added on post"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }



}

module.exports = {
    createPost,
    deletePost,
    updatePost,
    postLikeAndDislike,
    addcommnent

}