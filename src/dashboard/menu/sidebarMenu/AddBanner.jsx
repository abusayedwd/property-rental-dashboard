// import React, { useState } from 'react';
// import { Upload, message, Button, Image } from 'antd';
// import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
// import { useAddBannerMutation } from '../../../redux/features/banner/benner';
// import { useNavigate } from 'react-router-dom';

// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

// const AddBanner = () => {
//     const navigate = useNavigate()
//   const [fileList, setFileList] = useState([]);
//   const [addBanner] = useAddBannerMutation();
//   const [loading, setLoading] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//   };

//   const handleChange = ({ fileList: newFileList }) => {
//     // Allow only one file in the list
//     if (newFileList.length > 1) {
//       newFileList = [newFileList[0]]; // Keep only the first file
//     }
//     setFileList(newFileList);
//   };

//   const uploadButton = (
//     <div>
//       {loading ? <LoadingOutlined /> : <PlusOutlined />}
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </div>
//   );

//   const handleUpload = async () => {
//     if (fileList.length === 0) {
//       message.error('Please upload an image');
//       return;
//     }

//     const file = fileList[0];
//     const formData = new FormData();
//     formData.append('image', file.originFileObj); // Attach the file for upload

//     setLoading(true);
//     try {
//      const res =  await addBanner(formData).unwrap(); // Trigger the add banner mutation
//      if(res?.code === 200){
//          message.success('Banner added successfully');
//          setFileList([]);  
//         setTimeout(() => {
//             navigate('/dashboard/banner')
//         }, 1000);
//      }
//     } catch (error) {
//       message.error('Failed to add banner');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold text-center mb-4">Add Banner</h2>

//         <div className="mb-4 flex justify-center">
//           <Upload
//             listType="picture-card"
//             fileList={fileList}
//             onPreview={handlePreview}
//             onChange={handleChange}
//             className='w-44'
//             beforeUpload={() => false} // Prevent auto upload
//           >
//             {fileList.length === 0 ? uploadButton : null}
//           </Upload>
//           {previewImage && (
//             <Image
//               width={300}
//               preview={{
//                 visible: previewOpen,
//                 onVisibleChange: (visible) => setPreviewOpen(visible),
//               }}
//               src={previewImage}
//             />
//           )}
//         </div>

//         <div className="mt-4">
//           <Button
//             type="primary"
//             className="w-full bg-green-500 text-white"
//             onClick={handleUpload}
//             disabled={loading || fileList.length === 0} // Disable if loading or no image uploaded
//           >
//             {loading ? 'Uploading...' : 'Upload Banner'}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddBanner;


import React, { useState } from 'react';
import { Upload, message, Button, Image, Input } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAddBannerMutation } from '../../../redux/features/banner/benner';
import { useNavigate } from 'react-router-dom';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddBanner = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [addBanner] = useAddBannerMutation();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [link, setLink] = useState(''); // State for the link

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Allow only one file in the list
    if (newFileList.length > 1) {
      newFileList = [newFileList[0]]; // Keep only the first file
    }
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please upload an image');
      return;
    }

    const file = fileList[0];
    const formData = new FormData();
    formData.append('image', file.originFileObj); // Attach the file for upload
    formData.append('link', link); // Append the link value

    setLoading(true);
    try {
      const res = await addBanner(formData).unwrap(); // Trigger the add banner mutation
      if (res?.code === 200) {
        message.success('Banner added successfully');
        setFileList([]);
        setLink(''); // Reset the link field
        setTimeout(() => {
          navigate('/dashboard/banner');
        }, 1000);
      }
    } catch (error) {
      message.error('Failed to add banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[500px]">
      <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Add Banner</h2>

        <div className="mb-4 flex justify-center">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            className='w-44'
            beforeUpload={() => false} // Prevent auto upload
          >
            {fileList.length === 0 ? uploadButton : null}
          </Upload>
          {previewImage && (
            <Image
              width={300}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
              }}
              src={previewImage}
            />
          )}
        </div>

        <div className="mb-4">
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)} // Update the link state
            placeholder="Enter banner link"
            className="w-full mt-2"
          />
        </div>

        <div className="mt-4">
          <Button
            type="primary"
            className="w-full bg-green-500 text-white"
            onClick={handleUpload}
            disabled={loading || fileList.length === 0} // Disable if loading or no image uploaded
          >
            {loading ? 'Uploading...' : 'Upload Banner'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;
