import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import updateImage from "../../public/image/updatepss.png";
import toast, { Toaster } from "react-hot-toast";
import { useResetPasswordMutation } from "../redux/features/auth/resetPassword";
import AuthLayout from "./AuthLayout";

const UpdatePassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [reset, { isLoading }] = useResetPasswordMutation();

  const validateConfirmPassword = (rule, value) => {
    const { password } = form.getFieldsValue();
    if (value && value !== password) {
      return Promise.reject("Passwords do not match!");
    }
    return Promise.resolve();
  };

  const resetPassword = async (values) => {
    setError("");
    try {
      const res = await reset({ password: values.password, email }).unwrap();
      if (res?.code == 200) {
        toast.success(res?.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setError(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      image={updateImage}
      imageAlt="Update password"
      tagline={{
        heading: "Create a New Password",
        subheading: "Choose a strong password you haven't used before to keep your account secure.",
      }}
      title="Update password"
      subtitle="Enter and confirm your new password below."
      onBack={() => navigate("/forgotpassword")}
    >
      <Toaster />
      <Form form={form} layout="vertical" onFinish={resetPassword}>
        <Form.Item
          label={<span className="text-[14px] font-medium text-gray-700">New Password</span>}
          name="password"
          rules={[{ required: true, message: "Please input your new password!" }]}
        >
          <Input.Password
            size="large"
            placeholder="New password"
            className="!h-12 !rounded-lg !bg-gray-50 hover:!bg-gray-50 focus:!bg-white"
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-[14px] font-medium text-gray-700">Confirm Password</span>}
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm your new password!" },
            { validator: validateConfirmPassword },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Confirm password"
            className="!h-12 !rounded-lg !bg-gray-50 hover:!bg-gray-50 focus:!bg-white"
          />
        </Form.Item>

        {error && <p className="text-red-500 text-sm font-medium mb-2">{error}</p>}

        <Button
          htmlType="submit"
          loading={isLoading}
          className="block w-full !h-12 !rounded-lg !text-white !bg-primaryBg hover:!bg-primaryBgDark !border-none !font-medium !text-[15px] mt-2"
        >
          Update Password
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default UpdatePassword;
