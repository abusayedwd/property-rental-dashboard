import React from 'react';
import { Form, Input, Button } from 'antd';
 
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Editsubscription = () => {
    const navigate = useNavigate()
  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
     <div className='mt-8'>
   <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"> <span className='cursor-pointer'> <MdOutlineArrowBackIosNew  onClick={() => navigate('/dashboard/subscription')}/> </span> Edit Subscription</h2>
    <div className="p-6 bg-white rounded-lg shadow-md mx-auto w-[50%]">
     
      <Form name="edit_subscription" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="packageName"
          label="Package Name"
          rules={[{ required: true, message: 'Please input the package name!' }]}
        >
          <Input placeholder="Basic" />
        </Form.Item>
        <Form.Item
          name="packageAmount"
          label="Package Amount"
          rules={[{ required: true, message: 'Please input the package amount!' }]}
        >
          <Input placeholder="$ 4.99" />
        </Form.Item>
        <Form.Item
          name="packageExpiration"
          label="Package Expiration"
          rules={[{ required: true, message: 'Please input the package expiration!' }]}
        >
          <Input placeholder="1 month" />
        </Form.Item>
        <Form.Item>
          <Button  htmlType="submit" className="w-full !bg-[#193664] !text-white">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
     </div>
  );
};

export default Editsubscription;
