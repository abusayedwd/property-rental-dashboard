import React from 'react';
import { Card } from 'antd';
import { useGetContactQuery } from '../../../redux/features/contact/getContact';
import { useNavigate } from 'react-router-dom';

const ContactInfo = () => {
  const navigate = useNavigate()
  const {data: contact} = useGetContactQuery();
    console.log(contact?.data?.attributes[0])
    const userContact = contact?.data?.attributes[0]

  return (
    <div className=" bg-g mt-12 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Contact Information</h2>
        <Card className="mb-4">
          <p><strong>Email:</strong> {userContact?.email}</p>
          <p><strong>Phone:</strong> {userContact?.phone}</p>
          <p><strong>Address:</strong> {userContact?.address}</p>
        </Card>
        <div className="flex justify-center">
          <button onClick={() => navigate('editcontact')} className="bg-blue-500 text-white py-2 px-4 rounded-lg">Edit Contact</button>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
