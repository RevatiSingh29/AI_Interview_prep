const { GoogleGenAI } = require("@google/genai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: 'MySecretAPIKey});

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Improper info" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [{ text: prompt }],
    });

    const rawText = response.text;

    // Clean the JSON if wrapped in ```json ... ```
    const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();

    const data = JSON.parse(cleanedText);

    return res.status(200).json({ questions: data });
  } catch (error) {
    console.error("Error generating questions:", error);
    return res.status(500).json({ message: "Failed to generate questions" });
  }
};
const generateConceptExplanation= async(req,res)=>{
  try{
    const {question} = req.body;
    if(!question){
      return res.status(400).json({message:"missing fields"});

    }
    const prompt = conceptExplainPrompt(question);
       const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [{ text: prompt }],
    });

    const rawText = response.text;

    // Clean the JSON if wrapped in ```json ... ```
    const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();

    const data = JSON.parse(cleanedText);

    return res.status(200).json({ questions: data });
  }
  catch(error){
    res.questionAnswerPrompt(500).json({
      message:"internal server error"
    })
  }
}
module.exports = { generateInterviewQuestions,generateConceptExplanation };
