import React from 'react';
import { useGetBannerQuery } from '../../../redux/features/banner/getBanner';
import url from '../../../redux/api/baseUrl';
import { useDeleteBannerMutation } from '../../../redux/features/banner/deleteBanner';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Banner = () => {
    const { data: banner } = useGetBannerQuery();
    console.log(banner)
   const [deleteBanner, {isLoading}] = useDeleteBannerMutation()

   const handleDelete = async(id) => {
    console.log(id)
    try{
        const res = await deleteBanner(id).unwrap();
        if(res?.code == 200){
            toast.success(res?.message)
        }
    }catch(error){
        console.log(error.data)
    }
   }

    // Check if banner data is available
    const bannerData = banner?.data?.attributes || [];

    return (
        <div className='mt-12'>
           <Toaster />
           <div className='flex justify-between items-center'>
           <h1 className='text-[20px] font-semibold py-4'>Banner Section</h1>
           <Link
                to = "addbanner"
                    className="bg-primaryBg px-4 py-2 rounded"
                >
                    Add Banner
                </Link>

           </div>
            {bannerData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    {bannerData.map((item, index) => {
                        const imageUrl = item?.image?.url;

                        return imageUrl ? (
                            <div className=" relative" key={index}>
                                <img className='h-80 w-full' src={url + imageUrl} alt={`Banner ${index}`} />
                                <button
                                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleDelete(item?._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <p key={index}>Image not available</p>
                        );
                    })}
                </div>
            ) : (
                <p>Loading banners...</p>
            )}
        </div>
    );
};

export default Banner;
