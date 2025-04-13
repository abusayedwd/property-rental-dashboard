 

import React, { useState, useEffect } from 'react'; 
import { useGetBannerQuery } from '../../../redux/features/banner/getBanner'; 
import url from '../../../redux/api/baseUrl'; 
import { useDeleteBannerMutation } from '../../../redux/features/banner/deleteBanner'; 
import toast, { Toaster } from 'react-hot-toast'; 
import { Link } from 'react-router-dom'; 
import bannerr from "./../../../../public/image/nodata.png";
import { Skeleton } from 'antd';
 
const Banner = () => { 
    const { data: banner, isLoading: isDataLoading } = useGetBannerQuery(); 
    const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
    
    // State to control minimum loading time
    const [isLoading, setIsLoading] = useState(true);
    
    // Set minimum loading time of 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 3 seconds
        
        return () => clearTimeout(timer);
    }, []);
    
    // Combined loading state - either actual data loading or forced loading
    const showLoading = isLoading || isDataLoading;
 
    const handleDelete = async(id) => { 
        console.log(id); 
        try { 
            const res = await deleteBanner(id).unwrap(); 
            if(res?.code == 200){ 
                toast.success(res?.message); 
            } 
        } catch(error) { 
            console.log(error.data); 
            toast.error("Failed to delete banner"); 
        } 
    }; 
 
    // Check if banner data is available 
    const bannerData = banner?.data?.attributes || []; 
    const noBanners = !showLoading && (!bannerData || bannerData.length === 0); 
 
    return ( 
        <div className='mt-12'> 
            <Toaster /> 
            <div className='flex justify-between items-center'> 
                <h1 className='text-[20px] font-semibold py-4'>Banner Section</h1> 
                <Link 
                    to="addbanner" 
                    className="bg-primaryBg px-4 py-2 rounded" 
                > 
                    Add Banner 
                </Link> 
            </div> 
             
            {showLoading ? ( 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-80">
                        <Skeleton.Image active style={{ width: '100%', height: '320px' }} />
                    </div>
                    <div className="h-80">
                        <Skeleton.Image active style={{ width: '100%', height: '320px' }} />
                    </div>
                </div>
            ) : noBanners ? ( 
                <div className="flex flex-col items-center justify-center py-12"> 
                    <img  
                        src={bannerr}  
                        alt="No banners available"  
                        className="w-64 h-64 mb-4 animate-bounce"  
                    /> 
                    <p className="text-xl text-gray-500 font-medium">No banners available</p>
                    <p className="text-gray-400 mt-2">Add a new banner to display here</p> 
                </div> 
            ) : ( 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    {bannerData.map((item, index) => { 
                        const imageUrl = item?.image?.url; 
 
                        return imageUrl ? ( 
                            <div className="relative" key={index}> 
                                <img className='h-80 w-full object-cover' src={url + imageUrl} alt={`Banner ${index}`} /> 
                                <button 
                                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded" 
                                    onClick={() => handleDelete(item?._id)} 
                                    disabled={isDeleting} 
                                > 
                                    {isDeleting ? "Deleting..." : "Delete"} 
                                </button> 
                            </div> 
                        ) : ( 
                            <p key={index}>Image not available</p> 
                        ); 
                    })} 
                </div> 
            )} 
        </div> 
    ); 
}; 
 
export default Banner;


// import React, { useEffect, useState } from 'react';
// import { useGetBannerQuery } from '../../../redux/features/banner/getBanner';
// import url from '../../../redux/api/baseUrl';
// import { useDeleteBannerMutation } from '../../../redux/features/banner/deleteBanner';
// import toast, { Toaster } from 'react-hot-toast';
// import { Link } from 'react-router-dom';
// import { Skeleton } from 'antd';  // Importing Ant Design's Skeleton
// import bannerr from "./../../../../public/image/nodata.png"

// const Banner = () => {
//     const { data: banner, isLoading } = useGetBannerQuery();
//     console.log(banner);
//     const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

//     const [isDelayed, setIsDelayed] = useState(false);  // New state for handling the 3-second delay

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setIsDelayed(true);  // Set delayed state after 3 seconds
//         }, 3000);

//         return () => clearTimeout(timer);  // Clean up the timeout on component unmount
//     }, []);

//     const handleDelete = async(id) => {
//         console.log(id);
//         try {
//             const res = await deleteBanner(id).unwrap();
//             if(res?.code == 200){
//                 toast.success(res?.message);
//             }
//         } catch(error) {
//             console.log(error.data);
//             toast.error("Failed to delete banner");
//         }
//     };

//     // Check if banner data is available
//     const bannerData = banner?.data?.attributes || [];
//     const noBanners = !isLoading && (!bannerData || bannerData.length === 0);

//     return (
//         <div className='mt-12'>
//             <Toaster />
//             <div className='flex justify-between items-center'>
//                 <h1 className='text-[20px] font-semibold py-4'>Banner Section</h1>
//                 <Link
//                     to="addbanner"
//                     className="bg-primaryBg px-4 py-2 rounded"
//                 >
//                     Add Banner
//                 </Link>
//             </div>

//             {isLoading || !isDelayed ? (
//                 // Skeleton loader for the entire page while data is loading or if the delay hasn't passed
//                 <Skeleton active paragraph={{ rows: 4 }} />
//             ) : noBanners ? (
//                 <div className="flex flex-col items-center justify-center py-12">
//                     <img 
//                         src={bannerr} 
//                         alt="No banners available" 
//                         className="w-64 h-64 mb-4 animate-bounce" 
//                     />
//                     <p className="text-gray-400 mt-2">Add a new banner to display here</p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {bannerData.map((item, index) => {
//                         const imageUrl = item?.image?.url;

//                         return imageUrl ? (
//                             <div className="relative" key={index}>
//                                 <img className='h-80 w-full object-cover' src={url + imageUrl} alt={`Banner ${index}`} />
//                                 <button
//                                     className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
//                                     onClick={() => handleDelete(item?._id)}
//                                     disabled={isDeleting}
//                                 >
//                                     {isDeleting ? "Deleting..." : "Delete"}
//                                 </button>
//                             </div>
//                         ) : (
//                             <p key={index}>Image not available</p>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Banner;
