const express=require('express');//double cout laga rahe the. 
const app=express();
app.use(express.urlencoded({extended:true}));
const port=3000;
const path=require('path');//const ke bad hum set likh rahe the.
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');//dekha tha.
app.set('views',path.join(__dirname,'views'));//dekha tha.
const{v4:uuidv4}=require('uuid');//require uuidv4 version.
 const methodOverride=require('method-override');//double code nahi lagega.
 app.use(methodOverride ('_method')) ;//use ke bad methodOverride likhna tha.

//sigup and login
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const bcrypt=require('bcryptjs');
const User=require('./models/user');
const mongoose=require("mongoose");
const flash=require("connect-flash");
const session=require("express-session");
const { error } = require('console');
//const userRouter=require('./routes/user');
//app.use('/',userRouter);


//app.get('/',(req,res)=>{
  //  res.send("hello world")
//})


let posts=[
    {
        id:uuidv4(),
        username:"rudra",
        contact:"this is"
    },
    {
        id:uuidv4(),
        username:"rudra",
        contact:"grate"
    }
];

//session her ek individual user ko use karne ke liye alag alag session create karta hai.
app.use(session({
    secret: 'your-secret-key', // Add a secret key for session signing
    resave:false,
    saveUninitialized:false
}));
//ye temporary message ke liye use hota hai.
app.use(flash());

//ye user 
app.use ((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

app.use(passport.initialize());
app.use(passport.session());



// LocalStrategy for passport-local strategy hamare user or password ko verify karta hai.

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const foundUser = await User.findOne({ username });

        if (!foundUser) return done(null, false);

        const ok = await bcrypt.compare(password, foundUser.password);
        if (!ok) return done(null, false);

        return done(null, foundUser);

    } catch (err) {
        return done(err);
    }
}));


// Custom serialize/deserialize (without passport-local-mongoose)
passport.serializeUser((user, done) => done(null, user._id));             //Passport session ko handle karta hai — aur ye 2 functions uske liye compulsory hain.
 passport.deserializeUser(async (id, done) => { 
    const user = await User.findById(id); 
    done(null, user); });


// ===== ROUTES (SABSE LAST) =====
const userRouter=require("./routes/user");   //Ye Express me routing ko separate karne ke liye use hota hai.
app.use("/",userRouter);





//login page
app.get('/test-login',(req,res)=>{
    res.render("login.ejs");

});

//main page
app.get('/posts',(req,res)=>{
    res.render("index.ejs",{posts});
});

//create page
app.get('/posts/new',(req,res)=>{
    res.render("new.ejs");
    });

//submit page    
 app.post('/posts',(req,res)=>{
    let{user,contact}=req.body;//esme user rahega username nahi rahega.
    let id=uuidv4();//id function use karte hai. ya fir uuidv4 function call karte hai.
    posts.push({id,username:user,contact});//username ke ad user or contact likhna tha only id push karate hai.
    res.redirect('/posts');
 }) ;

//id path
app.get('/posts/:id',(req,res)=>{
    let {id}=req.params;//contact and username  nahi rahega.
    let post=posts.find((p)=>p.id===id);//push nahi karate find karate hai.
    console.log(id);
    res.render("show.ejs",{posts});
});
  
//Patch ya fir update
app.patch('/posts/:id',(req,res)=>{
 let {id}=req.params;
 let newContact=req.body.contact;
    let post=posts.find((p)=>p.id===id);
      post.contact=newContact;//ye mai pura bhul gaya tha.
    console.log(id);
    res.redirect('/posts');
});

//edit 
app.get('/posts/:id/edit',(req,res)=>{//esme mai slash id bhul gaya tha likhna.
    let {id}=req.params;
 let post=posts.find((p)=>p.id===id);
 res.render("edit.ejs",{posts});
});

//delete

app.delete('/posts/:id',(req,res)=>{
    let {id}=req.params;
  posts=posts.filter((p)=>p.id!==id);
  res.redirect('/posts');
});

//port path
app.listen(port,()=>{//listen ke sthan per get likh rahe the .
    console.log("server running on port:3000");//console .log ke jagha hum res.send likh rahe the .
});


//mongodb local connection show on terminal
const MONGO_URL = "mongodb://127.0.0.1:27017/authDemo";
  async function main(){
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    }catch(e){
        console.log(e.message);
    }
  }
  main();

