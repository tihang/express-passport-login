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
    Post.find({email : req.user.local.email}, (err, posts) => {
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
        email : req.user.local.email
    });
    
    newPost.save((err) => {
        if(err) return err;
        res.redirect('/profile');
    });
});

module.exports = router;