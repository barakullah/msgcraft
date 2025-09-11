import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InstancesList from "@/components/instancesListing/InstancesListing";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Instance List | MsgCraft - Whatsapp Automation Service ",
  description:
    "Instance List | MsgCraft - Whatsapp Automation Service ",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Instances" />
      <InstancesList/>
    </div>
  );
}
