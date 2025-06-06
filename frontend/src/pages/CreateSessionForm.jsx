import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Inputs/Input';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';
const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
  e.preventDefault();

  const { role, experience, topicsToFocus, description } = formData;

  // Basic validation: Check if all required fields are filled
  if (
    !role?.trim() ||
    !experience?.trim() ||
    !description?.trim() ||
    !topicsToFocus ||
    (Array.isArray(topicsToFocus) && topicsToFocus.length === 0)
  ) {
    setError("Please fill all required fields");
    return;
  }

  setError("");
  setIsLoading(true);

  try {
    // Step 1: Generate questions using AI API
    const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
      role,
      experience,
      topicsToFocus,
      numberOfQuestions: 10,
    });


    const generatedQuestions = aiResponse.data.questions;
console.log(generatedQuestions);
    // Step 2: Create a session and send all data
    const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
      ...formData,
      questions:generatedQuestions,
    });

    const sessionId = response.data?.sessionId;

    if (sessionId) {
      navigate(`/interview-prep/${sessionId}`);
    } else {
      setError("Session creation failed. No session ID returned.");
    }
  } catch (err) {
    console.error("API Error:", err?.response || err.message || err);
    setError("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Start a New Interview Journey</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Fill out a few quick details and unlock your personalized set of interview questions!
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target Role"
          placeholder="e.g., Frontend Developer, UI/UX Designer, etc."
          type="text"
        />

        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange("experience", target.value)}
          label="Years of Experience"
          placeholder="e.g., 1 year, 3 years, 5+ years"
          type="number"
        />

        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange("topicsToFocus", target.value)}
          label="Topics to Focus On"
          placeholder="Comma-separated, e.g., React, Node.js, MongoDB"
          type="text"
        />

        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description"
          placeholder="Any specific goals or notes for this session?"
          type="text"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Session"}
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;

