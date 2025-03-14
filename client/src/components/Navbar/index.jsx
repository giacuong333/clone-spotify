import React, { useState } from "react";
import {
  HomeOutlined,
  SearchOutlined,
  DownloadOutlined,
  BellOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import SpotifyLogo from "../../components/SpotifyLogo";
import { ConfigProvider, Form, Input, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";
import { useSearch } from "../../contexts/Search";
import _ from "lodash";
import { useAuth } from "../../contexts/Auth";

const popoverItems = [
  {
    id: 1,
    content: "Account",
    Icon: ExportOutlined,
  },
  { id: 2, content: "Profile" },
  {
    id: 3,
    content: "Upgrade to Premium",
    Icon: ExportOutlined,
  },
  {
    id: 4,
    content: "Support",
    Icon: ExportOutlined,
  },
  {
    id: 5,
    content: "Download",
    Icon: ExportOutlined,
  },
  { id: 6, content: "Settings" },
  { id: 7, content: "Logout", action: (callback) => callback() },
];

const Navbar = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { setSearchQuery } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSearch = (values) => {
    (values) => setSearchQuery(values);
    navigate(_.isEmpty(values) ? paths.home : paths.search);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            red: false,
            labelColor: "white",
            labelFontSize: 14,
          },
          Input: {
            colorBgContainer: "#242424",
            colorText: "#bbb",
            colorBorder: "transparent",
            borderRadius: 8,
            colorTextPlaceholder: "#a0a0a0",
            hoverBg: "#2A2A2A",
            activeBorderColor: "#1DB954",
            height: 48,
          },
        },
      }}>
      <nav className='w-full h-16 bg-black py-2 px-4'>
        <div className='flex items-center justify-between w-full h-full'>
          {/* Left Section */}
          <div className='flex items-center space-x-6 h-full'>
            <div className='px-2 cursor-pointer'>
              <SpotifyLogo
                height={32}
                fillColor='white'
                onClick={() => navigate(paths.home)}
              />
            </div>
            <div className='flex items-center space-x-4 h-full'>
              <HomeOutlined
                style={{ color: "white" }}
                className='cursor-pointer text-2xl bg-neutral-700 rounded-full p-2.5 hover:bg-neutral-600 transition-all'
                onClick={() => navigate(paths.home)}
              />

              {/* Search */}
              <Form
                form={form}
                onFinish={handleSearch}
                autoComplete='on'
                layout='vertical'
                className='w-full !h-full'>
                <Form.Item
                  name='search'
                  tooltip='This is a required field'
                  rules={[{ required: false }]}
                  className='!mb-0 !w-full !h-full !flex !items-center' // Loại bỏ margin mặc định
                >
                  <Input
                    prefix={
                      <SearchOutlined className='text-gray-400 text-2xl' />
                    }
                    placeholder='What do you want to play?'
                    className='md:!w-full xl:!w-md !py-2.5 !px-4 !h-full !border-neutral-800 !border-2 focus-within:!border-white hover:!border-gray-300 !rounded-full transition-all !text-gray-200 !text-lg'
                    style={{
                      backgroundColor: "#242424",
                      color: "#bbb",
                    }}
                  />
                </Form.Item>
              </Form>
            </div>
          </div>

          {/* Right Section */}
          <div className='flex items-center space-x-6 h-full'>
            {!isAuthenticated && (
              <>
                <div className='flex items-center gap-4 text-white text-sm'>
                  <p className='cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
                    Premium
                  </p>
                  <p className='cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
                    Support
                  </p>
                  <p className='cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
                    Download
                  </p>
                </div>
                <div className='w-[1px] h-7 bg-white mr-8'></div>
              </>
            )}
            <div className='flex items-center gap-6 text-white text-sm h-full'>
              <span className='flex items-center gap-2 cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
                <DownloadOutlined />
                <p>Install App</p>
              </span>
              {isAuthenticated ? (
                <>
                  <BellOutlined className='!text-white/70 text-xl cursor-pointer hover:!text-white' />
                  <Popover
                    content={
                      <ul>
                        {popoverItems?.map((item) => {
                          return (
                            <li key={item?.id} className='group'>
                              <div
                                className='flex items-center justify-between gap-6 px-3 py-2.5 cursor-pointer group-hover:!bg-white/20'
                                onClick={() =>
                                  item?.action && item?.action(handleLogout)
                                }>
                                <p className='group-hover:underline text-white'>
                                  {item?.content}
                                </p>
                                {item?.Icon && (
                                  <item.Icon className='!text-white' />
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    }
                    trigger='click'
                    arrow={false}
                    open={open}
                    color='black'
                    onOpenChange={handleOpenChange}>
                    <div className='flex items-center justify-center p-2 rounded-full bg-[#1F1F1F] cursor-pointer group'>
                      <p className='text-black font-bold bg-[#F573A0] w-8 h-8 flex items-center justify-center rounded-full group-hover:scale-[1.04]'>
                        {user?.username[0]}
                      </p>
                    </div>
                  </Popover>
                </>
              ) : (
                <>
                  <p
                    className='cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'
                    onClick={() => navigate(paths.register)}>
                    Sign up
                  </p>
                  <p
                    className='text-center flex items-center bg-white h-full px-8 rounded-full cursor-pointer text-black font-bold hover:bg-gray-200 hover:scale-[1.05] transition-all'
                    onClick={() => navigate(paths.login)}>
                    Log in
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </ConfigProvider>
  );
};

export default React.memo(Navbar);
