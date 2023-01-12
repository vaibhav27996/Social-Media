const User = require('../models/user');
const Otp = require('../models/otp');
const fs = require('fs');
const path = require('path');
const Friendship=require('../models/friendship');

const commentsMailer = require('../mailers/otps_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/otp_email_workers');
// const { findOne } = require('../models/user');

// let's keep it same as before
module.exports.profile =async function(req, res){

    let users = await User.findById(req.params.id);
    
   
    let friendship=await Friendship.findOne({ from_user: req.user.id , to_user:req.params.id});
    
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user,
            friendship:friendship,
            
        });
    });

}



module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

//add a friendship to login user

module.exports.add_friend= async function(req,res){
   
    if(req.params.id){

        try{

            let user = await User.findById(req.user.id);
            let addFreind=await Friendship.create({
                from_user:req.user.id,
                to_user:req.params.id
            });

            user.friendship.push(addFreind);
            user.save();

            return res.status(200).json({
                data: {
                    user:user
                },
                message: "Added Friendship to user!"
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.remove_friend=async function(req,res){
    if(req.params.id){
       
        let friendship=await Friendship.findById(req.params.id);

        let friendshipId=friendship.from_user;
       
        friendship.remove();

        let deleteFriendFromUser = await User.findByIdAndUpdate(friendshipId, { $pull: {friendship: req.params.id}});

        // send the comment id which was deleted back to the views
        if (req.xhr){
            return res.status(200).json({
                data: {
                    friendship_id: req.params.id
                },
                message: "Friend request cancelled"
            });
        }


        req.flash('success', 'Friend request deleted!');

        return res.redirect('back');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}


//action which is related to forget password

module.exports.sendOtp=function (req,res){
    return res.render('send_otp', {
        title: "Send Otp"
    })
}

module.exports.forgotPassword = function(req, res){
    return res.render('forgot_password', {
        title: "Reset Password"
    })
}

module.exports.sendOtpToMail=async function(req,res){
    let user=await User.findOne({email:req.body.email});
    var randomcode = Math.floor(100000 + Math.random() * 900000);   
    randomcode = String(randomcode);
    randomcode = randomcode.substring(0,4);

    if(user){
        
        let generateOtp = await Otp.create({
            email:req.body.email,
            code:randomcode,
            expireTime:new Date().getTime()+300*1000
        });

     
        let job = queue.create('emails', generateOtp).save(function(err){
            if (err){
                console.log('Error in sending to the queue', err);
                return;
            }
            console.log('job enqueued', job.id);

        });

        req.flash('success','Otp Send ! Please check your email');
        return res.redirect('/users/forgot-password');
    }else{
        req.flash('error','You are not authorized to reset the password! Please sign up first');
        return res.redirect('/users/sign-up');
    }
}


module.exports.setPasswordIntoDB=async function(req,res){
   
    let findCode=await Otp.findOne({code:req.body.code});
    let userDetails =await User.findOne({email:findCode.email});

  

    if(findCode){
        let currentTime=new Date().getTime();
        let expireTime=findCode.expireTime;

        let diff=expireTime-currentTime;

        if(diff>0 && req.body.password==req.body.reset_password) {

            userDetails.password=req.body.password;
            userDetails.save();

            req.flash('success','password Changed Successfully');
            return res.redirect('/users/sign-in');
           
        }else{
            req.flash('error','Token/Code expire');
            return res.redirect('/users/sign-in');
        }


    }else{
        req.flash('error','Invalid Otp');
        return res.redirect('/users/sign-in');
    }
    
    
}


// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Logged out Successfully');
        res.redirect('/');
    });
}