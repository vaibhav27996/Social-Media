const Post = require('../models/post');


module.exports.home = function(req, res){
    // Post.find({},function(err,post){
    //     if(err){
    //         console.log('error in fetching a posts');
    //         return;
    //     }

    //     return res.render( 'home',{
    //         title:"Home",
    //        posts: post,
    //     });
        
    // });

    Post.find({}).populate('user').exec(function(err,post){
        if(err){
            console.log('error in fetching a posts');
            return;
        }

        return res.render( 'home',{
            title:"Home",
           posts: post,
        });
        
    });
}

