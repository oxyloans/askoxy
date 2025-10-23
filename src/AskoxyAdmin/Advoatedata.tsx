// src/components/AdvocatesData.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Spin,
  Pagination,
  message,
  Button,
  Card,
  Tag,
} from "antd";
import axios from "axios";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

interface AdvocateUser {
  id: string;
  name1: string;
  name2: string;
  mobileNumber: string;
  createdAt: string;
  houseNumber: string;
}

interface ApiResponse {
  totalCount: number;
  activeUsersResponse: AdvocateUser[];
}

interface AdminComment {
  adminComments: string;
  commentsCreatedDate: string;
  commentsUpdateBy: string;
  adminUserId: string;
  customerBehaviour: string | null;
  isActive: boolean;
  customerExpectedOrderDate: string | null;
}

const COMMENTS_API =
  "https://meta.oxyloans.com/api/user-service/fetchAdminComments";

const AdvocatesDataPage: React.FC = () => {
  const [data, setData] = useState<AdvocateUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AdvocateUser | null>(
    null
  );

  // cache: userId -> AdminComment | null | "loading" | "error"
  const [commentsMap, setCommentsMap] = useState<
    Record<string, AdminComment | null | "loading" | "error">
  >({});

  const updatedBy = localStorage.getItem("admin_userName")?.toUpperCase();
  const storedUniqueId = localStorage.getItem("admin_uniquId");

  // -------- data fetch ----------
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/getAllAdvocatesData`,
        {
          params: { pageNo: currentPage, pageSize },
          headers: { "Content-Type": "application/json", accept: "*/*" },
        }
      );

      const rows = response.data?.activeUsersResponse || [];
      setData(rows);
      setTotalCount(response.data?.totalCount || 0);

      // prime & fetch comments in parallel for visible page
      const nextMap = { ...commentsMap };
      rows.forEach((u) => {
        if (nextMap[u.id] === undefined) nextMap[u.id] = "loading";
      });
      setCommentsMap(nextMap);

      Promise.all(
        rows.map(async (u) => {
          try {
            const res = await axios.post<AdminComment[]>(COMMENTS_API, {
              userId: u.id,
            });
            const latest =
              Array.isArray(res.data) && res.data.length ? res.data[0] : null;
            setCommentsMap((prev) => ({ ...prev, [u.id]: latest }));
          } catch {
            setCommentsMap((prev) => ({ ...prev, [u.id]: "error" }));
          }
        })
      ).catch(() => {});
    } catch {
      message.error("Failed to fetch Advocates data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const showCommentsModal = (record: AdvocateUser) => {
    setSelectedRecord(record);
    setCommentsModalVisible(true);
  };

  const closeCommentsModalAndRefresh = () => {
    setCommentsModalVisible(false);
    fetchData();
  };

  const formatWhen = (raw?: string) => {
    if (!raw) return "";
    const match = raw.match(/\d{2}:\d{2}/); // HH:MM
    return match ? match[0] : "";
  };

  const colorPalette = useMemo(
    () => [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
    ],
    []
  );
  const getColorForName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash) % colorPalette.length;
    return colorPalette[index];
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      width: 140,
      render: (text: string) => {
        const lastFour = text ? text.slice(-4) : "";
        return (
          <Tag color="blue" style={{ fontSize: 12, padding: "2px 6px", margin: 0 }}>
            #{lastFour}
          </Tag>
        );
      },
    },
    {
      title: "User Name",
      dataIndex: "name1",
      key: "name1",
      width: 180,
      render: (text: string) => (
        <div style={{ lineHeight: 1.25 }}>{text || "—"}</div>
      ),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 160,
      render: (text: string) => (
        <Tag color="green" style={{ padding: "0 8px", fontSize: 12, margin: 0 }}>
          {text ? `📞 ${text}` : "No Mobile"}
        </Tag>
      ),
    },
    // ~15% narrower than original for a tighter layout
    {
      title: "Updated comments",
      key: "updatedComments",
      width: 440,
      render: (_: any, record: AdvocateUser) => {
        const info = commentsMap[record.id];
        if (info === "loading" || info === undefined) return <Spin size="small" />;
        if (info === "error" || info === null)
          return (
            <div className="text-gray-500 text-sm" style={{ lineHeight: 1.2 }}>
              <Tag style={{ margin: 0 }}>—</Tag> No recent comments
            </div>
          );

        const statusTag = info.isActive ? (
          <Tag color="green" style={{ margin: 0 }}>ACTIVE</Tag>
        ) : (
          <Tag color="red" style={{ margin: 0 }}>INACTIVE</Tag>
        );

        const name = info.commentsUpdateBy || "—";
        const color = getColorForName(name.toUpperCase());
        const when = formatWhen(info.commentsCreatedDate);

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, lineHeight: 1.2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {statusTag}
              <span
                className="text-gray-800"
                style={{
                  maxWidth: 360,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={info.adminComments || ""}
              >
                {info.adminComments || "—"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12, color: "#666" }}>
              <Tag color={color} style={{ margin: 0 }}>
                <strong>{name}</strong>
              </Tag>
              <span>at {when || "—"}</span>
              {info.customerBehaviour && <span>• {info.customerBehaviour}</span>}
            </div>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_: any, record: AdvocateUser) => (
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
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-800 m-0">All Advocates Data</h2>
 
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading Advocates..." />
        </div>
      ) : (
        <>
          <Table
            size="small"
            rowClassName={() => "compact-row"}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1100 }}
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
              showTotal={(t, range) => `${range[0]}-${range[1]} of ${t} advocates`}
            />
          </div>
        </>
      )}

      <HelpDeskCommentsModal
        open={commentsModalVisible}
        onClose={closeCommentsModalAndRefresh}
        userId={selectedRecord?.id}
        updatedBy={updatedBy}
        storedUniqueId={storedUniqueId}
        record={selectedRecord}
        BASE_URL={BASE_URL}
      />

      {/* Compact row styles */}
      <style>
        {`
        .compact-row .ant-table-cell {
          padding-top: 6px !important;
          padding-bottom: 6px !important;
        }
        .compact-row .ant-tag {
          line-height: 18px;
        }
        .compact-row .ant-btn-sm {
          height: 24px;
          padding: 0 8px;
          font-size: 12px;
        }
      `}
      </style>
    </Card>
  );
};

export default AdvocatesDataPage;
