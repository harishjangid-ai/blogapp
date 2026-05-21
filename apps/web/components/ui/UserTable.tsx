import { formatDateTime } from "@/hooks/formatDate";
import { fetchUsers } from "@/services/users";
import { User } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { useMemo, useState } from "react";

const UserTable = () => {
  const [search, setSearch] = useState<string>("");
  const { data } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUser = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data?.filter(
      (d) =>
        d.fullName.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) ||
        d.userName.toLowerCase().includes(q),
    );
  }, [search, data]);

  return (
    <main className="flex flex-col border border-gray-400/50 rounded-2xl py-2 px-3 bg-white/50">
      <h3 className="text-xl font-thin">All Users</h3>
      <Input
        placeholder="Search by name or email..."
        className="w-75!"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="w-full p-4">
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">User</th>
                <th className="p-4 font-semibold text-gray-600">Phone</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Joined Date</th>
                <th className="p-4 font-semibold text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUser?.map((data) => (
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {data.fullName.split(" ").map(word=>word[0].toUpperCase()).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {data.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{data.userName}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-700">{data.phone}</td>

                  <td className="p-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                      {data.role}
                    </span>
                  </td>

                  <td className="p-4 text-gray-700">
                    {formatDateTime(data.createdAt)}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button className={`${data.role === "admin" ? "cursor-not-allowed" : "cursor-pointer"} bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm`}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden mt-4 bg-white shadow rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              HS
            </div>
            <div>
              <div className="font-medium">Harish Suthar</div>
              <div className="text-xs text-gray-500">@harish</div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <div>
              <span className="font-medium">Email:</span> harish@example.com
            </div>
            <div>
              <span className="font-medium">Role:</span> Admin
            </div>
            <div>
              <span className="font-medium">Joined:</span> 2023-01-01
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="flex-1 bg-blue-500 text-white py-2 rounded-md text-sm">
              Edit
            </button>
            <button className="flex-1 bg-red-500 text-white py-2 rounded-md text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserTable;
