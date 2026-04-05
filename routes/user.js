const express=require("express");
const router=express.Router(); //ye router create karne ke liye use hota hai.
const User=require('../models/user');//models ka user require kate hai.
const bcrypt=require('bcryptjs');
const passport = require('passport');

//signup router ko signup page per le jane kam karega bas.
router.get('/signup',(req,res)=>{
    res.render("signup.ejs");
});


//signup router ko post karna.yani ki data ko database me save karana.

router.post('/signup',async(req,res)=>{
        const {username,email,password}=req.body;  //ye sirf data ko body se laker use karega.
        
        if(!username || !email || !password) return res.redirect('/signup'); //ye koi bhi field khali hone per signup page per redirect ker dega.

        if(await User.findOne({username}))  return res.redirect('/signup'); //ye username database me pahele se hai ya nakhi check karega.

        const hash =await bcrypt.hash(password,10);//ye password ko hash karega taki database me password secure rahe.

        const user= await User.create({username,email,password:hash});//ye user ko database me create karega.

        req.login(user,()=>res.redirect("/posts"));
});


//login router se get karna .
router.get('/login',(req,res)=>{
    res.render("login.ejs");
});


//login router se post ko lana.
router .post('/login',passport.authenticate('local',{     //middleware 
    successRedirect:'/posts',
    failureRedirect:'/login'
}));

module.exports=router;

