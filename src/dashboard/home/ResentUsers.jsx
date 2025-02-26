import { Button, DatePicker, Input, Modal, Space, Table } from "antd";
import { BsInfoCircle } from "react-icons/bs";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import './transaction.css'
import { useGetAllUsersQuery } from "../../redux/features/user/getAllUsers";
import url from "../../redux/api/baseUrl";
 
 
 
const { Search } = Input;
 
const dataSource = [
    {
      key: '1',
      
      customerName: 'Bashar Islam',
      email: 'abc@email.com',
      address: 'Dhaka Bangladesh',
      date: '16 Apr 2024',
      phone:'4536656'
    },
    {
      key: '2',
      applicationId: '12345678',
      customerName: 'Bashar Islam',
      email: 'abc@email.com',
      address: 'Dhaka Bangladesh',
      date: '16 Apr 2024',
      phone:'4536656'
    },
    {
      key: '3',
      applicationId: '12345678',
      customerName: 'Bashar Islam',
      email: 'abc@email.com',
      address: 'Dhaka Bangladesh',
      date: '16 Apr 2024',
      phone:'4536656'
    },
]

const ResentUser = () => {
  const [name, setName ] = useState(' ')
  const [isModalOpen, setIsModalOpen] = useState(false);
const [user, setUser] = useState()
 const {data: userss} = useGetAllUsersQuery(name)
//  console.log(userss?.data?.attributes?.results)
 const users = userss?.data?.attributes?.results

 
  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
      key: "si",
      render: (text,_,index) => index + 1,
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
           
          <img className="h-8 rounded-full" src={ url + record?.image?.url} alt="" />
          <p className="font-medium">{record?.fullName}</p>
        </div>
      ),
    },
   
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, record) => (
        <p>{(record?.email) ?  record?.email : "test@gmail.com"}</p>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (_, record) => (
        <p>{(record?.phoneNumber) ?  record?.phoneNumber : "94540455"}</p>
      )
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      render: (_, record) => (
        <p>{record?.createdAt?.split("T")[0] ? record?.createdAt?.split("T")[0] : "N/A"}</p>
        // <p>34/04/24</p>
      )
    },
    
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
         
            <BsInfoCircle  onClick={() => handleView(record)}  size={18} className="text-[red] cursor-pointer" />
          
          {/* <a><RxCross2 size={18} className='text-[red]'/></a> */}
        </Space>
      ),
    },
  ];
  
  const handleView = (value) => {
    setUser(value);
    // console.log(value)
    setIsModalOpen(true);
  };

const onSearch = (value, _e, info) => {
  console.log(info?.source, value);
  setName(value)
}
 
  return (
    <div className="">
       
      <div className="rounded-t-lg mt-[24px]">
        <div className="flex py-[22px] justify-between items-center">
          <div>

          <p className="text-header">Recent Users</p>
          </div>
          <div> 
           
          </div>
        </div>
        <Table
         
          columns={columns}
          dataSource={users?.slice(0, 5)}
          pagination = {false}
        />
      </div>
      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        closeIcon={
          <CloseOutlined
            style={{
              color: "white", // Icon color
              backgroundColor: "#de0a26", // Background color of the close icon
              borderRadius: "10%", // Rounded background
              padding: "10px", // Padding inside the background
            }}
          />
        }
      >
      <div>
        <div className="flex justify-center items-center gap-2 flex-col py-[16px] border-b border-b-gray-300">
           <h1 className="text-xl font-medium">Users Details</h1>
        </div>
        <div  className="p-[20px]">
        <div className="flex justify-between border-b mt-4 py-[16px]">
            <p>Full Name:</p>
            <p>
              {user?.fullName ? user?.fullName : "N/A"}
              
            </p>
          </div>
        
         
          <div className="flex justify-between border-b py-[16px] ">
            <p>Email:</p>
            <p>
              {user?.email ? user?.email : "N/A"}
            
            </p>
          </div>
          <div className="flex justify-between border-b py-[16px]">
            <p>StreetName:</p>
            <p>
              {user?.streetName ? user?.streetName : "N/A"}
              
            </p>
          </div>
          <div className="flex justify-between border-b py-[16px]">
            <p>Distric:</p>
            <p>
            {user?.distric ? user?.distric : "N/A"}
             
            </p>
          </div>
           
        </div>
      </div>
      </Modal>
    </div>
  );
};

export default ResentUser;
