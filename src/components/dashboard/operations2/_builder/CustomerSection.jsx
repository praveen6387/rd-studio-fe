"use client";
import React, { useState, useEffect, useRef } from "react";
import { getAllCustomers } from "../../../../data/users";
import { FaImage, FaVideo, FaBook, FaTimes, FaUser } from "react-icons/fa";

const CustomerSection = ({selectedCustomer, setSelectedCustomer}) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [stats, setStats] = useState({
    photos: 0,
    videos: 0,
    flipbooks: 0,
  });

  useEffect(() => {
    const customerList = getAllCustomers();
    setCustomers(customerList);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0">
      {/* Search Section */}
      <div className="relative w-64" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Dropdown */}
        {isDropdownOpen && searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsDropdownOpen(false);
                  setSearchTerm("");
                }}
              >
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-gray-600">{customer.email}</div>
              </div>
            ))}
            {filteredCustomers.length === 0 && <div className="p-2 text-gray-500 text-center">No customers found</div>}
          </div>
        )}
      </div>

      {/* Customer Details Card */}
      {selectedCustomer && (
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedCustomer.name}</h2>
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  {selectedCustomer.phone && <p className="text-sm text-gray-500"> | {selectedCustomer.phone}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FaImage className="text-blue-600" />
                  {0} photos
                </span>
                <span className="flex items-center gap-1">
                  <FaVideo className="text-green-600" />
                  {0} videos
                </span>
                <span className="flex items-center gap-1">
                  <FaBook className="text-purple-600" />
                  {0} flipbooks
                </span>
              </div>
              {/* <button
                onClick={handleBackToCustomerSelection}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <FaTimes /> Change Customer
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSection;
