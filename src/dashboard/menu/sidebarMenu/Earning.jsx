// import { Input, Modal, DatePicker, Space, Table, Button } from "antd";
// import { BsInfoCircle } from "react-icons/bs";
// import { useState } from "react";
// import users from '../../../../public/image/users.jpg'
// import { CloseOutlined } from "@ant-design/icons";
// import styles from './style.module.css'
// import { useGetEarningQuery } from "../../../redux/features/earning/earning";
 
 
// const { Search } = Input;
 
// const dataSource = [
//     {
//       key: '1', 
//       customerName: 'Bashar Islam',
//       date: '16 Apr 2024',
//       Amount:'45',
//       Type: 'player',
//     },
//     {
//       key: '2', 
//       customerName: 'Bashar Islam',
//       date: '16 Apr 2024',
//       Amount:'45',
//       Type: 'player',
//     },
//     {
//       key: '3', 
//       customerName: 'Bashar Islam',
//       date: '16 Apr 2024',
//       Amount:'45',
//       Type: 'player',
//     },
     
// ]
// const Earning = () => {
 
//     const [isModalOpen, setIsModalOpen] = useState(false);

//  const {data: earning} = useGetEarningQuery()

//  console.log(earning)
// // const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
 
//   const columns = [
//     {
//       title: "#SI",
//       dataIndex: "si",
//       key: "si",
//       render: (text,_,index) => index + 1,
//     },
//     {
//       title: "User Name",
//       dataIndex: "customerName",
//       key: "name",
//       render: (_, record) => (
//         <div className="flex gap-2 items-center">
//           <img
//             className="w-[34px] h-[34px] rounded-full"
//             src={users}
//             alt=""
//           />
//           {/* <p className="font-medium">{record?.customerName}</p> */}
//           <p className="font-medium">AbSayed</p>
//         </div>
//       ),
//     },
   
//     {
//       title: "Type",
//       dataIndex: "Type",
//       key: "type",
//       render: (_, record) => (
//         <p>{(record?.Type) ?  record?.Type : "Apple Or Facebook User"}</p>
//       )
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'Amount',
//       key: 'phone',
//     },
//     {
//       title: "Date",
//       key: "date",
//       dataIndex: "date",
//       render: (_, record) => (
//         // <p>{record?.createdAt?.split("T")[0] ? record?.createdAt?.split("T")[0] : "N/A"}</p>
//         <p>34/04/24</p>
//       )
//     },
    
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
         
//             <BsInfoCircle  onClick={() => handleView(record)}  size={18} className="text-[red] cursor-pointer" />
          
//           {/* <a><RxCross2 size={18} className='text-[red]'/></a> */}
//         </Space>
//       ),
//     },
//   ];
  
//   const handleView = () => {
//     // setUser(value);
//     // console.log(value)
//     setIsModalOpen(true);
//   };
// //   const onChange = (date, dateString) => {
// //     console.log(date, dateString);
// //   };
// //   console.log(user);
// //   const handleChangePage = (page) => {
// //     setCurrentPage(page);
// //     console.log(page);
// //   };
// const onSearch = (value, _e, info) => console.log(info?.source, value);
// const onChange = (date, dateString) => {
//   console.log(date, dateString);
// };
//   return (
//     <div className="">
       
//       <div className="rounded-t-lg mt-[24px]">
//         <div className="flex py-[22px] justify-between items-center">
//           <div>
//           <p className="text-header">Earning</p>
//           </div>
//           <div>
//           <Space direction="vertical">
//     <DatePicker onChange={onChange} />
   
//   </Space>
//           <Search style={{
//             width:"200px",
//             marginLeft:'4px'
//           }} placeholder="input search text" onSearch={onSearch} enterButton />
//           </div>
         
          
//         </div>
//         <Table
//         pagination={{
//           total: dataSource.length,
//           showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
//           defaultPageSize: 1,
//           showSizeChanger: false,
//           itemRender: (current, type, originalElement) => {
//             if (type === 'prev') {
//               return <Button className={styles.paginationButton}>Back</Button>;
//             }
//             if (type === 'next') {
//               return <Button className={styles.paginationButton}>Next</Button>;
//             }
//             return originalElement;
//           },
//           className: styles.paginationCenter,
//         }}
//           columns={columns}
//           dataSource={dataSource}
//         />
//       </div>
//       <Modal
//         open={isModalOpen}
//         onOk={() => setIsModalOpen(false)}
//         onCancel={() => setIsModalOpen(false)}
//         footer={[]}
//         closeIcon={
//           <CloseOutlined
//             style={{
//               color: "white", // Icon color
//               backgroundColor: "#de0a26", // Background color of the close icon
//               borderRadius: "10%", // Rounded background
//               padding: "10px", // Padding inside the background
//             }}
//           />
//         }
//       >
//       <div>
//         <div className="flex justify-center items-center gap-2 flex-col border-b border-b-gray-300">
//           <p className="text-[26px] mb-[16px] font-medium">Transaction Details</p>
//         </div>
//         <div  className="p-[20px]">
//         <div className="flex justify-between border-b py-[16px]">
//             <p>Full Name:</p>
//             <p>
//               {/* {user?.name ? user?.name : "N/A"} */}
//               absayed
//             </p>
//           </div>
        
         
//           <div className="flex justify-between border-b py-[16px] ">
//             <p>Email:</p>
//             <p>
//               {/* {user?.email ? user?.email : "N/A"} */}
//               ab@gmail.com
//             </p>
//           </div>
//           <div className="flex justify-between border-b py-[16px]">
//             <p>Phone:</p>
//             <p>
//               {/* {user?.phone ? user?.phone : "N/A"} */}
//               +45269875
//             </p>
//           </div>
//           <div className="flex justify-between border-b py-[16px]">
//             <p>Date:</p>
//             <p>
//               {/* {user?.createdAt  ? user?.createdAt?.split("T")[0] : "N/A"} */}
//               23-11-24
//             </p>
//           </div>
//           <div className="flex justify-between items-center pt-[16px]">
//             <p>address:</p>
//             <p className="px-[15px] py-[10px] rounded-lg">
//               {/* Regular P550 */}
//               UK
//             </p>
//           </div>

