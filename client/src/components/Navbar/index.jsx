import React, { useState } from "react";
import {
  HomeOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import SpotifyLogo from "../../components/SpotifyLogo";
import { Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const Navbar = () => {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState("optional");
  const navigate = useNavigate();

  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  return (
    <nav className='w-full h-16 bg-black py-2 px-4'>
      <div className='flex items-center justify-between w-full h-full'>
        {/* Left Section */}
        <div className='flex items-center space-x-6 h-full'>
          <div className='px-2 cursor-pointer'>
            <SpotifyLogo height={32} fillColor='white' />
          </div>
          <div className='flex items-center space-x-4 h-full'>
            <HomeOutlined
              style={{ color: "white" }}
              className='cursor-pointer text-2xl bg-neutral-700 rounded-full p-2.5 hover:bg-neutral-600 transition-all'
            />
            <Form
              form={form}
              layout='vertical'
              initialValues={{
                requiredMarkValue: requiredMark,
              }}
              onValuesChange={onRequiredTypeChange}
              className='w-full !h-full'>
              <Form.Item
                name='search'
                required
                tooltip='This is a required field'
                className='!mb-0 !w-full !h-full !flex !items-center' // Loại bỏ margin mặc định
              >
                <Input
                  prefix={<SearchOutlined className='text-gray-400 text-2xl' />}
                  placeholder='What do you want to play?'
                  className='md:!w-full xl:!w-md !py-2.5 !px-4 !h-full !border-neutral-800 focus-within:!border-white hover:!border-gray-300 !rounded-full transition-all !text-gray-200 !text-lg'
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
          <div className='flex items-center gap-6 text-white text-sm h-full'>
            <span className='flex items-center gap-2 cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
              <DownloadOutlined />
              <p>Install App</p>
            </span>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
