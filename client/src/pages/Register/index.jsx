import { Form, Input, Button, ConfigProvider, Spin } from "antd";
import SpotifyLogo from "../../components/SpotifyLogo";
import GoogleIcon from "../../components/GoogleIcon";
import FacebookIcon from "../../components/FacebookIcon";
import AppleIcon from "../../components/AppleIcon";
import paths from "../../constants/paths";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

const Register = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { register, pendingRegister } = useAuth();

	const onFinish = async (values) => {
		console.log("Payload:", values);
		await register(values);
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
			<div className='w-full min-h-screen bg-[#121212] text-white flex items-center justify-center p-4'>
				{/* Container chính */}
				<div className='w-full max-w-xs'>
					{/* Logo */}
					<div
						className='flex justify-center mb-8 cursor-pointer'
						onClick={() => navigate(paths.home)}>
						<SpotifyLogo height={40} fillColor='white' />
					</div>

					{/* Tiêu đề */}
					<h1 className='text-4xl font-serif font-bold text-center mb-6'>
						Sign up to start listening
					</h1>

					{/* Form */}
					<Form
						form={form}
						name='signup'
						onFinish={onFinish}
						layout='vertical'
						className='mb-6'
						initialValues={{ name: "", email: "", password: "" }}>
						<Form.Item
							label='Name'
							name='name'
							rules={[
								{
									required: true,
									message: "Name is required!",
								},
							]}
							className='!mb-3'>
							<Input
								placeholder='John Doe'
								className='w-full h-12 !bg-transparent hover:!border-white !text-white placeholder-gray-400 !border-gray-600 rounded-md !focus:outline-none !focus:ring-2 !focus:ring-[#1ED760] hover:bg-[#2A2A2A] transition-all'
							/>
						</Form.Item>

						<Form.Item
							label='Email address'
							name='email'
							rules={[
								{
									required: true,
									message: "Email is required!",
								},
							]}
							className='!mb-3'>
							<Input
								placeholder='name@domain.com'
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
								type='password'
								className='w-full h-12 !bg-transparent hover:!border-white !text-white placeholder-gray-400 !border-gray-600 rounded-md !focus:outline-none !focus:ring-2 !focus:ring-[#1ED760] hover:bg-[#2A2A2A] transition-all'
							/>
						</Form.Item>

						<Form.Item className='!mb-3'>
							<Button
								type='link'
								className='!text-[#1ED760] text-sm font-normal underline !p-0'>
								Use phone number instead.
							</Button>
						</Form.Item>

						<Form.Item className='mb-4'>
							<Button
								type='primary'
								htmlType='submit'
								className='!w-full !h-12 !bg-[#1ED760] !text-black !rounded-full !font-bold hover:!bg-[hsl(141,65%,71%)]'>
								Sign Up
							</Button>
						</Form.Item>
					</Form>

					{/* Divider */}
					<div className='flex items-center mb-4'>
						<hr className='flex-1 border-gray-600' />
						<span className='px-4 text-gray-400'>or</span>
						<hr className='flex-1 border-gray-600' />
					</div>

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
					</div>

					{/* Login Link */}
					<p className='text-center text-gray-400'>
						Already have an account?{" "}
						<span
							className='text-[#1ED760] underline cursor-pointer'
							onClick={() => navigate(paths.login)}>
							Log in here
						</span>
					</p>

					{/* Footer Text */}
					<p className='text-center text-gray-400 text-xs mt-4'>
						This site is protected by reCAPTCHA and the Google{" "}
						<a
							href='#'
							className='text-[#1ED760] hover:text-green-500 underline'>
							Privacy Policy
						</a>{" "}
						and{" "}
						<a
							href='#'
							className='text-[#1ED760] hover:text-green-500 underline'>
							Terms of Service
						</a>{" "}
						apply.
					</p>
				</div>
			</div>

			{pendingRegister && (
				<Spin spinning tip='Signing Up...' fullscreen size='large'></Spin>
			)}
		</ConfigProvider>
	);
};

export default Register;
