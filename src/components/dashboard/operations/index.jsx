"use client";

import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { useState, useRef } from "react";
import { getAllCustomers } from "@/data/users";
import { photoCollections } from "@/data/photoCollections";
import {
  Upload,
  Pencil,
  Save,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Crop,
  SlidersHorizontal,
  Filter,
  RotateCw,
  X,
  Image,
  FolderOpen,
  User,
  Plus,
  Users,
  Video,
  BookOpen,
  Search,
} from "lucide-react";

const OperationsIndex = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditImage, setCurrentEditImage] = useState(null);
  const [editHistory, setEditHistory] = useState([]);
  const [collapsedImages, setCollapsedImages] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid"); // grid, list, masonry
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showCustomerSelection, setShowCustomerSelection] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    description: "",
    type: "photo",
    customerName: "",
    customerId: "",
    photographer: "",
    location: "",
    tags: "",
    isNewCustomer: false,
    individualTitles: {},
  });
  const [existingCustomers, setExistingCustomers] = useState(getAllCustomers());
  const fileInputRef = useRef(null);
  const [mediaTab, setMediaTab] = useState("photo"); // 'photo', 'video', 'flipbook'
  const [mediaSearch, setMediaSearch] = useState("");

  // Get customer collections from photoCollections data
  const getCustomerCollections = (customerId) => {
    return photoCollections.filter((collection) => collection.customerId === customerId);
  };

  // Get customer media from collections
  const getCustomerMedia = (customerId) => {
    const collections = getCustomerCollections(customerId);
    const allMedia = [];

    collections.forEach((collection) => {
      collection.mediaList.forEach((media) => {
        allMedia.push({
          ...media,
          collectionId: collection.id,
          collectionTitle: collection.title,
          customerId: collection.customerId,
          customerName: collection.customerName,
          uploadDate: new Date(collection.date),
          size: 0, // Default size for existing media
          type: "image/jpeg", // Default type
          edits: [],
          isSelected: false,
          isCollapsed: false,
        });
      });
    });

    return allMedia;
  };

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSelection(false);
    setUploadFormData((prev) => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      isNewCustomer: false,
    }));
  };

  // Handle new customer creation
  const handleCreateCustomer = (customerName) => {
    const newCustomer = {
      id: Date.now(),
      name: customerName,
      email: `${customerName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      type: "customer",
    };
    setExistingCustomers((prev) => [...prev, newCustomer]);
    setSelectedCustomer(newCustomer);
    setShowCustomerSelection(false);
    setUploadFormData((prev) => ({
      ...prev,
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      isNewCustomer: false,
    }));
  };

  // Handle back to customer selection
  const handleBackToCustomerSelection = () => {
    setSelectedCustomer(null);
    setShowCustomerSelection(true);
    setShowUploadForm(false);
    setSelectedFiles([]);
    setUploadFormData({
      title: "",
      description: "",
      type: "photo",
      customerName: "",
      customerId: "",
      photographer: "",
      location: "",
      tags: "",
      isNewCustomer: false,
      individualTitles: {},
    });
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      setSelectedFiles(imageFiles);
      setShowUploadForm(true);
    }
  };

  // Handle form submission
  const handleUploadSubmit = () => {
    if (!uploadFormData.title || !selectedCustomer) {
      alert("Please fill in title and select a customer");
      return;
    }

    const newImages = selectedFiles.map((file, index) => ({
      id: Date.now() + Math.random() + index,
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      isSelected: false,
      isCollapsed: false,
      edits: [],
      // Metadata from form
      title:
        uploadFormData.type === "flipbook"
          ? uploadFormData.title
          : uploadFormData.individualTitles?.[index] || file.name,
      description: uploadFormData.description,
      mediaType: uploadFormData.type,
      customerName: selectedCustomer.name,
      customerId: selectedCustomer.id,
      photographer: uploadFormData.photographer,
      location: uploadFormData.location,
      tags: uploadFormData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
    setSelectedFiles([]);
    setShowUploadForm(false);
    setUploadFormData({
      title: "",
      description: "",
      type: "photo",
      customerName: "",
      customerId: "",
      photographer: "",
      location: "",
      tags: "",
      isNewCustomer: false,
      individualTitles: {},
    });
  };

  // Handle cancel upload
  const handleCancelUpload = () => {
    setSelectedFiles([]);
    setShowUploadForm(false);
    setUploadFormData({
      title: "",
      description: "",
      type: "photo",
      customerName: "",
      customerId: "",
      photographer: "",
      location: "",
      tags: "",
      isNewCustomer: false,
      individualTitles: {},
    });
  };

  // Handle individual title changes
  const handleIndividualTitleChange = (index, value) => {
    setUploadFormData((prev) => ({
      ...prev,
      individualTitles: {
        ...prev.individualTitles,
        [index]: value,
      },
    }));
  };

  // Handle form data changes
  const handleFormChange = (field, value) => {
    setUploadFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image selection
  const handleImageSelect = (imageId) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    const customerMedia = getCustomerMedia(selectedCustomer?.id);
    if (selectedImages.length === customerMedia.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(customerMedia.map((media) => media.id));
    }
  };

  // Handle image collapse/expand
  const handleToggleCollapse = (imageId) => {
    setCollapsedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  // Handle image editing
  const handleEditImage = (image) => {
    setCurrentEditImage(image);
    setIsEditing(true);
    setEditHistory([]);
  };

  // Handle edit operations
  const handleEditOperation = (operation, value) => {
    if (!currentEditImage) return;

    const newEdit = {
      id: Date.now(),
      operation,
      value,
      timestamp: new Date(),
    };

    setEditHistory((prev) => [...prev, newEdit]);
  };

  // Handle save edits
  const handleSaveEdits = () => {
    if (!currentEditImage) return;

    setUploadedImages((prev) =>
      prev.map((img) => (img.id === currentEditImage.id ? { ...img, edits: [...img.edits, ...editHistory] } : img))
    );

    setIsEditing(false);
    setCurrentEditImage(null);
    setEditHistory([]);
  };

  // Handle cancel edits
  const handleCancelEdits = () => {
    setIsEditing(false);
    setCurrentEditImage(null);
    setEditHistory([]);
  };

  // Handle delete images
  const handleDeleteImages = () => {
    setUploadedImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  // Handle download images
  const handleDownloadImages = () => {
    selectedImages.forEach((imageId) => {
      const image = uploadedImages.find((img) => img.id === imageId);
      if (image) {
        const link = document.createElement("a");
        link.href = image.url;
        link.download = image.name;
        link.click();
      }
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get customer media by type
  const getCustomerImages = () => {
    if (!selectedCustomer) return [];
    const customerMedia = getCustomerMedia(selectedCustomer.id);
    return customerMedia.filter((media) => media.type === "photo");
  };

  const getCustomerVideos = () => {
    if (!selectedCustomer) return [];
    const customerMedia = getCustomerMedia(selectedCustomer.id);
    return customerMedia.filter((media) => media.type === "video");
  };

  const getCustomerFlipbooks = () => {
    if (!selectedCustomer) return [];
    const customerMedia = getCustomerMedia(selectedCustomer.id);
    return customerMedia.filter((media) => media.type === "flipbook");
  };

  const customerImages = getCustomerImages();
  const customerVideos = getCustomerVideos();
  const customerFlipbooks = getCustomerFlipbooks();

  return null;

  return (
    <DashboardPageLayout title="Photo Operations" description="Manage and edit your photography files">
      <div className="space-y-6">
        {/* Customer Selection */}
        {showCustomerSelection && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Select Customer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Existing Customers */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Users className="text-blue-600" />
                  Existing Customers
                </h3>
                <div className="space-y-2">
                  {existingCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{customer.name}</h4>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                          {customer.phone && <p className="text-xs text-gray-400">{customer.phone}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create New Customer */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Plus className="text-green-600" />
                  Create New Customer
                </h3>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                      <input
                        type="text"
                        id="newCustomerName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const name = document.getElementById("newCustomerName").value;
                        if (name.trim()) {
                          handleCreateCustomer(name.trim());
                        } else {
                          alert("Please enter a customer name");
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Plus /> Create Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Customer Info */}
        {selectedCustomer && !showCustomerSelection && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedCustomer.name}</h2>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  {selectedCustomer.phone && <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Image className="text-blue-600" />
                    {customerImages.length} photos
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="text-green-600" />
                    {customerVideos.length} videos
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="text-purple-600" />
                    {customerFlipbooks.length} flipbooks
                  </span>
                </div>
                <button
                  onClick={handleBackToCustomerSelection}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  <X /> Change Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Collections */}
        {selectedCustomer && !showCustomerSelection && (
          <section className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-900">
              <FolderOpen className="text-blue-600" />
              {selectedCustomer.name}'s Collections
            </h2>
            {getCustomerCollections(selectedCustomer.id).length > 0 ? (
              <div className="flex flex-wrap gap-6">
                {getCustomerCollections(selectedCustomer.id).map((collection) => (
                  <div
                    key={collection.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full md:w-[340px] flex flex-col"
                  >
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-blue-800 truncate">{collection.title}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              collection.status === "published"
                                ? "bg-green-100 text-green-700"
                                : collection.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {collection.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 truncate">{collection.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                          <span>Date: {new Date(collection.date).toLocaleDateString()}</span>
                          <span>Photographer: {collection.photographer}</span>
                          <span>Location: {collection.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-blue-600">
                          <Image />
                          {collection.totalPhotos}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <Video />
                          {collection.totalVideos}
                        </span>
                      </div>
                    </div>
                    <div className="border-t p-2 bg-gray-50 flex gap-1 overflow-x-auto">
                      {collection.mediaList.slice(0, 6).map((media) => (
                        <div
                          key={media.id}
                          className="relative group w-16 h-16 rounded overflow-hidden border bg-white flex-shrink-0"
                        >
                          {media.type === "photo" ? (
                            <img
                              src={media.url}
                              alt={media.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : media.type === "video" ? (
                            <div className="relative w-full h-full bg-gray-200 flex items-center justify_center">
                              <img
                                src={media.thumbnail || media.url}
                                alt={media.title}
                                className="w-full h-full object-cover opacity-80"
                              />
                              <Video className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                          ) : (
                            <div className="relative w-full h-full bg-gray-200 flex items-center justify_center">
                              <img
                                src={media.url}
                                alt={media.title}
                                className="w-full h-full object-cover opacity-80"
                              />
                              <BookOpen className="absolute text-white text-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                          )}
                          {media.isFavorite && (
                            <div
                              className="absolute top-1 left-1 w-2 h-2 rounded-full bg-yellow-400"
                              title="Favorite"
                            ></div>
                          )}
                        </div>
                      ))}
                      {collection.mediaList.length > 6 && (
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded text-xs text-gray-500">
                          +{collection.mediaList.length - 6} more
                        </div>
                      )}
                    </div>
                    {collection.workInProgress && collection.progressNotes && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        {collection.progressNotes}
                      </div>
                    )}
                    <button className="mt-2 text-blue-600 hover:underline text-xs self-end">View Details</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FolderOpen className="mx-auto text-4xl mb-4" />
                <p>No collections found for this customer.</p>
                <p className="text-sm">Upload new media to create collections.</p>
              </div>
            )}
          </section>
        )}

        {/* Upload Section */}
        {selectedCustomer && !showCustomerSelection && (
          <section className="bg-white rounded-xl shadow-lg p-8 mb-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
              <Upload className="text-blue-600" /> Upload New Media
            </h2>
            {!showUploadForm ? (
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center w-full max-w-xl bg-blue-50">
                <Upload className="mx-auto text-5xl text-blue-300 mb-4" />
                <p className="text-blue-700 mb-4 font-medium">Drag and drop images here or click to browse</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 font-semibold text-lg transition-colors"
                >
                  Select Images
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6 w-full max-w-xl">
                {/* Selected Files Preview */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Selected Files ({selectedFiles.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="border rounded-lg p-2 bg-gray-50">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Upload Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Image Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      {/* Title field - different based on type */}
                      {uploadFormData.type === "flipbook" ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Flipbook Title *</label>
                          <input
                            type="text"
                            value={uploadFormData.title}
                            onChange={(e) => handleFormChange("title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter flipbook title"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Individual Titles (Optional)
                          </label>
                          <p className="text-xs text-gray-500 mb-2">Leave empty to use original file names</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-8">#{index + 1}</span>
                                <input
                                  type="text"
                                  value={uploadFormData.individualTitles?.[index] || ""}
                                  onChange={(e) => handleIndividualTitleChange(index, e.target.value)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder={file.name}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={uploadFormData.description}
                          onChange={(e) => handleFormChange("description", e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={
                            uploadFormData.type === "flipbook" ? "Enter flipbook description" : "Enter description"
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={uploadFormData.type}
                          onChange={(e) => handleFormChange("type", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="photo">Photo</option>
                          <option value="video">Video</option>
                          <option value="flipbook">Flip Book</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <input
                          type="text"
                          value={uploadFormData.tags}
                          onChange={(e) => handleFormChange("tags", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter tags separated by commas"
                        />
                      </div>
                    </div>
                    {/* Additional Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photographer</label>
                        <input
                          type="text"
                          value={uploadFormData.photographer}
                          onChange={(e) => handleFormChange("photographer", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter photographer name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={uploadFormData.location}
                          onChange={(e) => handleFormChange("location", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter location"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 justify-end">
                    <button
                      onClick={handleUploadSubmit}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 font-semibold shadow"
                    >
                      <Upload /> Upload
                    </button>
                    <button
                      onClick={handleCancelUpload}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold shadow"
                    >
                      <X /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Media Tabs & Search */}
        {selectedCustomer &&
          (customerImages.length > 0 || customerVideos.length > 0 || customerFlipbooks.length > 0) && (
            <section className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-t-lg font-semibold flex items-center gap-2 transition-colors ${
                      mediaTab === "photo" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500 hover:bg-blue-50"
                    }`}
                    onClick={() => setMediaTab("photo")}
                  >
                    <Image /> Photos
                  </button>
                  <button
                    className={`px-4 py-2 rounded-t-lg font-semibold flex items-center gap-2 transition-colors ${
                      mediaTab === "video"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500 hover:bg-green-50"
                    }`}
                    onClick={() => setMediaTab("video")}
                  >
                    <Video /> Videos
                  </button>
                  <button
                    className={`px-4 py-2 rounded-t-lg font-semibold flex items-center gap-2 transition-colors ${
                      mediaTab === "flipbook"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-500 hover:bg-purple-50"
                    }`}
                    onClick={() => setMediaTab("flipbook")}
                  >
                    <BookOpen /> Flipbooks
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded px-3 py-1">
                  <Search className="text-gray-400" />
                  <input
                    type="text"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    placeholder="Search media..."
                    className="bg-transparent outline-none text-sm px-1 py-1"
                  />
                </div>
              </div>
              {/* Media Grid/List */}
              <div>
                {mediaTab === "photo" && customerImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {customerImages
                      .filter(
                        (img) =>
                          img.title?.toLowerCase().includes(mediaSearch.toLowerCase()) ||
                          img.description?.toLowerCase().includes(mediaSearch.toLowerCase())
                      )
                      .map((image) => (
                        <div
                          key={image.id}
                          className={`relative bg-white border rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden group`}
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(image.id)}
                              onChange={() => handleImageSelect(image.id)}
                              className="w-4 h-4 text-blue-600"
                              title="Select"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditImage(image)}
                              className="p-1 bg-white rounded shadow hover:bg-gray-50"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleToggleCollapse(image.id)}
                              className="p-1 bg-white rounded shadow hover:bg-gray-50"
                              title={collapsedImages.has(image.id) ? "Show Details" : "Hide Details"}
                            >
                              {collapsedImages.has(image.id) ? (
                                <EyeOff className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                          {!collapsedImages.has(image.id) && (
                            <div className="p-4">
                              <h3 className="font-semibold text-base truncate mb-1">{image.title || image.name}</h3>
                              <p className="text-xs text-gray-500 mb-1">{formatFileSize(image.size)}</p>
                              <p className="text-xs text-gray-500 mb-1">{image.uploadDate.toLocaleDateString()}</p>
                              {image.collectionTitle && (
                                <p className="text-xs text-purple-600 mb-1">Collection: {image.collectionTitle}</p>
                              )}
                              {image.tags && image.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {image.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                  {image.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">+{image.tags.length - 2} more</span>
                                  )}
                                </div>
                              )}
                              {image.edits.length > 0 && (
                                <p className="text-xs text-blue-600 mt-1">{image.edits.length} edit(s) applied</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                {mediaTab === "video" && customerVideos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {customerVideos
                      .filter(
                        (vid) =>
                          vid.title?.toLowerCase().includes(mediaSearch.toLowerCase()) ||
                          vid.description?.toLowerCase().includes(mediaSearch.toLowerCase())
                      )
                      .map((video) => (
                        <div
                          key={video.id}
                          className="relative bg-white border rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden group"
                        >
                          <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                            <img
                              src={video.thumbnail || video.url}
                              alt={video.title}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <Video className="absolute text-white text-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <div className="absolute top-2 left-2 flex gap-1">
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(video.id)}
                              onChange={() => handleImageSelect(video.id)}
                              className="w-4 h-4 text-green-600"
                              title="Select"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditImage(video)}
                              className="p-1 bg-white rounded shadow hover:bg-gray-50"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleToggleCollapse(video.id)}
                              className="p-1 bg-white rounded shadow hover:bg-gray-50"
                              title={collapsedImages.has(video.id) ? "Show Details" : "Hide Details"}
                            >
                              {collapsedImages.has(video.id) ? (
                                <EyeOff className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                          {!collapsedImages.has(video.id) && (
                            <div className="p-4">
                              <h3 className="font-semibold text-base truncate mb-1">{video.title || video.name}</h3>
                              <p className="text-xs text-gray-500 mb-1">{formatFileSize(video.size)}</p>
                              <p className="text-xs text-gray-500 mb-1">{video.uploadDate.toLocaleDateString()}</p>
                              {video.collectionTitle && (
                                <p className="text-xs text-purple-600 mb-1">Collection: {video.collectionTitle}</p>
                              )}
                              {video.tags && video.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {video.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                  {video.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">+{video.tags.length - 2} more</span>
                                  )}
                                </div>
                              )}
                              {video.edits.length > 0 && (
                                <p className="text-xs text-blue-600 mt-1">{video.edits.length} edit(s) applied</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                {mediaTab === "flipbook" && customerFlipbooks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {customerFlipbooks
                      .filter(
                        (fb) =>
                          fb.title?.toLowerCase().includes(mediaSearch.toLowerCase()) ||
                          fb.description?.toLowerCase().includes(mediaSearch.toLowerCase())
                      )
                      .map((flipbook) => (
                        <div
                          key={flipbook.id}
                          className="relative bg-white border rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden group"
                        >
                          <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                            <img
                              src={flipbook.thumbnail || flipbook.url}
                              alt={flipbook.title}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <BookOpen className="absolute text-white text-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <div className="absolute top-2 left-2 flex gap-1">
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(flipbook.id)}
                              onChange={() => handleImageSelect(flipbook.id)}
                              className="w-4 h-4 text-purple-600"
                              title="Select"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditImage(flipbook)}
                              className="p-1 bg-white rounded shadow hover:bg-gray-50"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleToggleCollapse(flipbook.id)}
                              className="p-1 bg-white rounded shadow hover:bg-gray-50"
                              title={collapsedImages.has(flipbook.id) ? "Show Details" : "Hide Details"}
                            >
                              {collapsedImages.has(flipbook.id) ? (
                                <EyeOff className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                          {!collapsedImages.has(flipbook.id) && (
                            <div className="p-4">
                              <h3 className="font-semibold text-base truncate mb-1">
                                {flipbook.title || flipbook.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-1">{formatFileSize(flipbook.size)}</p>
                              <p className="text-xs text-gray-500 mb-1">{flipbook.uploadDate.toLocaleDateString()}</p>
                              {flipbook.collectionTitle && (
                                <p className="text-xs text-purple-600 mb-1">Collection: {flipbook.collectionTitle}</p>
                              )}
                              {flipbook.tags && flipbook.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {flipbook.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                  {flipbook.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">+{flipbook.tags.length - 2} more</span>
                                  )}
                                </div>
                              )}
                              {flipbook.edits.length > 0 && (
                                <p className="text-xs text-blue-600 mt-1">{flipbook.edits.length} edit(s) applied</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>
          )}

        {/* Operations Toolbar */}
        {selectedCustomer &&
          (customerImages.length > 0 || customerVideos.length > 0 || customerFlipbooks.length > 0) && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={handleSelectAll} className="text-sm text-blue-600 hover:text-blue-700">
                    {selectedImages.length === customerImages.length + customerVideos.length + customerFlipbooks.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedImages.length} of{" "}
                    {customerImages.length + customerVideos.length + customerFlipbooks.length} selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                  >
                    <Image />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                  >
                    <FolderOpen />
                  </button>
                </div>

                {selectedImages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadImages}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Download /> Download
                    </button>
                    <button
                      onClick={handleDeleteImages}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Edit Modal */}
        {isEditing && currentEditImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Image: {currentEditImage.name}</h2>
                <button onClick={handleCancelEdits} className="text-gray-500 hover:text-gray-700">
                  <X />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div>
                  <img src={currentEditImage.url} alt={currentEditImage.name} className="w-full rounded-lg" />
                </div>

                {/* Edit Controls */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Edit Operations</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEditOperation("crop", "auto")}
                        className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                      >
                        <Crop /> Crop
                      </button>
                      <button
                        onClick={() => handleEditOperation("adjust", "brightness")}
                        className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                      >
                        <SlidersHorizontal /> Brightness
                      </button>
                      <button
                        onClick={() => handleEditOperation("filter", "grayscale")}
                        className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                      >
                        <Filter /> Filter
                      </button>
                      <button
                        onClick={() => handleEditOperation("rotate", 90)}
                        className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                      >
                        <RotateCw /> Rotate
                      </button>
                    </div>
                  </div>

                  {/* Edit History */}
                  {editHistory.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Edit History</h3>
                      <div className="space-y-1">
                        {editHistory.map((edit) => (
                          <div key={edit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">
                              {edit.operation}: {edit.value}
                            </span>
                            <span className="text-xs text-gray-500">{edit.timestamp.toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSaveEdits}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Save /> Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdits}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      <X /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardPageLayout>
  );
};

export default OperationsIndex;
