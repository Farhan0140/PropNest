import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuthContext from "../../hooks/Auth/useAuthContext";
import { useNavigate } from "react-router-dom";


const UserSignUp = () => {

  const {registerUser, regLoading} = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [failedMsg, setFailedMsg] = useState("")
  const [isFailed, setIsFailed] = useState(false)

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const res = await registerUser(data);
    setIsFailed(!res.success);
    setFailedMsg(res.message);

    if(res.success) {
      setTimeout(() => navigate("/login"), 2000)
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

          {/* Full Name Input */}
          <input 
            type="text" 
            placeholder="Full Name" 
            name="full_name" 
            className="
              w-full h-10 rounded 
              border-2 border-black bg-white 
              shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
              text-sm font-semibold text-gray-800 
              px-3 py-2 outline-none transition-all duration-200
              placeholder:text-gray-500 placeholder:opacity-80
              focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            " 
            {...register("full_name", {required: "* This Field is Required"})}
          />
          {
            errors.full_name && (
              <span className="text-red-500">{errors.full_name.message}</span>
            )
          }

          {/* Email Or NID Input */}
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
            {...register("email_or_nid", {required: "* This Field is Required"})}
          />
          {
            errors.email_or_nid && (
              <span className="text-red-500">{errors.email_or_nid.message}</span>
            )
          }
          
          {/* Password Input */}
          <div className="relative w-full">
            <input 
              type="password"
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
                ...register("password", {
                  required: "* This Field is Required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                    message: (
                      <>
                        Password must contain<br /> ▹1 uppercase <br /> ▹1 lowercase <br /> ▹1 number <br /> ▹1 special character
                      </>
                    ),
                  },
                })
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {
            errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )
          }

          {/* Confirm Password Input with Toggle */}
          <div className="relative w-full">
            <input 
              type="password"
              placeholder="Confirm Password" 
              name="confirmPassword" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-80
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              "
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
          {
            (password !== confirmPassword && confirmPassword.length >= 1) && (
              <span className="text-red-500">* Password Doesn't Match</span>
            )
          }

          {/* For Message Box  */}
          {failedMsg.length > 0 && (
            <div className={`
                w-full h-10 rounded 
                border-2 border-black ${isFailed ? "bg-red-300" : "bg-green-300"}
                shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
                text-base font-semibold text-gray-800 
                cursor-pointer 
                active:shadow-none active:translate-x-0.85 active:translate-y-0.85 transition-all
                flex items-center justify-center
              `}
            >
              {failedMsg}
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
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            disabled={password !== confirmPassword || regLoading}
          >
            {
              regLoading ? <span className="loading loading-dots loading-xl text-natural"></span> : "Let`s go →"
            }
          </button>

          <div className='text-black'>Already Have an account <span> </span>
            <button type='button' onClick={() => navigate('/login')} href="#" className='text-blue-500 font-semibold'>Sign-in</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;
