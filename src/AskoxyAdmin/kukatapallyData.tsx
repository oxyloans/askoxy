// src/components/KukatpallyData.tsx
import React, { useEffect, useState } from "react";
import { Table, Spin, Pagination, message, Button, Card, Tag } from "antd";
import axios from "axios";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

interface KukatpallyUser {
  id: string;
  name1: string;
  name2: string;
  mobileNumber: string;
  createdAt: string;
  houseNumber: string;
}

interface ApiResponse {
  totalCount: number;
  activeUsersResponse: KukatpallyUser[];
}

const AllKukatpallyDataPage: React.FC = () => {
  const [data, setData] = useState<KukatpallyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<KukatpallyUser | null>(
    null
  );

  const updatedBy = localStorage.getItem("admin_userName")?.toUpperCase();
  const storedUniqueId = localStorage.getItem("admin_uniquId");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/AllKukatpallyData`,
        {
          params: {
            pageNo: currentPage,
            pageSize: pageSize,
          },
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (response.data) {
        setData(response.data.activeUsersResponse || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching Kukatpally data:", error);
      message.error("Failed to fetch Kukatpally data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const showCommentsModal = (record: KukatpallyUser) => {
    setSelectedRecord(record);
    setCommentsModalVisible(true);
  };

  const closeCommentsModalAndRefresh = () => {
    setCommentsModalVisible(false);
    fetchData();
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (text: string) => {
        const lastFour = text ? text.slice(-4) : "";
        return <Tag color="blue">#{lastFour}</Tag>;
      },
    },
    {
      title: "User Name",
      dataIndex: "name1",
      key: "name1",
      width: 160,
    },
    {
      title: "Alternative Name",
      dataIndex: "name2",
      key: "name2",
      width: 160,
    },
    {
      title: "House Number",
      dataIndex: "houseNumber",
      key: "houseNumber",
      width: 130,
      render: (text: string) => text || "-",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 150,
      render: (text: string) => (
        <Tag color="green">{text ? `📞 ${text}` : "No Mobile"}</Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (text: string) =>
        text
          ? new Date(text).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: KukatpallyUser) => (
        <Button
          type="default"
          size="small"
          onClick={() => showCommentsModal(record)}
          className="rounded-md border border-blue-400 text-blue-600 hover:bg-blue-100"
        >
          Comments
        </Button>
      ),
    },
  ];

  return (
    <Card className="shadow-md rounded-lg border-0">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800">All Kukatpally Data</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading Kukatpally Users..." />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            scroll={{ x: 900 }}
          />
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCount}
              onChange={handlePageChange}
              showQuickJumper
              showSizeChanger
              pageSizeOptions={["50", "100", "200", "300"]}
              showTotal={(t, range) => `${range[0]}-${range[1]} of ${t} users`}
            />
          </div>
        </>
      )}

      {/* Comments Modal */}
      <HelpDeskCommentsModal
        open={commentsModalVisible}
        onClose={closeCommentsModalAndRefresh}
        userId={selectedRecord?.id}
        updatedBy={updatedBy}
        storedUniqueId={storedUniqueId}
        record={selectedRecord}
        BASE_URL={BASE_URL}
      />
    </Card>
  );
};

export default AllKukatpallyDataPage;
