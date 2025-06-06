import React, { useContext, useState } from 'react';
import HERO_IMG from "../assets/Hero_img.png";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from 'react-router-dom';
import { LuSparkles } from 'react-icons/lu';
import Modal from '../components/Modal';
import Login from './Login';
import Signup from './Signup'
import { UserContext } from '../context/userContext';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard';



const LandingPage = () => { 
  const {user}= useContext(UserContext);

  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if(!user){
      setOpenAuthModal(true);
    }
    else{
      navigate("/dashboard");
    }
  };

  return (
    <>
      {/* Full Page Background */}
      <div className="w-full min-h-screen bg-[#FFFCEF]" style={{ position: "relative" }}>
        
        {/* Decorative Background Box */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-100 rounded-full opacity-50 -z-10"></div>

        {/* Main Container */}
        <div className="container mx-auto px-4 pt-6 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-16">
            <div className="text-xl text-black font-bold">Interview Prep AI</div>
            {user? (<ProfileInfoCard/>):(
            <button
              className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
              onClick={() => setOpenAuthModal(true)}
            >
              Login / SignUp
            </button>)}
          </header>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Text */}
            <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
              <div className="flex items-center justify-left mb-2">
                <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <LuSparkles /> AI Powered
                </div>
              </div>
              <h1 className="text-5xl text-black font-medium mb-6 leading-tight">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            {/* Right Content */}
            <div className="w-full md:w-1/2">
              <p className="text-[17px] text-gray-900 mr-0 md:mr-20 mb-6">
                Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way. From preparation to mastery—your ultimate interview toolkit is here.
              </p>
              <button
                className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Hero Image Section */}
          <section className="flex items-center justify-center mt-12">
            <img src={HERO_IMG} alt="hero_img" className="w-[80vw] rounded-lg" />
          </section>
        </div>

        {/* Features Section */}
        <div className="w-full min-h-full mt-10 bg-[#FFFCEF]">
          <div className="container mx-auto px-4 pt-10 pb-20">
            <section className="mt-5">
              <h2 className="text-2xl font-medium text-center mb-12">Features that make you shine</h2>
              <div className="flex flex-col items-center gap-8">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  {APP_FEATURES.slice(0, 3).map((feature) => (
                    <div className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100" key={feature.id}>
                      <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Second Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {APP_FEATURES.slice(3).map((feature) => (
                    <div className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100" key={feature.id}>
                      <h3 className="text-base font-semibold mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Modal
       isOpen={openAuthModal}
       onClose={()=>{
        setOpenAuthModal(false);
        setCurrentPage(login);
       }}>
        <div className="">
          {currentPage=== "login"&& (
            <Login setCurrentPage={setCurrentPage}/>
          )}
          {currentPage==="signup" && (
            <Signup setCurrentPage={setCurrentPage}/>
          )}
        </div>
       </Modal>

      
    </>
  );
};

export default LandingPage;
