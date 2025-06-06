
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

import DashboardLayout from '../../components/Layouts/DashboardLayout';
import RoleInfoHeader from '../../pages/InterviewPrep/Components/RoleInfoHeader';
import QuestionCard from '../../pages/InterviewPrep/Components/QuestionCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuCircleAlert } from 'react-icons/lu';
import AIResponsePreview from './Components/AIResponsePreview';
import Drawer from '../../components/Cards/Drawer';

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [errormsg, setErrorMsg] = useState('');
  const [openLoadMoreDrawer, setOpenLoadMoreDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if (response.data) {
        setSessionData(response.data);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to fetch session details.");
    }
  };

  const generateConceptExplanation = async (question) => {
    setOpenLoadMoreDrawer(true);
    setIsLoading(true);
    setExplanation(null);
    setErrorMsg("");

    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { question });
      if (response.data && response.data.questions) {
        setExplanation(response.data.questions);
      } else {
        setErrorMsg("No explanation found.");
      }
    } catch (err) {
      setErrorMsg("Error fetching explanation.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadMoreQuestions = async () => {
    try {
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 10,
      });

      const generatedQuestions = aiResponse.data.questions; // ✅ fixed access

      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: generatedQuestions, // ✅ send correctly
      });

      if (response.data) {
        toast.success("Added More Q&A");
        fetchSessionDetailsById(); // ✅ no line break bug
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Something Went Wrong. Please try Again!!!");
      }
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ''}
        topicsToFocus={sessionData?.topicsToFocus || []}
        experience={sessionData?.experience || ''}
        questions={sessionData?.questions || []}
        description={sessionData?.description || ''}
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold text-black mb-4">Interview Q&A</h2>

        <div className="grid grid-cols-12 gap-4">
          <div className={`col-span-12 ${openLoadMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}>
            <AnimatePresence>
              {sessionData?.questions?.length > 0 ? (
                sessionData.questions.map((data, index) => (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout
                    layoutId={`question-${data._id || index}`}
                    className="mb-4"
                  >
                    <QuestionCard
                      question={data?.question}
                      answer={data?.answer}
                      onLearnMore={() => generateConceptExplanation(data.question)}
                    />
                    {!isLoading && sessionData?.questions?.length === index + 1 && (
                      <div className="flex items-center justify-center mt-5">
                        <button
                          disabled={isLoading}
                          onClick={uploadMoreQuestions}
                          className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">No questions available.</p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Drawer
          isOpen={openLoadMoreDrawer}
          onClose={() => setOpenLoadMoreDrawer(false)}
          title={explanation?.title || "Explanation"}
        >
          {errormsg && (
            <p className="flex gap-2 text-sm text-amber-600 font-medium">
              <LuCircleAlert className="mt-1" />
              {errormsg}
            </p>
          )}

          {!isLoading && explanation && (
            <AIResponsePreview content={explanation.explanation} />
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
