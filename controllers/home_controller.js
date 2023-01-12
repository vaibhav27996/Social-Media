const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');
//const { forEach } = require('lodash');


module.exports.home = async function(req, res){

    try{
         // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user','name')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            },
        }).populate('likes') ;
    
        let users = await User.find({});
       
        let userListArr=[];

        let userList=await User.find({});

        for(userName of userList){
            userListArr[userName._id]=userName.name;
        }

        let friendship=await Friendship.find({}).populate('to_user');
       

        return res.render('home', {
            title: "Codeial | Home",
            post:  posts,
            all_users: users,
            friendship:friendship,
            userListArr:userListArr
            
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
