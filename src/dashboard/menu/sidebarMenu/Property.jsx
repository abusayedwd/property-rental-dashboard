
// import React, { useEffect } from "react";
// import { Button, Tag } from "antd"; 
// import { useGetPromotedPropertiesQuery } from "../../../redux/features/property/getPromotinProperty";
// import url from "../../../redux/api/baseUrl";
// import { AppstoreAddOutlined, EnvironmentOutlined, HomeOutlined } from "@ant-design/icons"; 
// import { useDeletepropertyMutation } from "../../../redux/features/property/deleteProperty";
// import toast, { Toaster } from "react-hot-toast";


// const Property = () => {
 
//  const { data: propertiess, isLoading } = useGetPromotedPropertiesQuery()
 
//    const [deleteProperty] = useDeletepropertyMutation()
 
// const properties = propertiess?.data?.attributes?.results || [];

//  const propertyDelete = async(id) => {
//      console.log(id)
//      try{
//       const res = await deleteProperty(id).unwrap();
//       if(res?.code == 200){
//         toast.success(res?.message)
//       }
//      }catch(error){
//       console.log(error)
//      }
//  }
 
 
//   return (
//     <div className="container mt-12 md:mt-16">
//     <Toaster />
//    <h1 className="text-[32px] mb-4">Property</h1>


//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {isLoading ? (
//           <p className="text-center text-gray-500">Loading properties...</p>
//         ) : properties?.length === 0 ? (
//           <p className="text-center text-gray-500">No properties found.</p>
//         ) : (
//           properties?.map((property) => (
//             <div
//               key={property.id}
//               className="border rounded-lg shadow-md overflow-hidden bg-white"
//             >
//               {/* Image Section */}
//               <div className="relative">
//                 <img
//                   src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
//                   alt={property.houseName}
//                   className="w-full h-[200px] object-cover"
//                 />
//                 <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
//                   {property.propertyType === "sell" ? "For Sale" : "For Rent"}
//                 </Tag>
//               </div>

//               {/* Content Section */}
//               <div className="p-4 bg-green-50">
//                 {/* Title */}
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-lg font-bold text-gray-800 mb-1">
//                     {property.houseName || "Unnamed Property"}
//                   </h2>
//                 </div>

//                 {/* Address */}
//                 <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
//                   <EnvironmentOutlined />
//                   {property.place || "No address provided"}
//                 </p>

//                 {/* Price and Type */}
//                 <div className="flex justify-between items-center mb-3">
//                   <p className="text-green-600 font-bold text-xl">
//                     ${property.price || "N/A"}
//                   </p>
//                   <div className="text-gray-500 text-sm flex items-center gap-1">
//                     <HomeOutlined />
//                     Type: {property.type || "N/A"}
//                   </div>
//                   <div className="text-gray-500 text-sm">
//                     {property.state || "N/A"}, {property.subState || ""}
//                   </div>
//                 </div>

//                 {/* Property Details */}
//                 <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
//                   <div className="flex items-center gap-1">
//                     <AppstoreAddOutlined />
//                     Rooms: {property?.rooms || "N/A"}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <AppstoreAddOutlined />
//                     Baths: {property.baths || "N/A"}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <AppstoreAddOutlined />
//                     State: {property.state || "N/A"}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}

//                 <div className="flex gap-3">
//                   <button
//                     className="px-2 py-1 bg-primaryBg !text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
//                     onClick={() => propertyDelete(property?.id)  }
//                   >
//                     Delete
//                   </button>
//                 </div>

//               </div>
//             </div>
//           ))
//         )}
//       </div>



      
//     </div>
//   );
// };

// export default Property;

import React, { useState } from "react";
import { Button, Tag, Select, Pagination, Input, Slider } from "antd";
import { useGetPromotedPropertiesQuery } from "../../../redux/features/property/getPromotinProperty";
import url from "../../../redux/api/baseUrl";
import { AppstoreAddOutlined, EnvironmentOutlined, HomeOutlined, FilterOutlined } from "@ant-design/icons";
import { useDeletepropertyMutation } from "../../../redux/features/property/deleteProperty";
import toast, { Toaster } from "react-hot-toast";

const { Option } = Select;

