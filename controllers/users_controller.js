const User = require('../models/user');

module.exports.profile =async function(req, res){

    try{
        let users= await User.findById(req.params.id);

        return res.render('user_profile', {
            title: 'User Profile',
            user_info:users
        });

    }catch(err){
        console.log('Error',err);
    }
}


module.exports.update =async function(req, res){

    try{
        if(req.user.id==req.params.id){
        
            await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('/');
            
        }else{
            return res.status(401).send('Unauthorized');
        }

    }catch(err){
        console.log("error in update the users info",err);
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

// get the sign up data
module.exports.create =async function(req, res){

    try{
        if (req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }
    
        let user=await User.findOne({email: req.body.email});
    
        if (!user){
            await User.create(req.body);
            return res.redirect('/users/sign-in');
            
        }else{
            return res.redirect('back');
        }

    }catch(err){
        console.log("Error in adding sign up data into db");
    }
    
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
       
        res.redirect('/');
    }); 
}