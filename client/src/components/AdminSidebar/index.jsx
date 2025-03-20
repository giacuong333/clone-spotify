import React, { useState } from "react";
import items from "./items";
import { useLocation, useNavigate } from "react-router-dom";
import { CloseOutlined, MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/Auth";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [showItems, setShowItems] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <section
      className={`bg-[#435d63] flex flex-col transition-all duration-500 h-screen ${
        showItems ? "max-h-full" : "max-h-fit"
      }`}>
      <div className='p-8 flex-grow'>
        <div className='text-3xl font-semibold mb-4 text-white flex items-center justify-between'>
          <div>
            <p className='text-5xl font-serif tracking-widest'>Booking</p>
          </div>
          <div
            className='md:hidden block cursor-pointer p-1 px-2 rounded-md hover:bg-slate-500'
            onClick={() => setShowItems(!showItems)}>
            {showItems ? (
              <CloseOutlined className='text-white text-md' />
            ) : (
              <MenuOutlined className='text-white text-md' />
            )}
          </div>
        </div>

        {showItems && (
          <ul>
            {items?.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`cursor-pointer hover:bg-slate-500 rounded-xl p-4 ${
                    location.pathname === item.path
                      ? "bg-slate-300 text-[#274b60]"
                      : "text-white"
                  }`}
                  onClick={() => navigate(item?.path)}>
                  {item?.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className='bg-slate-300 p-2 cursor-pointer mb-10 flex items-center justify-center gap-4'>
        <LogoutOutlined size={20} className='text-[#14373f]' />
        <p className='text-center text-[#14373f]' onClick={handleLogout}>
          Sign out
        </p>
      </div>
    </section>
  );
};

export default AdminSidebar;
