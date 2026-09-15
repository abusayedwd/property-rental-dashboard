import otpImage from "../../public/image/otp.png";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { Button } from "antd";
import { useVerifyEmailMutation } from "../redux/features/auth/verifyEmail";
import { useForgotPasswordMutation } from "../redux/features/auth/forgotPassword";
import toast, { Toaster } from "react-hot-toast";
import AuthLayout from "./AuthLayout";

const VerifyOtp = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [error, setError] = useState("");
  const email = queryParams.get("email");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useForgotPasswordMutation();

  const sendOtp = async () => {
    setError("");
    try {
      const res = await verifyOtp({ oneTimeCode: otp, email }).unwrap();
      if (res?.code == 200) {
        toast.success(res?.message);
        setTimeout(() => {
          navigate(`/updatepassword?email=${email}`);
        }, 1000);
      }
    } catch (error) {
      setError(error?.data?.message || "Invalid or expired code. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendOtp({ email }).unwrap();
      toast.success(res?.message || "A new code has been sent to your email.");
    } catch (error) {
      toast.error(error?.data?.message || "Could not resend code. Please try again.");
    }
  };

  return (
    <AuthLayout
      image={otpImage}
      imageAlt="Verify OTP"
      tagline={{
        heading: "Almost There",
        subheading: "Enter the code we sent you to verify it's really you.",
      }}
      title="Verify OTP"
      subtitle="We'll send a verification code to your email. Check your inbox and enter the code here."
      onBack={() => navigate("/forgotpassword")}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center sm:justify-start">
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          shouldAutoFocus
          inputStyle={{
            height: "52px",
            width: "48px",
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            marginRight: "8px",
            outline: "none",
            fontSize: "18px",
            fontWeight: 600,
            color: "#1F2937",
          }}
          renderSeparator={<span className="w-1" />}
          renderInput={(props) => <input {...props} />}
        />
      </div>

      <div className="flex justify-between items-center mt-5">
        <small className="text-[14px] text-gray-500">Didn't receive the code?</small>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || !email}
          className="text-[14px] font-medium text-primaryBg hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? "Sending..." : "Resend"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm font-medium mt-4">{error}</p>}

      <Button
        onClick={sendOtp}
        loading={isLoading}
        disabled={otp.length !== 6}
        className="block w-full !h-12 !rounded-lg !text-white !bg-primaryBg hover:!bg-primaryBgDark !border-none !font-medium !text-[15px] mt-6 disabled:!opacity-50"
      >
        Verify
      </Button>
    </AuthLayout>
  );
};

export default VerifyOtp;
