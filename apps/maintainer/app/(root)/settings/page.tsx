import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  redirect("/settings/manage-access");
  return <div className="">page</div>;
};

export default page;
