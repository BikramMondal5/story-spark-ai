import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState } from "react";
import "./auth.css";

import "@flaticon/flaticon-uicons/css/all/all.css";
import {
  useLoginUserMutation,
  useGoogleLoginMutation,
} from "../../redux/apis/auth.api";
import { storeUserInfo, getUserInfo } from "../../services/auth.service";
import { USER_ROLE } from "../../constants/role";
import RedirectComponent from "../redirect.component";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";





type Inputs = {
  email: string;
  password: string;
};

const LoginComponent = () => {
  const [loginUser] = useLoginUserMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsBusy(true);

    try {
      const res = await loginUser({ ...data }).unwrap();

      if (res.data.accessToken) {
        toast.success("User logged in successfully!");

        storeUserInfo({
          accessToken: res.data.accessToken,
        });

        setIsLoggedIn(true);
      }
    } catch {
      toast.error(
        "Login failed. Please check your credentials."
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setIsBusy(true);

    try {
      const res = await googleLogin({
        token: credentialResponse.credential,
      }).unwrap();

      if (res.data.accessToken) {
        toast.success(
          "User logged in successfully with Google!"
        );

        storeUserInfo({
          accessToken: res.data.accessToken,
        });

        setIsLoggedIn(true);
      }
    } catch {
      toast.error(
        "Failed to login with Google. Please try again."
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginError = () => {
    toast.error(
      "Google login failed. Please try again."
    );
  };

  // Role-based redirect fix
  if (isLoggedIn) {
    const userInfo = getUserInfo();

    const isDashboardUser =
      userInfo?.role === USER_ROLE.ADMIN ||
      userInfo?.role === USER_ROLE.SUPER_ADMIN;

    return (
      <RedirectComponent
        defaultPath={
          isDashboardUser
            ? "/dashboard"
            : "/explore"
        }
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-[#050816] dark:bg-[#050816] bg-white text-black dark:text-white transition-all duration-300">

      <main className="auth-container flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/10 dark:border-white/10 border-black/10 shadow-[0_0_40px_rgba(168,85,247,0.12)] w-full max-w-6xl bg-white dark:bg-[#0b1020]">

        {/* LEFT SIDE */}

        <section className="relative w-full md:w-[48%] min-h-[420px] flex items-center justify-center overflow-hidden">

          {/* Background Image */}

          <img
            src="src/assets/login.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-black/60"></div>

          {/* Gradient Glow */}

          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/10"></div>

          {/* Small Particles */}

          <div className="absolute inset-0 overflow-hidden pointer-events-none">

            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  width: `${3 + Math.random() * 6}px`,
                  height: `${3 + Math.random() * 6}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  background:
                    "linear-gradient(135deg,#a855f7,#ec4899,#38bdf8)",
                  opacity: 0.3,
                  filter: "blur(1px)",
                  animationDuration: `${2 + Math.random() * 4
                    }s`,
                }}
              />
            ))}

          </div>

          {/* Content */}

          <div className="relative z-10 px-8 md:px-14">

            {/* Brand */}

            <div className="flex items-center gap-3 mb-8">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">

                <span className="fi fi-rr-sparkles text-white text-sm"></span>

              </div>

              <span className="text-white text-sm tracking-[0.25em] font-bold uppercase">

                Story Spark AI

              </span>

            </div>

            {/* Hero Text */}

            <h1 className="text-4xl md:text-6xl font-black leading-[0.95] text-white drop-shadow-xl">

              One Spark.
              <br />

              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-orange-200 bg-clip-text text-transparent">

                Infinite Worlds.

              </span>

            </h1>

            <p className="mt-6 text-white/90 text-lg leading-relaxed max-w-xl font-medium">

              Turn your imagination into fully illustrated
              multi-variation AI stories.

            </p>

          </div>

        </section>

        {/* RIGHT SIDE */}

        <section className="w-full md:w-[48%] flex items-center justify-center p-4 md:p-6 bg-white dark:bg-[#050816]">

          <div className="w-full max-w-[470px] rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#09111f]/80 backdrop-blur-xl p-7 md:p-9 shadow-xl">

            {/* Heading */}

            <div className="mb-7">

              <h2 className="text-4xl font-black text-black dark:text-white">

                Welcome back

              </h2>

              <p className="mt-2 text-[16px] text-gray-600 dark:text-gray-400">

                Sign in to continue your story journey.

              </p>

            </div>

            {/* Login Header */}

            <div className="border-b border-black/10 dark:border-white/10 mb-8">

              <button className="w-full pb-4 text-base font-bold tracking-widest text-purple-500 border-b-2 border-purple-500">

                LOG IN

              </button>

            </div>

            {/* FORM */}

            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >

              {/* EMAIL */}

              <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                  Email Address

                </label>

                <div className="relative">


                  <input
                    type="email"
                    placeholder="name@storyspark.ai"
                    className="w-full h-[52px] rounded-2xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#131c2f] pl-[6px] pr-4 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 outline-none focus:border-purple-500 transition-all"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                  Password

                </label>

                <div className="relative">


                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-[52px] rounded-2xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#131c2f] pl-[6px] pr-12 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 outline-none focus:border-purple-500 transition-all"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />



                </div>

              </div>

              {/* Forgot */}

              <div className="flex justify-end">

                <a
                  href="/forgot-password"
                  className="text-sm font-semibold text-purple-500 hover:text-pink-500 transition-all"
                >

                  Forgot password?

                </a>

              </div>

              {/* GOOGLE */}

              <div className="w-fit mx-auto rounded-2xl p-[1px] bg-gradient-to-r from-purple-500/40 via-fuchsia-500/30 to-indigo-500/40 shadow-lg shadow-purple-900/30">

                <div className="rounded-2xl bg-[#111827]/90 backdrop-blur-xl px-2 py-2 border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]">

                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    text="continue_with"
                  />

                </div>

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={isBusy}
                className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-lg shadow-lg hover:scale-[1.01] transition-all duration-300"
              >

                {isBusy
                  ? "Signing In..."
                  : "Log In to Story Spark"}

              </button>

            </form>

            {/* Footer */}

            <p className="text-center mt-8 text-[16px] text-gray-600 dark:text-gray-400">

              Don't have an account?{" "}

              <a
                href="/signup"
                className="text-purple-500 font-bold hover:text-pink-500 transition-all"
              >

                Sign up free

              </a>

            </p>

          </div>

        </section>

      </main>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

    </div>
  );
};

export default LoginComponent;
