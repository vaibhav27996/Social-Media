const User = require('../models/user');
const Post  = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.toggleLike=async function(req,res){
    try{
        let likeable;
        let deleted=false;
       
        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes');
        }else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

       

        //check if likes already exit
        let existingLike=await Like.findOne({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type

        });
        


        //if likes already exit the delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted=true;

        }else{
            //make a new Like
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.json(200,{
            message:'Request SuccessFul',
            data:{
                deleted:deleted
            }
        });
    }catch(err){
        console.log(err);
        return res.json(500, {
            message:'Interal Server Error'
        });
    }
}