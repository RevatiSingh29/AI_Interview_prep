const Question = require('../models/Question');
const Session = require('../models/Session');
//add addtional qs to current section
//POST//api /questions/add
exports.addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    // Input validation
    if (!sessionId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Create questions
    const createQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );
//update to include new q ids
session.questions.push(...createQuestions.map((q)=>q._id))

  } catch (error) {
    console.error("Error in addQuestionsToSession:", error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

//pin/unpin qs
//Post/api/questions/:id/pin
exports.togglePinQuestion=async(req,res)=>{
  try{
    const question= await Question.findById(req.params.id);
    if(!question){
      return res.status(404).json({ message: "Question not found" })
   }
   question.isPinned= !question.isPinned;
   await question.save();

  }
  catch(error){
    res.status(500).json({message:"SERVER ERROR"});
  }
}
//update a note for a q
//POST/api/questions/:id/note
exports.updatedQuestionNote= async(req,res)=>{
  try{
const {note}= req.body;
const question = await Question.findById(req.params.id);
if(!question){
      return res.status(404).json({ message: "Question not found" })
   }
   question.note = note||"";
   await question.save();
   
  }

  catch(error){
    res.status(400).json({message:"server error"});
  }

}