
const  mongoose= require ("mongoose");
const qeustionSchema= new mongoose.Schema({
  session:{type:mongoose.Schema.Types.ObjectId,ref:"Session"},
  question: String,
  answer: String,
  note: String,
  isPinned:{type:Boolean,default: false},

  },);
  module.exports =mongoose.model("Question",qeustionSchema);
