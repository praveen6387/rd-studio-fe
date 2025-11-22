"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

const MediaUploadSection = ({ selectedCustomer }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    description: "",
    type: "photo",
    photographer: "",
    location: "",
    tags: "",
    individualTitles: {},
  });

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      setSelectedFiles(imageFiles);
      setShowUploadForm(true);
    }
  };

  const handleFormChange = (field, value) => {
    setUploadFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIndividualTitleChange = (index, value) => {
    setUploadFormData((prev) => ({
      ...prev,
      individualTitles: {
        ...prev.individualTitles,
        [index]: value,
      },
    }));
  };

  const handleUploadSubmit = () => {
    if (!uploadFormData.title && uploadFormData.type === "flipbook") {
      alert("Please fill in title for the flipbook");
      return;
    }

    // Reset form
    handleCancelUpload();
  };

  const handleCancelUpload = () => {
    setSelectedFiles([]);
    setShowUploadForm(false);
    setUploadFormData({
      title: "",
      description: "",
      type: "photo",
      photographer: "",
      location: "",
      tags: "",
      individualTitles: {},
    });
  };

  if (!selectedCustomer) return null;

  return (
    <section className="bg-white rounded-xl shadow-lg p-8 mb-6 mt-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
          <Upload className="text-blue-600" /> Upload New Media
        </h2>
      </div>
      {!showUploadForm ? (
        <div className="border-2 border-dashed border-blue-200 rounded-xl p-12 text-center bg-blue-50">
          <Upload className="mx-auto text-6xl text-blue-300 mb-6" />
          <p className="text-blue-700 mb-6 font-medium text-lg">Drag and drop images here or click to browse</p>
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
        <div className="space-y-8 w-full">
          {/* Selected Files Preview */}
          <div>
            <h3 className="text-lg font-medium mb-3">Selected Files ({selectedFiles.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="border border-slate-400 rounded-lg p-1 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="aspect-video overflow-hidden rounded">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Form */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-medium mb-6">Image Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
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
                    placeholder="Enter description"
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
  );
};

export default MediaUploadSection;
