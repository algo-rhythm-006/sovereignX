"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EmailStep({ onSubmit }) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!email) {
            setError("Email is required");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(email);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h1 className="mt-[17px] font-title text-36 font-semibold leading-none tracking-snugger text-white lg:text-32 md:text-28 xs:mt-3 xs:text-24 text-center">
                Welcome back
            </h1>
            <p className="text-white opacity-40 text-center mt-2 text-14">
                Enter your email to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col lg:mt-6 xs:mt-5" noValidate="">
                <label
                    className="block text-14 leading-snug tracking-snugger text-grey-60"
                    htmlFor="email"
                >
                    Email
                </label>
                <div className="relative mt-0.5 xs:mb-2 w-full rounded-[4px]">
                    {/* Animated Border Glow when typing */}
                    {email !== "" && !error && !isLoading && (
                        <motion.div
                            className="absolute -inset-[1px] rounded-[5px] opacity-100 z-0 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div 
                                className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(209,208,255,0.8)_20%,transparent_50%)]"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    )}

                    <input
                        className={`remove-autocomplete-styles relative block h-[42px] w-full appearance-none rounded-[4px] border !bg-black px-3 py-[9px] text-15 tracking-snugger text-white placeholder-white/20 outline-none autofill:!text-white md:h-[41px] sm:text-16 z-10 ${error ? 'border-red-500 focus:border-red-500 focus:ring-[rgba(239,68,68,0.5)]' : email !== "" ? 'border-transparent focus:border-transparent focus:ring-0' : 'border-white/10 focus:ring-[rgba(209,208,255,0.5)]'}`}
                        id="email"
                        autoComplete="email"
                        placeholder="name@work-email.com"
                        maxLength="320"
                        required=""
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        name="email"
                        disabled={isLoading}
                        autoFocus
                    />
                </div>
                
                {error && (
                    <div className="text-red-400 text-sm text-left mt-1 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {error}
                    </div>
                )}

                <div className="mt-[27px] h-11 xs:mt-4 xs:h-10 w-full group relative rounded-full">
                    <button 
                        type="submit" 
                        disabled={!email || !!error || isLoading}
                        className={`transition-all duration-300 uppercase font-bold flex items-center justify-center h-11 w-full text-13 text-black -tracking-[0.015em] relative z-10 rounded-full border border-white/60 bg-white px-16 xs:h-10 overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.3)] ${(!email || !!error || isLoading) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-grey-5 group-hover:shadow-[0_0_25px_rgba(255,170,129,0.5)]'}`}
                    >
                        <div
                            className="absolute inset-0 w-[200%] h-full opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out -translate-x-[50%] group-hover:translate-x-0 z-0 bg-cover bg-center pointer-events-none mix-blend-multiply"
                            style={{ backgroundImage: 'url(/images/woblo-button.svg)' }}
                        ></div>
                        <span className="whitespace-nowrap text-14 uppercase leading-[42px] relative z-20">
                            {isLoading ? "Sending..." : "Continue"}
                        </span>
                    </button>
                </div>
            </form>

            <div className="relative mt-[25px] flex items-center lg:mt-[23px] xs:mt-4 w-full">
                <div className="h-px w-full bg-[linear-gradient(90deg,#443D59_0%,#2D2F31_50.9%)]"></div>
                <span className="px-3.5 text-13 uppercase text-grey-40">Or</span>
                <div className="h-px w-full bg-[linear-gradient(90deg,_#2D2F31_49.1%,_#2D2F31_100%)]"></div>
            </div>
            
            <div className="mt-[27px] flex justify-center xs:mt-[18px] w-full">
                <a
                    className="transition-colors duration-200 transition-all duration-200 uppercase font-bold flex items-center justify-center h-10 w-full text-12 text-white tracking-snugger rounded bg-grey-5 ring-1 ring-white/10 transition-all duration-200 hover:ring-white/15 gap-x-2 !text-13"
                    href="https://account.huly.app/auth/google"
                >
                    <img
                        alt="Google Logo"
                        loading="lazy"
                        width="22"
                        height="22"
                        decoding="async"
                        data-nimg="1"
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMiAyMiI+PHBhdGggZmlsbD0idXJsKCNnb29nbGUtbG9nb19zdmdfX2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMSA1LjY3MmMxLjEyNyAwIDIuMjI1LjM2IDMuMTMzIDEuMDI4bDIuNzkxLTIuNjA1QTkuMDg1IDkuMDg1IDAgMCAwIDIuOTQ1IDYuNzU3YTkuMDYgOS4wNiAwIDAgMCAwIDguNDg2bDMuMDQ4LTIuNDM4YTUuMyA1LjMgMCAwIDEtLjMyMS0xLjgwNiA1LjMgNS4zIDAgMCAxIC4zMjEtMS44MDVBNS4zMyA1LjMzIDAgMCAxIDExIDUuNjcybTMuMDk4IDkuNjY0YTUuMzI1IDUuMzI1IDAgMCAxLTguMTA1LTIuNTNsLTMuMDQ4IDIuNDM3YTkuMTA1IDkuMTA1IDAgMCAwIDE3LjE2NC00LjI0MnYtLjY4OWEuNjkuNjkgMCAwIDAtLjY4Ny0uNjg3aC04LjA3OHYzLjc4MWg0LjQwNmwtLjAxNS4wM2E1LjMgNS4zIDAgMCAxLTEuNjQzIDEuODk0eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnb29nbGUtbG9nb19zdmdfX2EiIHgxPSIxMSIgeDI9IjExIiB5MT0iMS44OTEiIHkyPSIyMC4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iLjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4="
                        style={{ color: "transparent" }}
                    />
                    <span className="font-medium !normal-case">
                        Sign in with Google
                    </span>
                </a>
            </div>
        </div>
    );
}
