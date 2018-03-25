var router = require('express').Router();
var Post = require('../models/Posts');

//authcheck middleware
var authcheck = (req, res, next)=>{
    if(!req.user){
        res.redirect('/auth/login');
    }else{
        next();
    }
}

router.get('/', authcheck, (req, res)=>{
    Post.find({userID : req.user._id}, (err, posts) => {
        if(err) throw err;
        else{
            res.render('profile', {
                user : req.user,
                posts : posts
            });
        }
    });
});

router.post('/', authcheck, (req, res)=>{
    var newPost = new Post({
        title : req.body.title,
        description : req.body.description,
        userID : req.user._id
    });
    
    newPost.save((err) => {
        if(err) return err;
        res.redirect('/profile');
    });
});

router.post('/deletepost', authcheck, (req, res)=>{
    Post.findByIdAndRemove(req.body._id, (err, post) => {
        if(err) throw err;
        else{
            res.redirect('/profile');
        }
    });
});

module.exports = router;