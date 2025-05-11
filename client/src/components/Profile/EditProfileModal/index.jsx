import { useState } from "react";
import { Modal } from "antd";
import { apis } from "../../../constants/apis";
import { instance } from "../../../contexts/Axios";
import { notify } from "../../Toast";

const EditProfileModal = ({ open, onClose, user, setUser}) => {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [image, setImage] = useState(user?.image || null);
  const [password, setPassword] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (password !== "") formData.append("password", password);
    if (image && image instanceof File) formData.append("image", image);

    try {
      const response = await instance.put(
        apis.users.update(user?.id),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status == 200) {
        notify("Profile updated successfully!", "success");
        console.log("Profile updated successfully:", response.data); 
        localStorage.setItem("user", JSON.stringify(response.data));
        
        setUser((prevUser) => ({
          ...prevUser,
          ...response.data
        }));
      }
      
    } catch (err) {
      notify("Update failed", "error");
      console.error("Error updating profile:", err);
    }
    
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className="bg-neutral-900 text-white rounded-xl"
    >
      <form className="flex flex-col items-center text-center px-6 pt-6 pb-4" onSubmit={handleSave}>
        <h2 className="text-2xl font-bold mb-4">Profile details</h2>
        <label htmlFor="image-upload" className="cursor-pointer">
          <img
            src={
              image instanceof File
                ? URL.createObjectURL(image)
                : user?.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            }
            alt="avatar"
            className="w-40 h-40 rounded-full object-cover border"
          />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="w-full mt-6">
          <label htmlFor="name" className="block text-left text-sm mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 bg-neutral-800 rounded-md text-white focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="w-full mt-6">
          <label htmlFor="password" className="block text-left text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 bg-neutral-800 rounded-md text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="w-full mt-6">
          <label htmlFor="bio" className="block text-left text-sm mb-1">
            Bio
          </label>
          <textarea
            rows="4"
            id="bio"
            className="w-full px-4 py-2 bg-neutral-800 rounded-md text-white focus:outline-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-3 px-8 py-4 bg-black text-white font-semibold rounded-full hover:opacity-90 transition"
        >
          Save
        </button>

        <p className="mt-4 text-xs text-neutral-400">
          By proceeding, you agree to give access to the image you choose to upload.
          <br />
          Please make sure you have the right to upload the image.
        </p>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
