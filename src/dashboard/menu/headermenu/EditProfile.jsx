 
// export default EditProfiel;
import { Button, Form, Input, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import "react-phone-number-input/style.css";
import defaultUserImage from "../../../../public/image/randomuser.jpg";
 
import url from "../../../redux/api/baseUrl";
 
import toast, { Toaster } from "react-hot-toast";
 
import { useGetProfileQuery } from "../../../redux/features/auth/profile/getProfile";
import { useUpdateUserMutation } from "../../../redux/features/auth/profile/editProfile";

const EditProfile = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(" ");
  const [fileList, setFileList] = useState([]);
 
  const [imageUrl, setImageUrl] = useState(defaultUserImage);
  const [form] = Form.useForm(); // Form instance
 

  // Fetch user profile only if ID is available
  const { data: profile } = useGetProfileQuery();
  console.log(profile)
  const id = profile?.data?.attributes?.user?.id
  const user = profile?.data?.attributes?.user;
  

  useEffect(() => {
    if (profile) {
      setPhoneNumber(String(profile?.data?.attributes?.user?.phoneNumber || ""));


      const profileImageUrl = profile.data.attributes?.user?.image?.url
        ? url + profile.data.attributes?.user?.image?.url
        : defaultUserImage;

      setImageUrl(profileImageUrl);

      // Update form fields dynamically
      form.setFieldsValue({
        fullName: profile.data.attributes?.user?.fullName || "",
        email: profile.data.attributes?.user?.email || "",
      });
    }
  }, [profile, form]);

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0]?.originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(newFileList[0].originFileObj);
      reader.onload = () => setImageUrl(reader.result);
    }
  };
  console.log(fileList)

  const handleUpdateProfile = async (values) => {

    console.log(phoneNumber)
    console.log(fileList[0]?.originFileObj)
    const formData = new FormData();
    formData.append("fullName", values?.fullName);
    formData.append("phoneNumber", phoneNumber);
    if (fileList[0]?.originFileObj) {
      formData.append("image", fileList[0]?.originFileObj);
    }
  
    try {
      const res = await updateProfile({ formData, id }).unwrap();
      console.log(res);
  
      if (res?.code === 200) {
        toast.success(res?.message);
        // Update local state if needed
      
        setTimeout(() => {
          navigate("/dashboard/profile");
        }, 1000);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };
  
  return (
    <div className="">
      <Toaster />
      <div
        onClick={() => navigate("/dashboard/profile")}
        className="flex items-center cursor-pointer ml-6 mt-10 mb-16"
      >
        <MdOutlineKeyboardArrowLeft size={30} />
        <h1 className="text-xl font-medium ml-2">Edit Profile</h1>
      </div>

      <div className="mx-6 p-9 rounded-xl bg-white shadow-md">
        <Form
          form={form} // Use form instance
          layout="vertical"
          autoComplete="off"
          onFinish={handleUpdateProfile}
        >
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col items-center w-full lg:w-1/3 border-dotted border">
              <div className="relative w-56 h-56 rounded-full flex justify-center items-center mt-5 bg-gray-50 border">
                <Upload name="avatar" showUploadList={false} onChange={handleUploadChange}>
                  <img className="w-44 h-44 rounded-full" src={imageUrl} alt="Profile" />
                  <Button
                    className="border-none text-md text-blue-500 absolute bottom-6 flex items-center"
                    icon={<LuImagePlus size={20} className="mr-2" />}
                  >
                    Change Picture
                  </Button>
                </Upload>
              </div>

              <div className="text-center mt-6">
                <p className="text-lg">{user?.user?.role || "Admin"}</p>
                <h1 className="text-2xl font-medium">{user?.user?.fullName || "User"}</h1>
              </div>
            </div>

            <div className="flex-1 w-full lg:w-2/3">
              <div className="flex flex-col gap-6">
                <Form.Item
                  label={<span className="text-lg font-medium">Name</span>}
                  name="fullName"
                  rules={[{ required: true, message: "Please input your name!" }]}
                >
                  <Input
                    placeholder="Name"
                    className="p-4 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-lg font-medium">Email</span>}
                  name="email"
                  rules={[{ required: true, message: "Please input your email!" }]}
                >
                  <Input
                    placeholder="Email"
                    readOnly
                    className="p-4 rounded-lg border-gray-300 bg-gray-100"
                  />
                </Form.Item>

                <div className="flex flex-col">
                  <label className="text-lg font-medium mb-2">Phone Number</label>
                  <PhoneInput
                    placeholder="Enter phone number"
                    international
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="p-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    style={{ height: "50px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            htmlType="submit"
            className="w-full mt-12 h-14 !bg-[#2E7D32] !text-white rounded-lg text-lg font-medium"
            loading={isLoading}
            disabled={isLoading}
          >
            Update Profile
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
