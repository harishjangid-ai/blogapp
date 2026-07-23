"use client";

import { getSelUser } from "@/services/users";
import { SelectedUser } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import IAvatar from "./IAvatar";

const UserDetails = ({ id }: { id: string | undefined }) => {

  const { data: selectedUser } = useQuery<SelectedUser>({
    queryKey: ["selected-user"],
    queryFn: () => getSelUser({ userId: id }),
    enabled: !!id,
  });

  return (
    <>
      <div>
        <div className="flex flex-col gap-2 dark:text-gray-100">
          <IAvatar
            size={96}
            src={selectedUser?.image || undefined}
           
          />

          <h1 className="text-xl text-gray-900 dark:text-gray-100">
            Name: {selectedUser?.fullName}
          </h1>

          <h2 className="text-gray-700 dark:text-gray-300">
            User Name: {selectedUser?.userName}
          </h2>

          <h2 className="text-gray-700 dark:text-gray-300">
            Contact Info: {selectedUser?.phone}
          </h2>
        </div>
      </div>
    </>
  );
};

export default UserDetails;