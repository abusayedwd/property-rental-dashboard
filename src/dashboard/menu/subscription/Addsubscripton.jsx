import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Addsubscriptin = () => {
    const navigate = useNavigate()
  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <div className='mt-8'>
   <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"> <span className='cursor-pointer'> <MdOutlineArrowBackIosNew  onClick={() => navigate('/dashboard/subscription')}/> </span> Add Subscription</h2>

    <div className="p-6 mt-6 w-[50%] mx-auto bg-white rounded-lg shadow-md">
       <Form name="add_subscription" onFinish={onFinish} layout="vertical">
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

       
        <Form.List className = "flex items-center " name="features">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} align="baseline" className="flex w-full items-center">
                  <Form.Item
                    {...restField}
                    name={[name, 'feature']}
                    fieldKey={[fieldKey, 'feature']}
                    rules={[{ required: true, message: 'Missing feature' }]}
                    className=""
                  >
                    <Input placeholder="Enter feature" />
                  </Form.Item>
                  <Form.Item>

                  <MinusCircleOutlined className='text-[18px]' onClick={() => remove(name)} />
                  </Form.Item>
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  className="w-full flex items-center justify-center"
                >
                  <PlusOutlined /> Add new feature
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button  htmlType="submit" className="w-full !bg-[#193664] !text-white">
            ADD Subscription
          </Button>
        </Form.Item>
      </Form>
    </div>
    </div>
  );
};

export default Addsubscriptin;
