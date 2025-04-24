import React from "react";
import { Table } from "antd";
import { useSong } from "../../contexts/Song";
import { useAuth } from "../../contexts/Auth";

const dataSource = [
	{
		key: "1",
		name: "Mike",
		age: 32,
		address: "10 Downing Street",
	},
	{
		key: "2",
		name: "John",
		age: 42,
		address: "10 Downing Street",
	},
];

const columns = [
	{
		title: "No",
		dataIndex: "no",
		key: "no",
	},
	{
		title: "Title",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "Genre",
		dataIndex: "genre",
		key: "genre",
	},
	{
		title: "User",
		dataIndex: "user",
		key: "user",
	},
];

const SongManagement = () => {
	const { songList, loading } = useSong();
	const { user } = useAuth();

	console.log("Song list: ", songList);

	return (
		<div>
			<Table dataSource={dataSource} columns={columns} />
		</div>
	);
};

export default SongManagement;
