/**
 * Login Page
 * Pixel-perfect Spotify login page implementation
 */

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Spotify Logo SVG
function SpotifyLogo() {
  return (
    <svg
      viewBox="0 0 1134 340"
      className="h-[50px] w-auto"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 187 23 14 9 1 31-13 22zm12-47c-52-31-137-41-186-23-18 6-25-23-8-28 57-17 149-7 207 29 16 10 3 33-13 22zM825 117c-26 0-44 10-57 23v-19h-24v116h26v-65c0-26 15-41 39-41 23 0 35 15 35 41v65h26v-73c0-35-17-47-45-47zm-129-2c-30 0-49 14-61 32V41h-26v196h26v-19c12 17 30 31 61 31 46 0 77-37 77-87s-31-87-77-87zm-9 152c-32 0-53-27-53-65s21-65 53-65 53 27 53 65-21 65-53 65zm-169-30c12 8 28 12 47 12 28 0 45-14 45-37 0-21-15-31-42-37l-28-6c-19-4-27-12-27-25 0-16 13-26 35-26 18 0 33 6 43 16l13-18c-13-11-32-17-56-17-31 0-50 16-50 40 0 21 14 32 41 38l29 6c20 5 28 13 28 27 0 18-14 28-38 28-20 0-38-7-50-18l-10 17zm-93-116c-17 0-31 6-41 15v-13h-24v114h26v-19c10 9 23 15 39 15 33 0 57-27 57-66s-24-66-57-66zm-9 110c-23 0-39-18-39-44s16-44 39-44 39 18 39 44-16 44-39 44zM293 237h26V103h-26v134zm13-175c-9 0-16 7-16 16s7 16 16 16 16-7 16-16-7-16-16-16zm628 111c0-35-23-56-58-56-23 0-41 9-52 24V41h-26v196h26v-19c11 15 29 24 52 24 35 0 58-21 58-56zm-26 0c0 26-15 44-41 44-26 0-43-18-43-44s17-44 43-44c26 0 41 18 41 44zm-422 64h26v-65c0-26 15-41 39-41 23 0 35 15 35 41v65h26v-73c0-35-17-47-45-47-26 0-44 10-57 23v-19h-24v116zm209-120c-30 0-49 14-61 32V41h-26v196h26v-19c12 17 30 31 61 31 46 0 77-37 77-87s-31-87-77-87zm-9 152c-32 0-53-27-53-65s21-65 53-65 53 27 53 65-21 65-53 65z" />
    </svg>
  );
}

// Google Icon
function GoogleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// Facebook Icon
function FacebookIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// Apple Icon
function AppleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

// Eye Icon (Show Password)
function EyeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Eye Off Icon (Hide Password)
function EyeOffIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// Loading Spinner
function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Check Icon for Checkbox
function CheckIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn("spotify", { callbackUrl: "/" });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email or username");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      // For email/password login, we still use Spotify OAuth
      // In a real app, you might have your own auth system
      await signIn("spotify", { callbackUrl: "/" });
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[450px]">
        {/* Card */}
        <div className="w-full px-8 py-10">
          {/* Spotify Logo */}
          <div className="flex justify-center mb-8">
            <div className="text-black">
              <SpotifyLogo />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-[32px] font-bold text-black text-center mb-8">
            Log in to Spotify
          </h1>

          {/* Social Login Buttons */}
          <div className="space-y-2 mb-8">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full h-12 rounded-full border border-[#878787] bg-white text-black text-sm font-bold flex items-center justify-center hover:bg-[#F0F0F0] hover:border-black transition-all relative"
              type="button"
            >
              <span className="absolute left-4">
                <GoogleIcon />
              </span>
              <span className="m-auto">Continue with Google</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleSocialLogin("facebook")}
              className="w-full h-12 rounded-full border border-[#878787] bg-white text-black text-sm font-bold flex items-center justify-center hover:bg-[#F0F0F0] hover:border-black transition-all relative"
              type="button"
            >
              <span className="absolute left-4">
                <FacebookIcon />
              </span>
              <span className="m-auto">Continue with Facebook</span>
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocialLogin("apple")}
              className="w-full h-12 rounded-full border border-[#878787] bg-white text-black text-sm font-bold flex items-center justify-center hover:bg-[#F0F0F0] hover:border-black transition-all relative"
              type="button"
            >
              <span className="absolute left-4">
                <AppleIcon />
              </span>
              <span className="m-auto">Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[#878787]" />
            <span className="text-[14px] text-[#878787]">or</span>
            <div className="flex-1 h-px bg-[#878787]" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-black mb-2">
                Email or username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 border border-[#878787] rounded-[4px] px-4 text-base bg-white text-black placeholder-[#878787] focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition-all"
                placeholder=""
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 border border-[#878787] rounded-[4px] px-4 pr-12 text-base bg-white text-black placeholder-[#878787] focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition-all"
                  placeholder=""
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#878787] hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-all ${
                  rememberMe
                    ? "bg-[#1DB954] border-[#1DB954]"
                    : "border-[#878787]"
                }`}
              >
                {rememberMe && (
                  <span className="text-white">
                    <CheckIcon />
                  </span>
                )}
              </button>
              <label className="text-sm text-black cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-[#e91429] text-sm mb-4">{error}</p>
            )}

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#1DB954] text-white text-base font-bold hover:bg-[#1ED760] hover:scale-[1.02] active:bg-[#169C46] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span>Signing in...</span>
                </>
              ) : (
                "Log In"
              )}
            </button>

            {/* Forgot Password */}
            <a
              href="https://www.spotify.com/password-reset/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-black underline mt-5 hover:no-underline"
            >
              Forgot your password?
            </a>
          </form>

          {/* Bottom Divider */}
          <div className="border-t border-[#E5E5E5] my-6" />

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[#878787]">
            Don&apos;t have an account?{" "}
            <a
              href="https://www.spotify.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline hover:no-underline"
            >
              Sign up for Spotify
            </a>
          </p>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <a
              href="https://www.spotify.com/legal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#878787] hover:underline"
            >
              Legal
            </a>
            <span className="text-[#878787]">•</span>
            <a
              href="https://www.spotify.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#878787] hover:underline"
            >
              Privacy Center
            </a>
            <span className="text-[#878787]">•</span>
            <a
              href="https://www.spotify.com/legal/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#878787] hover:underline"
            >
              Privacy Policy
            </a>
            <span className="text-[#878787]">•</span>
            <a
              href="https://www.spotify.com/legal/cookies-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#878787] hover:underline"
            >
              Cookies
            </a>
            <span className="text-[#878787]">•</span>
            <a
              href="https://www.spotify.com/legal/ads-privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#878787] hover:underline"
            >
              About Ads
            </a>
            <span className="text-[#878787]">•</span>
            <a
              href="https://www.spotify.com/accessibility/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#878787] hover:underline"
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
