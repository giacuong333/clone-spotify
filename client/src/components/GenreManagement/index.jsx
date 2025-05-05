import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Button, Tooltip, Modal, Form, message } from "antd";

import {
  SearchOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ConfirmPopup from "../ConfirmPopup";
import { useGenre } from "../../contexts/genre";

const GenreManagement = () => {
  const {
    genreList,
    fetchGenreList,
    loadingFetchGenreList,
    handleDeleteGenres,
    createGenre,
    updateGenre,
  } = useGenre();

  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGenreList();
    console.log("Fetched genre list:", genreList); // Log danh sách thể loại
  }, [fetchGenreList]);

  const rowSelection = {
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = useMemo(() => {
    return genreList.filter((genre) =>
      genre?.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [genreList, searchText]);

  const dataSource = filteredData.map((genre, index) => ({
    key: genre.id, // Sử dụng 'id' làm key
    id: genre.id, // Lưu 'id' để sử dụng khi chỉnh sửa
    no: index + 1, // Số thứ tự
    name: genre.name, // Tên thể loại
}));

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 60,
    },
    {
      title: "Genre Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Edit Genre">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditGenre(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Genre">
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => showDeleteConfirmation([record.key])}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const showDeleteConfirmation = (keys) => {
    setSelectedRowKeys(keys || selectedRowKeys);
    setIsConfirmPopupVisible(true);
  };

  const processDeleteGenres = async () => {
    if (selectedRowKeys.length === 0) return;
    console.log("Selected Row Keys:", selectedRowKeys); // Log danh sách ID
    setIsDeleting(true);
    try {
        await handleDeleteGenres(selectedRowKeys);
        message.success("Genres deleted successfully.");
        setSelectedRowKeys([]);
    } catch (error) {
        message.error("Failed to delete genres. Please try again.");
    } finally {
        setIsDeleting(false);
        setIsConfirmPopupVisible(false);
    }
};

  const handleCancelDeleteGenres = () => {
    setIsConfirmPopupVisible(false);
  };

  const handleRefresh = () => {
    fetchGenreList();
    setSearchText("");
  };

  const handleAddGenre = () => {
    form.resetFields();
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEditGenre = (record) => {
    console.log("Editing genre:", record);
    setEditingGenre(record); 
    form.setFieldsValue({ name: record.name }); 
    setIsEditing(true); 
    setIsModalVisible(true);
};

 const handleModalOk = async () => {
    try {
        const values = await form.validateFields();
        console.log("Form values:", values); // Log dữ liệu form
        if (isEditing) {
            console.log("Editing genre with ID:", editingGenre?.id); // Log ID của thể loại đang chỉnh sửa
            if (!editingGenre?.id) {
                throw new Error("Genre ID is undefined");
            }
            await updateGenre(editingGenre.id, values); // Gọi API cập nhật
        } else {
            await createGenre(values); // Gọi API thêm mới
        }
        message.success(
            isEditing ? "Genre updated successfully." : "Genre added successfully."
        );
        setIsModalVisible(false);
        fetchGenreList(); // Refresh danh sách thể loại
    } catch (error) {
        message.error("Failed to save genre. Please try again.");
    }
};

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Genre Management</h1>
        <div className="flex space-x-2">
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddGenre}
            >
              Add Genre
            </Button>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              className="text-gray-500 hover:text-purple-600"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-grow max-w-md">
          <Input
            placeholder="Search by genre name"
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={handleSearch}
            value={searchText}
            className="rounded-lg"
            allowClear
          />
        </div>

        <div className="flex items-center gap-2">
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirmation()}
              loading={isDeleting}
            >
              Delete ({selectedRowKeys.length})
            </Button>
          )}
        </div>
      </div>

      <Modal
        title={isEditing ? "Edit Genre" : "Add Genre"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Genre Name"
            rules={[{ required: true, message: "Please enter genre name" }]}
          >
            <Input placeholder="Enter genre name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
        <Table
          rowSelection={{ type: "checkbox", ...rowSelection }}
          dataSource={dataSource}
          columns={columns}
          loading={loadingFetchGenreList}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} genres`,
            className: "p-4",
          }}
          className="custom-table"
          rowClassName="hover:bg-gray-50"
        />
      </div>

      {/* Confirm Popup */}
      <ConfirmPopup
        toggle={isConfirmPopupVisible}
        setToggle={handleCancelDeleteGenres}
        onOk={processDeleteGenres}
        onCancel={handleCancelDeleteGenres}
        title="Are you sure you want to delete selected genres?"
        message="This action cannot be undone."
      />

      {/* Modal for Add/Edit Genre */}
      <Modal
        title={isEditing ? "Edit Genre" : "Add Genre"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Genre Name"
            rules={[{ required: true, message: "Please enter genre name" }]}
          >
            <Input placeholder="Enter genre name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GenreManagement;
