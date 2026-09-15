import { Form, Input, Button } from "antd";
import character from "../../public/image/forgotpass.png";
import { HiOutlineMailOpen } from "react-icons/hi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../redux/features/auth/forgotPassword";
import toast, { Toaster } from "react-hot-toast";
import AuthLayout from "./AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [forgotpassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (values) => {
    setError("");
    try {
      const res = await forgotpassword(values).unwrap();
      if (res?.code == 200) {
        toast.success(res?.message);
        setTimeout(() => {
          navigate(`/verifyotp?email=${values?.email}`);
        }, 1000);
      }
    } catch (error) {
      setError(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      image={character}
      imageAlt="Forgot password"
      tagline={{
        heading: "Forgot Your Password?",
        subheading: "No worries — we'll send a verification code to get you back into your account.",
      }}
      title="Forgot password"
      subtitle="Enter the email address associated with your account. We'll send you an OTP to your email."
      onBack={() => navigate("/")}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <Form name="forgot_password" layout="vertical" onFinish={handleForgotPassword}>
        <Form.Item
          name="email"
          label={<span className="text-[14px] font-medium text-gray-700">Email</span>}
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            size="large"
            placeholder="Enter your email"
            prefix={<HiOutlineMailOpen className="mr-2 text-gray-400" size={18} />}
            className="!h-12 !rounded-lg !bg-gray-50 hover:!bg-gray-50 focus:!bg-white"
          />
        </Form.Item>

        {error && <p className="text-red-500 text-sm font-medium mb-2">{error}</p>}

        <Form.Item className="mt-4 mb-0">
          <Button
            htmlType="submit"
            loading={isLoading}
            className="block w-full !h-12 !rounded-lg !text-white !bg-primaryBg hover:!bg-primaryBgDark !border-none !font-medium !text-[15px]"
          >
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPassword;
