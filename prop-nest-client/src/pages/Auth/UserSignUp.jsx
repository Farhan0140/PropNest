const UserSignUp = ({showSignupPassword, toggleSignupPassword}) => {
  return (
    <div className="absolute inset-0 w-full h-full backface-hidden bg-[#e5e5e5] border-2 border-[#323232] shadow-[4px_4px_0px_0px_#323232] rounded p-5 flex flex-col items-center justify-center gap-5 rotate-y-180">
      <h2 className="text-2xl font-black text-[#323232] mb-2">Sign up</h2>

      {/* TODO use react hook form */}
      <form className="flex flex-col items-center gap-5 w-full" onSubmit={(e) => e.preventDefault()}>
        <input 
          className="w-62.5 h-10 rounded border-2 border-[#323232] bg-white shadow-[4px_4px_0px_0px_#323232] px-3 text-[15px] font-semibold text-[#323232] outline-none focus:border-[#2d8cf0] placeholder-[#666] placeholder-opacity-80 transition-colors"
          type="text" 
          placeholder="Name" 
        />
        <input 
          className="w-62.5 h-10 rounded border-2 border-[#323232] bg-white shadow-[4px_4px_0px_0px_#323232] px-3 text-[15px] font-semibold text-[#323232] outline-none focus:border-[#2d8cf0] placeholder-[#666] placeholder-opacity-80 transition-colors"
          type="email" 
          placeholder="Email" 
        />
        <div className="relative w-62.5">
          <input 
            className="w-full h-10 rounded border-2 border-[#323232] bg-white shadow-[4px_4px_0px_0px_#323232] px-3 pr-10 text-[15px] font-semibold text-[#323232] outline-none focus:border-[#2d8cf0] placeholder-[#666] placeholder-opacity-80 transition-colors"
            type={showSignupPassword ? 'text' : 'password'} 
            placeholder="Password" 
          />
          <button 
            type="button"
            onClick={toggleSignupPassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
            aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
          >
            {!showSignupPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        <button className="mt-2 w-30 h-10 rounded border-2 border-[#323232] bg-white shadow-[4px_4px_0px_0px_#323232] text-[17px] font-semibold text-[#323232] cursor-pointer active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all">
          Confirm!
        </button>
      </form>
    </div>
  );
};

export default UserSignUp;