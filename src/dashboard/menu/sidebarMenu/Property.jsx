
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
import { Button, Tag, Select, Pagination, Input, Slider, Modal, Segmented, Image } from "antd";
import { useGetAdminPropertiesQuery, useModeratePropertyMutation } from "../../../redux/features/property/adminProperties";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineFlag, HiOutlineTrash, HiOutlineMapPin, HiOutlineCheck, HiOutlineXMark, HiOutlineDocumentText, HiOutlineShieldCheck } from "react-icons/hi2";
import url from "../../../redux/api/baseUrl";
import { AppstoreAddOutlined, EnvironmentOutlined, HomeOutlined, FilterOutlined } from "@ant-design/icons";
import { useDeletepropertyMutation } from "../../../redux/features/property/deleteProperty";
import toast, { Toaster } from "react-hot-toast";
import { mediaUrl } from "../../../utils/media";
// Slider top (৳5 crore); selecting it means "no upper limit"
const MAX_PRICE = 50000000;

const reviewOf = (p) => p.moderation?.status || "active";
const AMENITY_LABELS = { gas: "Gas line", lift: "Lift", generator: "Generator", parking: "Parking", security: "Security guard", cctv: "CCTV", wifi: "Wi-Fi ready", balcony: "Balcony", water: "24h water", rooftop: "Rooftop", gym: "Gym", pool: "Pool" };
const cap = (v) => (v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : "—");
const taka = (n) => (n || n === 0 ? `৳${Number(String(n).replace(/,/g, "")).toLocaleString("en-IN")}` : "—");