//         </div>
//         <div className="flex items-center gap-4">
//           <button className="px-2 py-2 bg-slate-100 border-2 rounded-e-md w-[50%]">Downloard</button>
//           <button className="px-2 py-2 bg-[#193664] text-white rounded-s-md w-[50%]">Print</button>
//         </div>
//       </div>
//       </Modal>
//     </div>
//   );
// };

// export default Earning;


import { Input, Modal, DatePicker, Space, Table, Button } from "antd";
import { BsInfoCircle } from "react-icons/bs";
import { useState } from "react";
import users from '../../../../public/image/users.jpg'
import { CloseOutlined } from "@ant-design/icons";
import styles from './style.module.css'
import { useGetEarningQuery } from "../../../redux/features/earning/earning";
 
const { Search } = Input;

const Earning = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: earning } = useGetEarningQuery();

    console.log(earning); // For debugging

    const columns = [
        {
            title: "#SI",
            dataIndex: "si",
            key: "si",
            render: (text, _, index) => index + 1,
        },
        {
            title: "User Name",
            dataIndex: "customerName",
            key: "name",
            render: (_, record) => (
                <div className="flex gap-2 items-center">
                    {/* <img
                        className="w-[34px] h-[34px] rounded-full"
                        src={users}
                        alt=""
                    /> */}
                    <p className="font-medium">{record?.landlordId?.fullName || "N/A"}</p>
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "Type",
            key: "type",
            render: (_, record) => (
              <p className="font-medium">{record?.landlordId?.email || "N/A"}</p>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'Amount',
            key: 'phone',
            render: (_, record) => (
              <p className="font-medium">{record?.amount || "N/A"}</p>
            )
        },
        {
            title: 'TransactionId',
            dataIndex: 'Amount',
            key: 'phone',
            render: (_, record) => (
              <p className="font-medium">{record?.transactionId || "N/A"}</p>
            )
        },
        {
            title: 'Currency',
            dataIndex: 'Amount',
            key: 'phone',
            render: (_, record) => (
              <p className="font-medium">{record?.currency || "N/A"}</p>
            )
        },
        {
            title: 'Status',
            dataIndex: 'Amount',
            key: 'phone',
            render: (_, record) => (
              <p className="font-medium">{record?.status || "N/A"}</p>
            )
        },
        {
            title: "Date",
            key: "date",
            dataIndex: "date",
            render: (_, record) => (
              <p>{record?.createdAt?.split("T")[0] ? record?.createdAt?.split("T")[0] : "N/A"}</p>
            )
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <BsInfoCircle onClick={() => handleView(record)} size={18} className="text-[red] cursor-pointer" />
                </Space>
            ),
        },
    ];

    const handleView = (record) => {
        setIsModalOpen(true);
        // You can access other details of the record here if needed
    };

    const onSearch = (value, _e, info) => console.log(info?.source, value);
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    // Mapping the earning data for the table
    const dataSource = earning?.data?.attributes?.map((item, index) => ({
        key: item._id,
        customerName: item.landlordId?.fullName || "N/A",
        Amount: item.amount,
        Type: item.status || "N/A",
        date: item.createdAt,
    })) || [];

    return (
        <div className="">
            <div className="rounded-t-lg mt-[24px]">
                <div className="flex py-[22px] justify-between items-center">
                    <div>
                        <p className="text-header">Earning</p>
                    </div>
                    <div>
                        {/* <Space direction="vertical">
                            <DatePicker onChange={onChange} />
                        </Space> */}
                        {/* <Search style={{ width: "200px", marginLeft: '4px' }} placeholder="input search text" onSearch={onSearch} enterButton /> */}
                    </div>
                </div>
                <Table
                    pagination={{
                        total: dataSource.length,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        defaultPageSize: 10,
                        showSizeChanger: false,
                        itemRender: (current, type, originalElement) => {
                            if (type === 'prev') {
                                return <Button className={styles.paginationButton}>Back</Button>;
                            }
                            if (type === 'next') {
                                return <Button className={styles.paginationButton}>Next</Button>;
                            }
                            return originalElement;
                        },
                        className: styles.paginationCenter,
                    }}
                    columns={columns}
                    dataSource={earning?.data?.attributes}
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
                            color: "white", 
                            backgroundColor: "#de0a26", 
                            borderRadius: "10%", 
                            padding: "10px",
                        }}
                    />
                }
            >
                <div>
                    <div className="flex justify-center items-center gap-2 flex-col border-b border-b-gray-300">
                        <p className="text-[26px] mb-[16px] font-medium">Transaction Details</p>
                    </div>
                    <div className="p-[20px]">
                        <div className="flex justify-between border-b py-[16px]">
                            <p>Full Name:</p>
                            <p>{earning?.data?.landlordId?.fullName || "N/A"}</p>
                        </div>
                        <div className="flex justify-between border-b py-[16px]">
                            <p>Email:</p>
                            <p>{earning?.data?.landlordId?.email || "N/A"}</p>
                        </div>
                        <div className="flex justify-between border-b py-[16px]">
                            <p>Amount:</p>
                            <p>{earning?.data?.amount || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Earning;