const Property = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    place: '',
    propertyType: '',
    type: '',
    rooms: null,
    baths: null,
    priceRange: [0, 1000000],
  });
  
  const pageSize = 10;

  const { data: propertiess, isLoading } = useGetPromotedPropertiesQuery();
  const [deleteProperty] = useDeletepropertyMutation();

  let properties = propertiess?.data?.attributes?.results || [];

  // Filter properties
  const filterProperties = (data) => {
    return data.filter(property => {
      const matchesPlace = !filters.place || 
        property.place?.toLowerCase().includes(filters.place.toLowerCase());
      
      const matchesPropertyType = !filters.propertyType || 
        property.propertyType === filters.propertyType;
      
      const matchesType = !filters.type || 
        property.type === filters.type;
      
      const matchesRooms = !filters.rooms || 
        property.rooms === filters.rooms;
      
      const matchesBaths = !filters.baths || 
        property.baths === filters.baths;
      
      const matchesPrice = property.price >= filters.priceRange[0] && 
        property.price <= filters.priceRange[1];

      return matchesPlace && matchesPropertyType && matchesType && 
        matchesRooms && matchesBaths && matchesPrice;
    });
  };

  // Sort properties
  const sortProperties = (data) => {
    return [...data].sort((a, b) => {
      if (sortField === 'price' || sortField === 'rooms' || sortField === 'baths') {
        return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
      }
      return sortOrder === 'asc' 
        ? (a[sortField] || '').localeCompare(b[sortField] || '')
        : (b[sortField] || '').localeCompare(a[sortField] || '');
    });
  };

  // Apply filters and sorting
  properties = sortProperties(filterProperties(properties));
  
  // Apply pagination
  const paginatedProperties = properties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const propertyDelete = async(id) => {
    try {
      const res = await deleteProperty(id).unwrap();
      if(res?.code == 200) {
        toast.success(res?.message);
      }
    } catch(error) {
      console.log(error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="container mt-12 md:mt-16">
      <Toaster />
      
      {/* Header and Controls */}
      <div className="mb-8">
        <h1 className="text-[32px] mb-6">Property</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow mb-6">
          <Input
            placeholder="Search by place"
            value={filters.place}
            onChange={(e) => handleFilterChange('place', e.target.value)}
            prefix={<FilterOutlined />}
          />
          
          <Select
            placeholder="Property Type"
            style={{ width: '100%' }}
            value={filters.propertyType}
            onChange={(value) => handleFilterChange('propertyType', value)}
            allowClear
          >
            <Option value="sell">For Sale</Option>
            <Option value="rent">For Rent</Option>
          </Select>
          
          <Select
            placeholder="Type"
            style={{ width: '100%' }}
            value={filters.type}
            onChange={(value) => handleFilterChange('type', value)}
            allowClear
          >
            <Option value="duplex">Duplex</Option>
              <Option value="bungalow">Bungalow</Option>
              <Option value="studio">Studio</Option>
              <Option value="flat">Flat</Option>
              <Option value="self-con">Self-con</Option>
              <Option value="warehouse">Warehouse</Option>
              <Option value="other">Other</Option>
          </Select>
          
          <Select
            placeholder="Number of Rooms"
            style={{ width: '100%' }}
            value={filters.rooms}
            onChange={(value) => handleFilterChange('rooms', value)}
            allowClear
          >
            {[1, 2, 3, 4, 5, 6,7,8,9,10].map(num => (
              <Option key={num} value={num}>{num} Rooms</Option>
            ))}
          </Select>
          
          <Select
            placeholder="Number of Baths"
            style={{ width: '100%' }}
            value={filters.baths}
            onChange={(value) => handleFilterChange('baths', value)}
            allowClear
          >
            {[1, 2, 3, 4, 5, 6,7,8,9,10].map(num => (
              <Option key={num} value={num}>{num} Baths</Option>
            ))}
          </Select>
          
          <div className="flex flex-col">
            <span className="mb-2">Price Range</span>
            <Slider
              range
              value={filters.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
              min={0}
              max={1000000}
              step={1000}
              tipFormatter={(value) => `$${value.toLocaleString()}`}
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-4 items-center">
          <Select
            value={sortField}
            style={{ width: 120 }}
            onChange={(value) => setSortField(value)}
          >
            <Option value="place">Place</Option>
            <Option value="rooms">Rooms</Option>
            <Option value="baths">Baths</Option>
            <Option value="price">Price</Option>
          </Select>
          
          <Select
            value={sortOrder}
            style={{ width: 120 }}
            onChange={(value) => setSortOrder(value)}
          >
            <Option value="asc">Ascending</Option>
            <Option value="desc">Descending</Option>
          </Select>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : paginatedProperties.length === 0 ? (
          <p className="text-center text-gray-500">No properties found.</p>
        ) : (
          paginatedProperties.map((property) => (
            <div
              key={property.id}
              className="border rounded-lg shadow-md overflow-hidden bg-white"
            >
              <div className="relative">
                <img
                  src={property?.images ? url + property.images[0]?.url : "/images/default-home.png"}
                  alt={property.houseName}
                  className="w-full h-48 object-cover"
                />
                <Tag color="red" className="absolute top-2 left-2 px-3 py-1 text-sm font-semibold">
                  {property.propertyType === "sell" ? "For Sale" : "For Rent"}
                </Tag>
              </div>

              <div className="p-4 bg-green-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {property.houseName || "Unnamed Property"}
                  </h2>
                </div>

                <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                  <EnvironmentOutlined />
                  Place: {property.place || "No address provided"}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <p className="text-green-600 font-bold text-xl">
                    Price: ₦{property.price?.toLocaleString() || "N/A"}
                  </p>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <HomeOutlined />
                    Type: {property.type || "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <AppstoreAddOutlined />
                    Rooms: {property?.rooms || "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <AppstoreAddOutlined />
                    Baths: {property.baths || "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <AppstoreAddOutlined />
                    State: {property.state || "N/A"}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    className="px-2 py-1 bg-[#FF0000] !text-[#FFFFFF] rounded-lg hover:bg-blue-600 transition-all duration-300"
                    onClick={() => propertyDelete(property?.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          current={currentPage}
          total={properties.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Property;