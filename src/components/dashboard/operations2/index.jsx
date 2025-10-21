"use client";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import React, { useState } from "react";
import CustomerSection from "./_builder/CustomerSection";
import MediaUploadSection from "./_builder/MediaUploadSection";

const Operation2Index = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <DashboardPageLayout title="Photo Operations" description="Manage and edit your photography files">
      <div>
        <CustomerSection selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />
        <MediaUploadSection selectedCustomer={selectedCustomer} />
      </div>
    </DashboardPageLayout>
  );
};

export default Operation2Index;
