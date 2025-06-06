const mongoose =require ("mongoose");
const connectDB= async() => {
  try{
    await mongoose.connect("mongodb+srv://test:radhe108@interviewprep.yzk2cvx.mongodb.net/?retryWrites=true&w=majority&appName=InterviewPrep",{});
    console.log("DB connected");
  }
  catch(err){
    console.error("error encountered while connection",err);
    process.exit(1);
  }

};
module.exports= connectDB;