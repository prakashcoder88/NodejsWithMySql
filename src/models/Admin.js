// const mongoose = require("mongoose");

// // const bcrypt = require("bcrypt")

// const adminSchema = new mongoose.Schema({

//     UserName: {
//         type: String,
//         require: false
//     },
//     empEmail:{
//         type:String,
//         lowercase:true,
        
//         require:false
//     },
//     mobile:{
//         type:Number,
//         validator:{
//             minlength:10
//         },
//         require: false
//     },
//     otp:{
//         type: String,
//         require:false
//     },
//     otpExpire: {
//         type: String,
        
//       },
//     profile:{
//         type:Array,
//         require: false
//     },
//     password:{
//         type:String,
       
//     }
// }, {versionKey: false})


// const rootuser = mongoose.model("admin", adminSchema)
// module.exports = rootuser;


