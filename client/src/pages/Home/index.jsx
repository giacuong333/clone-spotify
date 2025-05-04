import { lazy } from "react";

const Content = lazy(() => import("../../components/Content"));

const Home = () => {
	return <Content />;
};

export default Home;
