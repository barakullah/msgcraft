import type { Metadata } from "next";
import React from "react";
import Dashboard from "./Dashboard";


export const metadata: Metadata = {
  title:
    "Dashboard | MsgCraft - Whatsapp Automation Service ",
  description: "Dashboard | MsgCraft - Whatsapp Automation Service",
};

export default function Ecommerce() {
  return (
    // <div className="grid grid-cols-12 gap-4 md:gap-6">
<Dashboard/>
    // </div>
  );
}
