import React, { useState } from 'react';
import { Input, Form, Button, message, notification } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useGetContactQuery } from '../../../redux/features/contact/getContact';
import { useUpdateContactMutation } from '../../../redux/features/contact/updateContact';
import { useNavigate } from 'react-router-dom';

const EditContact = () => {

    const navigate = useNavigate();
  const {data: contact} = useGetContactQuery();
    console.log(contact?.data?.attributes[0])
    const userContact = contact?.data?.attributes[0]

   
      const [formData, setFormData] = useState({
        email:  userContact?.email,
        phone:  userContact?.phone,
        address: userContact?.address,
      });
  

  const handleFormChange = (changedFields) => {
    setFormData({
      ...formData,
      ...changedFields,
    });
  };
const [ contactU, {isLoading} ] = useUpdateContactMutation()
const onFinish = async (values) => {
    console.log(values);
  
    try {
      // Assuming contactU is an async function you are calling for submitting the form
      const res = await contactU(values).unwrap();
      console.log(res);
  
      if (res?.code === 200) {
        // Success notification
        notification.success({
          message: 'Success',
          description: res?.message || 'Contact information updated successfully!',
          duration: 3, 
        });
        navigate('/dashboard/contact')
      }
    } catch (error) {
      console.log(error);
  
      // Error notification
      notification.error({
        message: 'Error',
        description: error?.data?.message || 'Something went wrong. Please try again.',
        duration: 3, // Optional: Customize the display duration in seconds
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Contact Information</h2>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={formData}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-500" />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number!' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-500" />}
              placeholder="Enter your phone number"
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              { required: true, message: 'Please input your address!' },
            ]}
          >
            <Input.TextArea
              prefix={<HomeOutlined className="text-gray-500" />}
              placeholder="Enter your address"
              rows={4}
            />
          </Form.Item>

          <div className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-2 text-lg rounded-md"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditContact;