// Everything an admin needs to judge a listing before approving it
const ListingPreview = ({ property, onClose }) => {
  if (!property) return null;
  const rows = [
    ["Price", `${taka(property.price)}${property.propertyType === "rent" ? " /month" : ""}${property.negotiable ? " (negotiable)" : ""}`],
    ["Advance", property.advanceMonths != null ? `${property.advanceMonths} months` : "—"],
    ["Service charge", property.serviceCharge ? taka(property.serviceCharge) : "—"],
    ["Type", cap(property.type)],
    ["Suitable for", cap(property.tenantType || "any")],
    ["Beds / baths", `${property.rooms ?? 0} / ${property.baths ?? 0}`],
    ["Size", property.sizeSqft ? `${property.sizeSqft} sq ft` : "—"],
    ["Floor", property.floor || "—"],
    ["Furnishing", cap(property.furnishing)],
    ["Address", [property.place, property.subState, property.state].filter(Boolean).join(", ")],
    ["Map pin", property.location?.coordinates ? `${property.location.coordinates[1]}, ${property.location.coordinates[0]}` : "Not set"],
    ["Owner", `${property.landlordId?.fullName || "—"} (${property.landlordId?.email || "no email"})`],
  ];
  return (
    <Modal open onCancel={onClose} footer={null} width={760} centered title={property.houseName}>
      <Image.PreviewGroup>
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {(property.images || []).map((img, i) => (
            <Image key={img._id || i} src={mediaUrl(img.url)} width={150} height={110} className="rounded-lg object-cover" />
          ))}
        </div>
      </Image.PreviewGroup>
      <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-gray-100 py-2 text-sm">
            <dt className="text-gray-500">{k}</dt>
            <dd className="text-right font-medium text-gray-800">{v}</dd>
          </div>
        ))}
      </dl>
      {property.amenities?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {property.amenities.map((a) => <Tag key={a}>{AMENITY_LABELS[a] || a}</Tag>)}
        </div>
      )}
      <p className="mt-4 whitespace-pre-line rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{property.textArea || "No description"}</p>
      {property.location?.coordinates && (
        <a
          className="mt-3 inline-block text-sm text-primaryBg underline"
          href={`https://www.google.com/maps?q=${property.location.coordinates[1]},${property.location.coordinates[0]}`}
          target="_blank"
          rel="noreferrer"
        >
          Check the pin on Google Maps
        </a>
      )}
    </Modal>
  );
};

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
  const [reviewTab, setReviewTab] = useState("all");
  const [preview, setPreview] = useState(null);

  const allProperties = propertiess?.data?.attributes || [];
  const reviewCounts = allProperties.reduce((acc, p) => ({ ...acc, [reviewOf(p)]: (acc[reviewOf(p)] || 0) + 1 }), {});
  let properties = reviewTab === "all" ? allProperties : allProperties.filter((p) => reviewOf(p) === reviewTab);

  // Approve a waiting listing, or reject it with a reason the owner sees
  const decide = (property, approve) => {
    let reason = "";
    Modal.confirm({
      title: approve ? "Approve this listing?" : "Reject this listing?",
      content: approve ? (
        "It goes live on the website, the owner is notified, and members with matching saved searches get an alert."
      ) : (
        <div>
          <p className="mb-2 text-gray-500">The owner is notified and can edit the listing to send it again.</p>
          <Input.TextArea rows={2} maxLength={300} placeholder="What needs fixing? e.g. photos are not of this flat" onChange={(e) => (reason = e.target.value)} />
        </div>
      ),
      okText: approve ? "Approve" : "Reject",
      okButtonProps: { danger: !approve },
      centered: true,
      onOk: async () => {
        try {
          await moderateProperty({ id: property.id, status: approve ? "active" : "rejected", reason: reason.trim() || undefined }).unwrap();
          toast.success(approve ? "Listing approved and live" : "Listing rejected");
        } catch (error) {
          toast.error(error?.data?.message || "Could not update the listing");
        }
      },
    });
  };

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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[32px]">Property</h1>
          <Segmented
            value={reviewTab}
            onChange={(v) => {
              setReviewTab(v);
              setCurrentPage(1);
            }}
            options={[
              { value: "all", label: `All (${allProperties.length})` },
              { value: "pending", label: `Waiting for review (${reviewCounts.pending || 0})` },
              { value: "active", label: `Live (${reviewCounts.active || 0})` },
              { value: "rejected", label: `Rejected (${reviewCounts.rejected || 0})` },
              { value: "hidden", label: `Hidden (${reviewCounts.hidden || 0})` },
            ]}
          />
        </div>
        
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
            {["flat", "duplex", "house", "bungalow", "studio", "room", "seat", "office", "shop", "plot", "warehouse", "other"].map((t) => (
              <Option key={t} value={t} className="capitalize">{t}</Option>
            ))}
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
              tooltip={{ formatter: (value) => `৳${value.toLocaleString("en-IN")}${value >= MAX_PRICE ? "+" : ""}` }}
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
            const review = reviewOf(property);
            const hidden = review === "hidden";
            const waiting = review === "pending" || review === "rejected";
            const closed = ["sold", "rented"].includes(property.propertyType);
            return (
              <div key={property.id} className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-card ${hidden || review === "rejected" ? "border-red-200" : review === "pending" ? "border-amber-300" : "border-gray-100"}`}>
                <div className="relative">
                  <img
                    src={mediaUrl(property?.images?.[0]?.url) || "/image/service.jpg"}
                    alt={property.houseName}
                    className={`h-44 w-full object-cover ${hidden ? "opacity-50 grayscale" : ""}`}
                  />
                  <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    <Tag color={closed ? "default" : property.propertyType === "sell" ? "blue" : "green"} className="!m-0">
                      {{ sell: "For Sale", rent: "For Rent", sold: "Sold", rented: "Rented" }[property.propertyType] || property.propertyType}
                    </Tag>
                    {property.isPromotion && <Tag color="gold" className="!m-0">Featured</Tag>}
                    {hidden && <Tag color="red" className="!m-0">Hidden</Tag>}
                    {review === "pending" && <Tag color="orange" className="!m-0">Waiting for review</Tag>}
                    {review === "rejected" && <Tag color="red" className="!m-0">Rejected</Tag>}
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
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <span className="line-clamp-1">Owner: {property.landlordId?.fullName || "—"}</span>
                    {property.landlordId?.isVerifiedOwner && <HiOutlineShieldCheck className="shrink-0 text-green-600" title="Verified owner" />}
                  </p>
                  <button type="button" onClick={() => setPreview(property)} className="mt-2 flex items-center gap-1 self-start text-xs font-medium text-primaryBg hover:underline">
                    <HiOutlineDocumentText size={14} /> View full details
                  </button>
                  {(hidden || review === "rejected") && property.moderation?.reason && (
                    <p className="mt-2 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600">Reason: {property.moderation.reason}</p>
                  )}

                  <div className="mt-auto flex gap-2 pt-4">
                    {waiting ? (
                      <>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => decide(property, true)}
                          icon={<HiOutlineCheck size={14} />}
                          className="!flex flex-1 items-center justify-center !bg-primaryBg"
                        >
                          Approve
                        </Button>
                        {review === "pending" && (
                          <Button size="small" danger onClick={() => decide(property, false)} icon={<HiOutlineXMark size={14} />} className="!flex flex-1 items-center justify-center">
                            Reject
                          </Button>
                        )}
                      </>
                    ) : (
                    <Button
                      size="small"
                      onClick={() => toggleVisibility(property)}
                      icon={hidden ? <HiOutlineEye size={14} /> : <HiOutlineEyeSlash size={14} />}
                      className="!flex flex-1 items-center justify-center"
                    >
                      {hidden ? "Show" : "Hide"}
                    </Button>
                    )}
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

      <ListingPreview property={preview} onClose={() => setPreview(null)} />

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