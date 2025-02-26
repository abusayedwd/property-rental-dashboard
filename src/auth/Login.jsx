import { Button, Checkbox, Form, Input } from 'antd';
import signin from '../../public/image/signin.png'
import logo from '../../public/image/logo.png'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { BiLock } from 'react-icons/bi';
import { useAdminLoginMutation } from '../redux/features/auth/login';
import toast, { Toaster } from 'react-hot-toast';
 

const Login = () => {
    const [checkboxError, setCheckboxError] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
     
    const [error, setError] = useState('')
   
    const [adminLogin, {isLoading} ] = useAdminLoginMutation()

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
        if (e.target.checked) {
            setCheckboxError('');
        }
    };

    const onFinish = async(values) => {

        if (!isChecked) {
            setCheckboxError('You must agree to the terms');
            return;
        } 
        
        try{
            const res = await adminLogin(values).unwrap();
            console.log(res);
            if(res?.code == 200){
                toast.success(res?.message)
                localStorage.setItem("token", res?.data?.attributes?.tokens?.access?.token);
                localStorage.setItem("user", JSON.stringify(res?.data));

                
            }
            setTimeout(() => {
                
                navigate('/dashboard/home')
            }, 1000);
            
        }catch(error){
            console.log(error);
            setError(error?.data?.message)
            
        }
       

    };

    return (
        <div className="mt-12 h-auto md:h-[680px] shadow-xl w-[80%] md:w-[1096px] mx-auto bg-white rounded-[8px]">
          <Toaster />
            <div className="flex flex-col-reverse md:flex-row justify-around gap-4 px-6 md:px-10 mt-4 md:mt-8 py-4">
                <div className="h-[200px] hidden md:block md:h-[488px] mt-4 md:mt-[100px]">
                    <img src={signin} alt="Signin" className="w-full h-full object-cover" />
                </div>
                <div className="mt-[20px] md:w-1/2">
                  <img src={logo} alt="" />
                    <h1 className="mt-4 md:mt-7 text-left text-[#222222] font-medium text-xl md:text-2xl">
                        Hello, Welcome!
                    </h1>
                    <p className="font-poppins text-left w-full text-[14px] md:text-[16px] font-normal mt-2">
                        Please Enter Your Details Below to Continue
                    </p>
                    <Form
                        name="normal_login"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="email"
                            label={<span className="text-[16px] mt-5 font-medium">Email</span>}
                            rules={[
                                { required: true, message: "Please input your email!" },
                                 
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Enter Your Email"
                                prefix={<HiOutlineMailOpen className="mr-2 bg-white text-black rounded-full p-[6px]" size={28} color="red" />}
                                style={{ height: "52px", background: "#E6F9EF", outline: "none", marginBottom: "20px", border: '1px solid green' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<span className="text-[16px] font-medium">Password</span>}
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Enter Your Password"
                                prefix={<BiLock className="mr-2 bg-white rounded-full p-[6px]" size={28} color="red" />}
                                style={{ background: "#E6F9EF", height: "52px", outline: "none", marginBottom: "20px", border: '1px solid green' }}
                            />
                        </Form.Item>

                        <div className="flex justify-between items-center">
                            <Form.Item>
                                <Checkbox className="text-black" checked={isChecked} onChange={handleCheckboxChange}>
                                    Remember me
                                </Checkbox>
                                {checkboxError && <p className="text-red-500 font-medium">{checkboxError}</p>}
                            </Form.Item>
                            <div className="mb-4 flex justify-between items-center">
                                <Link to="/forgotpassword">
                                    <p className="cursor-pointer text-[14px] font-medium text-[#00BF63]">
                                        Forgot password?
                                    </p>
                                </Link>
                            </div>
                        </div>

                        <Form.Item>
                            <p className='text-red-500 font-semibold'>{error}</p>
                            <Button
                                htmlType="submit"
                                className="block w-full h-[52px] px-2 py-4 mt-2 !text-white !bg-primaryBg"
                            >
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
