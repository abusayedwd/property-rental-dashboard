import { Image, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import user from '../../../../public/image/randomuser.jpg';
import { useEffect, useState } from "react";
 
import url from "../../../redux/api/baseUrl";
import { useGetProfileQuery } from "../../../redux/features/auth/profile/getProfile";
 

const Profile = () => {
  const navigate = useNavigate();
 
 
  
    const {data: admin} = useGetProfileQuery()
    console.log(admin)
    
    
    console.log(admin);
 
  console.log(url + admin?.data?.attributes?.user?.image?.url)
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mt-10 mb-16">
        <h1 className="text-2xl md:text-3xl font-medium">Profile Information</h1>
        <div
          onClick={() => navigate(`/dashboard/editprofile`)}
          className="flex gap-2 items-center py-3 px-6 rounded-lg cursor-pointer bg-[#2E7D32] text-whiteText"
        >
          <FaEdit size={17} />
          <p>Edit Profile</p>
        </div>
      </div>

      <div className="lg:flex md:flex gap-4 shadow-md bg-white p-4 rounded-xl">
        <div className="lg:w-1/3 flex flex-col border border-dotted p-4 justify-center items-center gap-8">
        <div className="rounded-full  overflow-hidden h-[180px] w-[180px] mx-auto">
              {/* <Image src={url + profile?.data?.attributes?.image} /> */}
              <Image src={url + admin?.data?.attributes?.user?.image?.url} />
            </div>
           
          <div className="flex flex-col justify-center items-center text-center">
            {/* <p className="text-lg md:text-xl">{profile?.data?.attributes?.role}</p> */}
            <p className="text-lg md:text-xl">{admin?.data?.attributes?.user?.role}</p>
            <h1 className="text-2xl md:text-3xl font-medium">{admin?.data?.attributes?.user?.fullName}</h1>
          </div>
        </div>

        <div className="lg:w-2/3 mt-8 lg:mt-0 px-5">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="name" className="text-lg md:text-xl font-medium">
                  Name
                </label>
                <Input
                  placeholder="First name"
                  // value={profile?.data?.attributes?.name}
                  value={admin?.data?.attributes?.user?.fullName}
                  className="p-4 cursor-pointer text-lg md:text-xl bg-[#ebf5f5] text-black rounded w-full mt-3 outline-none focus:bg-[#69C0BE] hover:bg-[#e1f1f1]"
                  type="text"
                  readOnly
                />
              </div>
            </div>

            <div className="flex-1">
              <label htmlFor="email" className="text-lg md:text-xl font-medium">
                Email
              </label>
              <Input
                placeholder="Email"
                value={admin?.data?.attributes?.user?.email}
                className="p-4 text-lg md:text-xl bg-[#ebf5f5] rounded w-full mt-3 outline-none focus:bg-[#69C0BE] hover:bg-[#69C0BE]"
                type="text"
                readOnly
              />
            </div>

            <div className="flex-1">
              <label htmlFor="phone" className="text-lg md:text-xl font-medium">
                Phone Number
              </label>
              <Input
                placeholder="Phone"
                value={admin?.data?.attributes?.user?.phoneNumber}
                className="p-4 text-lg md:text-xl bg-[#ebf5f5] rounded w-full mt-3 outline-none focus:bg-[#69C0BE] hover:bg-[#69C0BE]"
                type="text"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
