import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuthContext from '../../hooks/Auth/useAuthContext';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();
    
  const {loginUser, loginLoading} = useAuthContext();

  const [loginErr, setLoginErr] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate()
  
  const onSubmit = async (data) => {
    const res = await loginUser(data);
    if (res.success) {
      setLoginErr(false);
      setLoginSuccess(res.success);
      // TODO add dashboard route to redirect user role based
      setTimeout(() => navigate("/admin-dashboard"), 2000)
    } else {
      setLoginErr(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 font-sans">
      <div className="w-full max-w-87.5">
        <form onSubmit={handleSubmit(onSubmit)} className="
          flex flex-col items-start justify-center gap-5 
          p-5 bg-white rounded-lg 
          border-2 border-black 
          shadow-[3px_4px_0px_0px_rgba(0,0,0,0.8)]
        ">
          
          {/* Title */}
          <div className="text-gray-800 font-black text-xl mb-2 leading-tight">
            Welcome,<br />
            <span className="text-gray-600 font-semibold text-base">sign up to continue</span>
          </div>

          {
            loginErr && (
              <span className='text-red-500'>Check Email, Nid, Password <br />Try again!!</span>
            )
          }

          {/* Email And Nid Input */}
          <input 
            type="text" 
            placeholder="Email Or NID" 
            name="email_or_nid" 
            className="
              w-full h-10 rounded 
              border-2 border-black bg-white 
              shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
              text-sm font-semibold text-gray-800 
              px-3 py-2 outline-none transition-all duration-200
              placeholder:text-gray-500 placeholder:opacity-80
              focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            " 
            {
              ...register("email_or_nid", {required: "* This field is required"})
            }
          />
          {
            errors.email_or_nid && (
              <span className="text-red-500">{errors.email_or_nid.message}</span>
            )
          }
          
          {/* Password Input with Toggle */}
          <div className="relative w-full">
            <input 
              type={!showPassword ? "text" : "password"}
              placeholder="Password" 
              name="password" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-80
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              " 
              {
                ...register("password", {required: "* This field is required"})
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {
            errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )
          }

          {/* For Message Box  */}
          {loginSuccess && (
            <div className={`
                w-full h-10 rounded 
                border-2 border-black bg-green-300
                shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
                text-base font-semibold text-gray-800 
                cursor-pointer 
                active:shadow-none active:translate-x-0.85 active:translate-y-0.85 transition-all
                flex items-center justify-center
              `}
            >
              Login Successful
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            className="
              mt-4 w-full h-10 rounded 
              border-2 border-black bg-blue-200
              shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
              text-base font-semibold text-gray-800 
              cursor-pointer 
              active:shadow-none active:translate-x-0.85 active:translate-y-0.85 transition-all
              flex items-center justify-center
              
            "
            disabled={loginLoading}
          >
            {
              loginLoading? <span className="loading loading-dots loading-lg"></span> : "Log in →"
            }
          </button>
          <div className='text-black'>Don't Have an account <span> </span>
            <button type='button' onClick={() => navigate('/sign-up')} href="#" className='text-blue-500 font-semibold'>Sign-up</button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default UserLogin;
