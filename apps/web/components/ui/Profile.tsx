"use client";

import { LogoutOutlined, LockOutlined, EditOutlined, UserSwitchOutlined, UserOutlined } from "@ant-design/icons";

import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";
import { persistor } from "@/redux/store/store";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { useState } from "react";
import { Modal, notification, Avatar } from "antd";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import { setActiveRole } from "@/redux/features/authSlice";

const Profile = () => {
  const [password, setPassword] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const logout = useLogout();
  const router = useRouter();
  const userDetails = useAppSelector((u) => u.auth.user);
  const activeRole = useAppSelector((u) => u.auth.activeRole);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    logout();
    persistor.purge();
    router.push("/login");
    sessionStorage.clear()
  };

  const changePassword = () => {
    setPassword(true);
    setEdit(false);
  };

  const editUserDetails = () => {
    setEdit(true);
    setPassword(false);
  };

  const updateActiveRole = (role: "admin" | "user") => {
    dispatch(setActiveRole({ activeRole: role }));
    document.cookie = `activeRole=${role}; path=/; max-age=604800; SameSite=Lax`;
  };

  const changeRole = () => {
    if (userDetails?.role !== "admin") {
      return notification.error({
        message: "You are not able to change your role",
      });
    }

    const newRole: "admin" | "user" = activeRole === "admin" ? "user" : "admin";

    updateActiveRole(newRole);

    notification.success({
      message: `Switched to ${newRole}`,
    });

    router.replace(`/${newRole}`);
  };
  return (
    <>
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center relative">
          <div className="rounded-full border-2 border-blue-500 p-1">
            <Avatar
              size={96}
              src={userDetails?.imageUrl || undefined}
              icon={!userDetails?.imageUrl && <UserOutlined />}
            />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {userDetails?.fullName}
          </h2>

          <span className="mt-2 px-4 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
            {userDetails?.userName}
          </span>
        </div>

        <div className="mt-8">
          <h3 className="text-gray-500 text-sm font-medium mb-3">Account</h3>

          <div className="space-y-3">
            <button
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition"
              onClick={changePassword}
            >
              <div className="w-10 h-10 rounded-xl bg-white text-blue-500 border flex items-center justify-center">
                <LockOutlined />
              </div>
              <span className="font-medium text-gray-700">Change Password</span>
            </button>

            <button
              className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition"
              onClick={editUserDetails}
            >
              <div className="w-10 h-10 rounded-xl text-blue-500 bg-white border flex items-center justify-center">
                <EditOutlined />
              </div>
              <span className="font-medium text-gray-700">Edit details</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          {userDetails?.role === "admin" && (
            <button
              className="flex items-center gap-2 py-3 px-5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              onClick={changeRole}
            >
              <UserSwitchOutlined />
              <span className="font-medium">{activeRole === "admin" ? "User" : "Admin" }</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition"
          >
            <LogoutOutlined />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      {edit && (
        <Modal
          title={"Edit user details"}
          open={edit}
          onCancel={() => setEdit(false)}
          footer={false}
        >
          <EditProfile close={() => setEdit(false)} />
        </Modal>
      )}

      {password && (
        <Modal
          title={"Change Password"}
          open={password}
          onCancel={() => setPassword(false)}
          footer={false}
        >
          <ChangePassword close={() => setPassword(false)} />
        </Modal>
      )}
    </>
  );
};

export default Profile;
