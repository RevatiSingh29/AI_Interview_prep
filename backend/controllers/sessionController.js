const Session = require('../models/Session');
const Question = require('../models/Question');

exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;

    // Check for missing required fields
    if (!role || !experience || !description || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user._id;

    // Create session
    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    // Create and link questions
    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    // Link question IDs to the session
    session.questions = questionDocs;
    await session.save();

    res.status(200).json({ message: "success", sessionId: session._id });

  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Unable to create session", error: error.message });
  }
};


//get all sessions for a user
// get api/sessions/my-sessions
exports.getMySessions= async(req,res)=>{
 try{
  const sessions = await Session.find({user:req.user.id})
  .sort({createdAt:-1})
  .populate("questions");
  res.status(200).json(sessions);

 }
catch(error){
  res.status(400).json({message:"unable to create session"})
}
};
// get session by ID with populated questions
//GET/api/sessions/id
exports.getSessionById = async (req, res) => {
  try {
    // Find session by ID and populate the 'questions' field
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions", // populate the 'questions' field
        options: {
          sort: {
            isPinned: -1, // Sort pinned questions first (descending order)
            createdAt: 1,  // Then sort by createdAt (ascending order)
          },
        },
      })
      .exec();

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if logged-in user owns the session
    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete related questions
    await Question.deleteMany({ session: session._id });

    // Delete the session
    await session.deleteOne();

    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
