import React from "react";
import { Form, Input, Button, ConfigProvider } from "antd";
import SpotifyLogo from "../../components/SpotifyLogo";
import GoogleIcon from "../../components/GoogleIcon";
import FacebookIcon from "../../components/FacebookIcon";
import AppleIcon from "../../components/AppleIcon";
import paths from "../../constants/paths";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values:", values);
    // Xử lý submit form
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
      <div
        className='pt-10 w-full min-h-screen text-white flex flex-col items-center justify-center'
        style={{
          background:
            "linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgb(0, 0, 0) 100%)",
        }}>
        {/* Container chính */}
        <div className='grow bg-[#121212] h-fit max-w-3xl w-full mx-auto flex items-center justify-center rounded-lg p-10'>
          <div className='w-full max-w-xs'>
            {/* Logo */}
            <div
              className='flex justify-center mb-4 cursor-pointer'
              onClick={() => navigate(paths.home)}>
              <SpotifyLogo height={40} fillColor='white' />
            </div>

            {/* Tiêu đề */}
            <h1 className='text-4xl font-serif font-bold text-center mb-6'>
              Log in to Spotify
            </h1>

            {/* Social Login Buttons */}
            <div className='space-y-2 mb-6'>
              <Button
                icon={
                  <div className=''>
                    <GoogleIcon width={25} height={24} />
                  </div>
                }
                className='!w-full !h-12 !bg-transparent !text-white !font-bold !rounded-full !flex !items-center !border-gray-600 hover:!border-white'>
                <span className='!grow'>Sign up with Google</span>
              </Button>
              <Button
                icon={
                  <div className=''>
                    <FacebookIcon width={25} height={24} />
                  </div>
                }
                className='!w-full !h-12 !bg-transparent !text-white !font-bold !rounded-full !flex !items-center !border-gray-600 hover:!border-white'>
                <span className='!grow'>Sign up with Facebook</span>
              </Button>
              <Button
                icon={
                  <div className=''>
                    <AppleIcon width={25} height={24} />
                  </div>
                }
                className='!w-full !h-12 !bg-transparent !text-white !font-bold !rounded-full !flex !items-center !border-gray-600 hover:!border-white'>
                <span className='!grow'>Sign up with Apple</span>
              </Button>
              <Button className='!w-full !h-12 !bg-transparent !text-white !font-bold !rounded-full !flex !items-center !border-gray-600 hover:!border-white'>
                <span className='!grow'>Continue with phone number</span>
              </Button>
            </div>

            {/* Divider */}
            <div className='flex items-center my-10'>
              <hr className='flex-1 border-gray-600' />
              <hr className='flex-1 border-gray-600' />
            </div>

            {/* Form */}
            <Form
              form={form}
              name='signup'
              onFinish={onFinish}
              layout='vertical'
              className='mb-6'
              initialValues={{ email: "", password: "" }}>
              <Form.Item
                label='Email'
                name='email'
                rules={[
                  {
                    required: true,
                    message: "Email is required!",
                  },
                ]}
                className='!mb-3'>
                <Input
                  placeholder='Email'
                  className='w-full h-12 !bg-transparent hover:!border-white !text-white placeholder-gray-400 !border-gray-600 rounded-md !focus:outline-none !focus:ring-2 !focus:ring-[#1ED760] hover:bg-[#2A2A2A] transition-all'
                />
              </Form.Item>

              <Form.Item
                label='Password'
                name='password'
                rules={[
                  {
                    required: true,
                    message: "Password is required!",
                  },
                ]}
                className='!mb-3'>
                <Input
                  placeholder='Password'
                  type='password'
                  className='w-full h-12 !bg-transparent hover:!border-white !text-white placeholder-gray-400 !border-gray-600 rounded-md !focus:outline-none !focus:ring-2 !focus:ring-[#1ED760] hover:bg-[#2A2A2A] transition-all'
                />
              </Form.Item>

              <Form.Item className='!mt-8'>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='!w-full !h-12 !bg-[#1ED760] !text-black !rounded-full !font-bold hover:!bg-[hsl(141,65%,71%)]'>
                  Next
                </Button>
              </Form.Item>
            </Form>

            {/* Login Link */}
            <p className='cursor-pointer my-8 text-center text-gray-400 underline hover:!text-[#1ED760]'>
              Forgot your password?
            </p>
            <p className='text-center text-gray-400'>
              Don{"'"}t have an account?{" "}
              <span
                className='text-[#1ED760] underline cursor-pointer'
                onClick={() => navigate(paths.register)}>
                Sign up for Spotify
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className='w-full h-full'>
          <div className='mt-10 w-full bg-[#121212] text-gray-400 text-center py-8 text-xs'>
            This site is protected by reCAPTCHA and the Google{" "}
            <a
              href='https://policies.google.com/privacy'
              className='text-white underline'>
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href='https://policies.google.com/terms'
              className='text-white underline'>
              Terms of Service
            </a>{" "}
            apply.
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
};

export default Login;
