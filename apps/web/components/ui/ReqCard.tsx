import { fetchRequests } from "@/services/fetchData";
import { handleRequest } from "@/services/writerRequest";
import { RequestType } from "@/types/requestsType";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Spin, Tag } from "antd";

const ReqCard = () => {
  const { data, isLoading } = useQuery<RequestType[]>({
    queryKey: ["requests"],
    queryFn: fetchRequests,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleRequest,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error || "failed");
      }
      queryClient.invalidateQueries({
        queryKey: ["requests"]
      })
      message.success(data.message || "success");
    },
  });

  const handleReject = ({ userId, reqId }: { userId: string; reqId: string; }) => {
    const status = "rejected";
    const role = "reader";
    mutation.mutate({
      status,
      role,
      userId,
      reqId,
    });
    console.log("Rejected");
  };

  const handleApprove = ({ userId, reqId }: { userId: string; reqId: string; }) => {
    const status = "approved";
    const role = "writer";
    mutation.mutate({
      status,
      role,
      userId,
      reqId,
    });
    console.log("Approved");
  };

  if(isLoading){
    return (<div className="flex items-center justify-center"><Spin/></div>)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((req) => (
        <div className="border-l-5 border-l-orange-500 rounded-2xl border-2 border-gray-500 flex flex-col gap-3 p-4 " key={req._id}>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1>{req.fullName}</h1>
              <p>{req.email}</p>
            </div>
            <div className="">
              <Tag>{req.reqStatus}</Tag>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-4">
              <div className="">
                <h1 className="text-sm text-gray-500">
                  <CalendarOutlined /> Date of Birth
                </h1>
                <p className="text-black text-base">{req.dateOfBirth}</p>
              </div>
              <div className="">
                <h1 className="text-sm text-gray-500">
                  <FileTextOutlined /> Content Type
                </h1>
                <p className="text-black text-base">{req.contentType}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="">
                <h1 className="text-sm text-gray-500">
                  <GiftOutlined /> Profession
                </h1>
                <p className="text-black text-base">{req.profession}</p>
              </div>
              <div className="">
                <h1 className="text-sm text-gray-500">Submitted</h1>
                <p className="text-black text-base">{req.createdAt}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-t-gray-500 pt-2">
            <h2 className="text-lg">Description</h2>
            <p className="text-base text-gray-500 font-thin">
              {req.description}
            </p>
          </div>
          <div className="flex justify-between w-full gap-2">
            <Button
              type="primary"
              className="bg-green-500! w-1/2"
              onClick={() => handleApprove({ userId: req.userId, reqId: req._id }) }
            >
              <CheckCircleOutlined />
              Approve
            </Button>
            <Button
              type="default"
              className="text-red-500! w-1/2"
              onClick={() =>
                handleReject({ userId: req.userId, reqId: req._id })
              }
            >
              <CloseCircleOutlined />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReqCard;
