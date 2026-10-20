
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
import { Button, Tag, Select, Pagination, Input, Slider, Modal } from "antd";
import { useGetAdminPropertiesQuery, useModeratePropertyMutation } from "../../../redux/features/property/adminProperties";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineFlag, HiOutlineTrash, HiOutlineMapPin } from "react-icons/hi2";
import url from "../../../redux/api/baseUrl";
import { AppstoreAddOutlined, EnvironmentOutlined, HomeOutlined, FilterOutlined } from "@ant-design/icons";
import { useDeletepropertyMutation } from "../../../redux/features/property/deleteProperty";
import toast, { Toaster } from "react-hot-toast";
// Slider top (৳5 crore); selecting it means "no upper limit"
const MAX_PRICE = 50000000;

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
    priceRange: [0, MAX_PRICE],
  });
  
  const pageSize = 10;

  // Every listing (not only promoted ones), including listings hidden by an admin
  const { data: propertiess, isLoading } = useGetAdminPropertiesQuery();
  const [deleteProperty] = useDeletepropertyMutation();
  const [moderateProperty] = useModeratePropertyMutation();

  let properties = propertiess?.data?.attributes || [];

  const toggleVisibility = (property) => {
    const hide = property.moderation?.status !== "hidden";
    let reason = "";
    Modal.confirm({
      title: hide ? "Hide this listing?" : "Show this listing again?",
      content: hide ? (
        <div>
          <p className="mb-2 text-gray-500">It will disappear from the website. The owner is notified.</p>
          <Input.TextArea rows={2} maxLength={300} placeholder="Reason shown to the owner (optional)" onChange={(e) => (reason = e.target.value)} />
        </div>
      ) : (
        "It will be visible on the website again and the owner is notified."
      ),
      okText: hide ? "Hide listing" : "Show listing",
      okButtonProps: { danger: hide },
      centered: true,
      onOk: async () => {
        try {
          await moderateProperty({ id: property.id, status: hide ? "hidden" : "active", reason: reason.trim() || undefined }).unwrap();
          toast.success(hide ? "Listing hidden" : "Listing visible again");
        } catch (error) {
          toast.error(error?.data?.message || "Could not update the listing");
        }
      },
    });
  };

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
      
      const price = Number(String(property.price ?? "").replace(/,/g, "")) || 0;
      // The top of the slider means "no upper limit"
      const matchesPrice = price >= filters.priceRange[0] &&
        (filters.priceRange[1] >= MAX_PRICE || price <= filters.priceRange[1]);

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

  // Deleting is permanent, so ask first
  const propertyDelete = (id) => {
    Modal.confirm({
      title: "Delete this listing permanently?",
      content: "This can't be undone. Consider hiding it instead.",
      okText: "Delete",
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          const res = await deleteProperty(id).unwrap();
          toast.success(res?.message || "Listing deleted");
        } catch (error) {
          toast.error(error?.data?.message || "Could not delete the listing");
        }
      },
    });
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
              max={MAX_PRICE}
              step={50000}
              tipFormatter={(value) => `৳${value.toLocaleString("en-IN")}${value >= MAX_PRICE ? "+" : ""}`}
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
          paginatedProperties.map((property) => {
            const hidden = property.moderation?.status === "hidden";
            const closed = ["sold", "rented"].includes(property.propertyType);
            return (
              <div key={property.id} className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-card ${hidden ? "border-red-200" : "border-gray-100"}`}>
                <div className="relative">
                  <img
                    src={property?.images?.[0]?.url ? url + property.images[0].url : "/image/service.jpg"}
                    alt={property.houseName}
                    className={`h-44 w-full object-cover ${hidden ? "opacity-50 grayscale" : ""}`}
                  />
                  <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    <Tag color={closed ? "default" : property.propertyType === "sell" ? "blue" : "green"} className="!m-0">
                      {{ sell: "For Sale", rent: "For Rent", sold: "Sold", rented: "Rented" }[property.propertyType] || property.propertyType}
                    </Tag>
                    {property.isPromotion && <Tag color="gold" className="!m-0">Featured</Tag>}
                    {hidden && <Tag color="red" className="!m-0">Hidden</Tag>}
                  </div>
                  {property.openReports > 0 && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                      <HiOutlineFlag size={12} /> {property.openReports}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-lg font-bold text-gray-900">
                    {property.price ? `৳${Number(String(property.price).replace(/,/g, "")).toLocaleString("en-IN")}` : "N/A"}
                  </p>
                  <h2 className="line-clamp-1 font-semibold text-gray-800">{property.houseName || "Unnamed property"}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlineMapPin size={14} className="shrink-0" />
                    <span className="line-clamp-1">{[property.subState, property.state].filter(Boolean).join(", ") || property.place || "—"}</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {property.rooms ?? 0} beds · {property.baths ?? 0} baths · <span className="capitalize">{property.type || "—"}</span> · {property.views ?? 0} views
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-gray-400">Owner: {property.landlordId?.fullName || "—"}</p>
                  {hidden && property.moderation?.reason && (
                    <p className="mt-2 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600">Reason: {property.moderation.reason}</p>
                  )}

                  <div className="mt-auto flex gap-2 pt-4">
                    <Button
                      size="small"
                      onClick={() => toggleVisibility(property)}
                      icon={hidden ? <HiOutlineEye size={14} /> : <HiOutlineEyeSlash size={14} />}
                      className="!flex flex-1 items-center justify-center"
                    >
                      {hidden ? "Show" : "Hide"}
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<HiOutlineTrash size={14} />}
                      onClick={() => propertyDelete(property?.id)}
                      className="!flex flex-1 items-center justify-center"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
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