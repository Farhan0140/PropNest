import { useState } from "react";
import UserLogin from "./UserLogin";
import UserSignUp from "./UserSignUp";

const Authentication = ({flipped=false}) => {
  const [isFlipped, setIsFlipped] = useState(flipped);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);


  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const toggleLoginPassword = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const toggleSignupPassword = () => {
    setShowSignupPassword(!showSignupPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="relative flex flex-col items-center gap-8">
        
        {/* Switch Control Area */}
        <div className="relative flex items-center justify-center w-25 h-7.5 mb-4">
          {/* Labels */}
          <span 
            className={`absolute -left-20 w-20 text-right font-bold text-[#323232] transition-all duration-300 ${isFlipped ? 'no-underline opacity-60' : 'underline'}`}
          >
            Log in
          </span>
          <span 
            className={`absolute -right-20 w-20 text-left font-bold text-[#323232] transition-all duration-300 ${isFlipped ? 'underline' : 'no-underline opacity-60'}`}
          >
            Sign up
          </span>

          {/* The Toggle Switch */}
          <button 
            onClick={toggleFlip}
            className="relative w-12.5 h-6 bg-white border-2 border-[#323232] rounded shadow-[4px_4px_0px_0px_#323232] cursor-pointer transition-colors duration-300 focus:outline-none"
            aria-label="Toggle form"
          >
            <div 
              className={`absolute top-0 left-0 w-5 h-5 bg-white border-2 border-[#323232] rounded transition-transform duration-300 ease-in-out shadow-[0px_3px_0px_0px_#323232] ${isFlipped ? 'translate-x-6.5' : 'translate-x-0'}`}
            />
            {/* Active State Background Overlay */}
            <div 
              className={`absolute inset-0 rounded bg-[#2d8cf0] transition-opacity duration-300 -z-10 ${isFlipped ? 'opacity-100' : 'opacity-0'}`} 
            />
          </button>
        </div>

        {/* 3D Card Container */}
        <div className="relative w-75 h-87.5 perspective-[1000px]">
          <div 
            className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            



            {/* For Login */}
            <UserLogin showLoginPassword={showLoginPassword} toggleLoginPassword={toggleLoginPassword}/>

            {/* For Sign Up */}
            <UserSignUp showSignupPassword={showSignupPassword} toggleSignupPassword={toggleSignupPassword} />




          </div>
        </div>
      </div>

      <style>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  
  );
};

export default Authentication;