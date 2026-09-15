import { Button, Checkbox, Form, Input } from "antd";
import signin from "../../public/image/signin.png";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMailOpen } from "react-icons/hi";
import { BiLock } from "react-icons/bi";
import { useAdminLoginMutation } from "../redux/features/auth/login";
import toast, { Toaster } from "react-hot-toast";
import AuthLayout from "./AuthLayout";

const inputClass = "!h-12 !rounded-lg !bg-gray-50 hover:!bg-gray-50 focus:!bg-white";

const Login = () => {
  const [checkboxError, setCheckboxError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setCheckboxError("");
    }
  };

  const onFinish = async (values) => {
    if (!isChecked) {
      setCheckboxError("You must agree to the terms");
      return;
    }

    setError("");
    try {
      const res = await adminLogin(values).unwrap();
      if (res?.code == 200) {
        toast.success(res?.message);
        localStorage.setItem("token", res?.data?.attributes?.tokens?.access?.token);
        localStorage.setItem("user", JSON.stringify(res?.data));
        setTimeout(() => {
          navigate("/dashboard/home");
        }, 1000);
      }
    } catch (error) {
      setError(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      image={signin}
      imageAlt="Secure sign in"
      tagline={{
        heading: "Manage Your Properties with Ease",
        subheading:
          "Sign in to access your admin dashboard and keep track of listings, tenants, and payments in one place.",
      }}
      title="Welcome back"
      subtitle="Please enter your details below to continue."
    >
      <Toaster />
      <Form name="normal_login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          name="email"
          label={<span className="text-[14px] font-medium text-gray-700">Email</span>}
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            size="large"
            placeholder="Enter your email"
            prefix={<HiOutlineMailOpen className="mr-2 text-gray-400" size={18} />}
            className={inputClass}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="text-[14px] font-medium text-gray-700">Password</span>}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            size="large"
            placeholder="Enter your password"
            prefix={<BiLock className="mr-2 text-gray-400" size={18} />}
            className={inputClass}
          />
        </Form.Item>

        <div className="flex justify-between items-center -mt-2 mb-2">
          <div>
            <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
              <span className="text-sm text-gray-600">Remember me</span>
            </Checkbox>
            {checkboxError && <p className="text-red-500 text-xs mt-1">{checkboxError}</p>}
          </div>
          <Link to="/forgotpassword">
            <p className="cursor-pointer text-[14px] font-medium text-primaryBg hover:underline">
              Forgot password?
            </p>
          </Link>
        </div>

        {error && <p className="text-red-500 text-sm font-medium mb-2">{error}</p>}

        <Form.Item className="mt-4 mb-0">
          <Button
            htmlType="submit"
            loading={isLoading}
            className="block w-full !h-12 !rounded-lg !text-white !bg-primaryBg hover:!bg-primaryBgDark !border-none !font-medium !text-[15px]"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default Login;
