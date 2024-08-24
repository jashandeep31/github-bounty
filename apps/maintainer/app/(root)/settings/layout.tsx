import React from "react";
import SideBar from "./components/sideBar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mt-6">
      {" "}
      <div className=" grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <SideBar />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default layout;
