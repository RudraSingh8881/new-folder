const mongoose=require("mongoose");
const Schema=mongoose.Schema;//mongoose dot schema hota hai.


let userSchema=new Schema({ //shema always user ka banayenge new dynamic method use karke.
      username:{
        type:String,
        required:true,
        unique:true,
      },
       email:{
        type:String,
        required:true,
      },
       password:{
        type:String,
        required:true,
      }

});

module.exports=mongoose.model("User",userSchema);    //module se export karte hai userSchema ke data ko user rout me use ker sake or esme mongoose dot modele likhna bhul gaye the.