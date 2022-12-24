const Post = require('../models/post');
const Comment = require('../models/comment');
const User=require('../models/user');

// module.exports.home = function(req, res){
    
//     Post.find({})
//     .populate('user')
//     .populate({
//         path:'comment',
//         populate:{
//             path:'user'
//         }
//     })
//     .exec(function(err,post){
       
//         if(err){
//             console.log('error in fetching a posts');
//             return;
//         }

//         User.find({},function (err,user){
//             return res.render( 'home',{
//                 title:"Home",
//                 posts: post,
//                 user_list:user
//             });
            
//         });
       
//     });
// }

//async and await functions

module.exports.home =async function(req, res){

    try{

        let post= await Post.find({})
        .populate('user')
        .populate({
            path:'comment',
            populate:{
                path:'user'
            }
        });


        let user= await User.find({});

        return res.render( 'home',{
            title:"Home",
            posts: post,
            user_list:user
        });

    }catch(err){
        console.log('Error',err);
    }
    
}



