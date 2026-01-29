// src/components/KukatpallyData.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Spin,
  Pagination,
  message,
  Button,
  Card,
  Tag,
  Input,
  Empty,
  Select,
  Row,
  Col,
} from "antd";
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
  assignedHelpdeskId?: string | null; // ✅ NEW
}

interface HelpDeskUser {
  userId: string;
  name: string;
  mail?: string;
}

interface ApiResponse {
  totalCount: number;
  activeUsersResponse: KukatpallyUser[];
}

interface AdminComment {
  adminComments: string;
  commentsCreatedDate: string;
  commentsUpdateBy: string;
  adminUserId: string;
  customerBehaviour: string | null;
  isActive: boolean;
  customerExpectedOrderDate: string | null;
  callingType?: string | null;
}

type VHState = "idle" | "loading" | "ready" | "error";

const COMMENTS_API =
  "https://meta.oxyloans.com/api/user-service/fetchAdminComments";

const AllKukatpallyDataPage: React.FC = () => {
  const [data, setData] = useState<KukatpallyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [helpdeskUsers, setHelpdeskUsers] = useState<HelpDeskUser[]>([]);
  const [helpdeskMap, setHelpdeskMap] = useState<Record<string, string>>({});

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<KukatpallyUser | null>(
    null
  );

  const [commentsMap, setCommentsMap] = useState<
    Record<string, AdminComment | null | "loading" | "error">
  >({});

  const updatedBy = localStorage.getItem("admin_userName")?.toUpperCase();
  const storedUniqueId = localStorage.getItem("admin_uniquId");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/AllKukatpallyData`,
        {
          params: { pageNo: currentPage, pageSize },
          headers: { "Content-Type": "application/json", accept: "*/*" },
        }
      );

      const rows = response.data?.activeUsersResponse || [];
      setData(rows);
      setTotalCount(response.data?.totalCount || 0);

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
      );
    } catch {
      message.error("Failed to fetch Kukatpally data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/user-service/getAllHelpDeskUsers`,
          {
            headers: { accept: "*/*" },
          }
        );
        const list: HelpDeskUser[] = Array.isArray(res.data) ? res.data : [];
        setHelpdeskUsers(list);
        const m: Record<string, string> = {};
        list.forEach((u) => {
          if (u.userId) m[u.userId] = u.name || u.userId;
        });
        setHelpdeskMap(m);
      } catch {
        // Non-fatal; column will fallback to ID/—.
        setHelpdeskUsers([]);
        setHelpdeskMap({});
      }
    })();
  }, []);

  // Quick toggle Active/Inactive inline in the table (defaults to YES if unset)
  const handleQuickActiveChange = async (
    userId: string,
    value: "true" | "false"
  ) => {
    try {
      const commentsUpdateBy =
        localStorage.getItem("admin_primaryType") === "HELPDESKSUPERADMIN"
          ? "ADMIN"
          : updatedBy || "ADMIN";

      await axios.patch(
        `${BASE_URL}/user-service/adminUpdateComments`,
        {
          adminComments: "Updated user active status via Kukatpally page",
          adminUserId: storedUniqueId,
          commentsUpdateBy,
          userId,
          isActive: value === "true",
          customerBehaviour: "UNDERSTANDING",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("User active status updated");

      // Update local cache
      setCommentsMap((prev) => {
        const old = prev[userId];
        const materialized =
          old && old !== "loading" && old !== "error"
            ? old
            : {
                adminComments: "—",
                commentsCreatedDate: new Date().toISOString(),
                commentsUpdateBy,

                adminUserId: String(storedUniqueId || ""),
                customerBehaviour: "UNDERSTANDING",
                customerExpectedOrderDate: null,
                isActive: value === "true",
                callingType: "", // ✅ keep default
              };
        return {
          ...prev,
          [userId]: { ...materialized, isActive: value === "true" },
        };
      });
    } catch {
      message.error("Failed to update status");
    }
  };

  const getSelectedIsActive = () => {
    if (!selectedRecord) return null;
    const info = commentsMap[selectedRecord.id];
    if (!info || info === "loading" || info === "error") return null;
    return (info as AdminComment).isActive; // boolean
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

  const formatWhen = (raw?: string) => {
    if (!raw) return "";
    const match = raw.match(/\d{2}:\d{2}/);
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

  const [searchInput, setSearchInput] = useState("");
  const [searchState, setSearchState] = useState<VHState>("idle");
  const [searchResult, setSearchResult] = useState<any>(null);

  const doSearch = async () => {
    const q = (searchInput || "").trim();
    if (!q) {
      setSearchResult(null);
      setSearchState("idle");
      return;
    }
    try {
      setSearchState("loading");
      const isMobile = /^\d{8,}$/.test(q);
      const params = isMobile ? { mobileNumber: q } : { userId: q };
      const res = await axios.get(
        `${BASE_URL}/user-service/getDataWithMobileOrUserId`,
        { params }
      );
      setSearchResult(res.data || null);
      setSearchState("ready");
      if (!res.data) message.info("No user found for the given input");
    } catch {
      message.error("Search failed");
      setSearchState("error");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchResult(null);
    setSearchState("idle");
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
          <Tag
            color="blue"
            style={{ fontSize: 12, padding: "2px 6px", margin: 0 }}
          >
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
      title: "Alternative Name",
      dataIndex: "name2",
      key: "name2",
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
        <Tag
          color="green"
          style={{ padding: "0 8px", fontSize: 12, margin: 0 }}
        >
          {text ? `📞 ${text}` : "No Mobile"}
        </Tag>
      ),
    },

    {
      title: "Assigned To",
      dataIndex: "assignedHelpdeskId",
      key: "assignedHelpdeskId",
      width: 120,
      render: (id: string | null, record: KukatpallyUser) => {
        const name = id ? helpdeskMap[id] : null;
        return (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Tag color={name ? "geekblue" : "default"} style={{ margin: 0 }}>
              {name || "—"}
            </Tag>
          </div>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      width: 110,
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
    // ✅ Reduced width from 520 → 440 (approx. 15% less)
    {
      title: "Updated comments",
      key: "updatedComments",
      width: 440,
      render: (_: any, record: KukatpallyUser) => {
        const info = commentsMap[record.id];
        if (info === "loading" || info === undefined)
          return <Spin size="small" />;

        if (info === "error" || info === null)
          return (
            <div className="text-gray-500 text-sm" style={{ lineHeight: 1.2 }}>
              <Tag style={{ margin: 0 }}>—</Tag> No recent comments
            </div>
          );

        const needsDecision =
          info.isActive === null || info.isActive === undefined;

        const statusTag = needsDecision ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-700 text-xs">User Active:</span>
            <Select
              style={{ width: 160 }}
              placeholder="Select status"
              options={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={"true"} // ✅ default to Yes
              onChange={(value: string) =>
                handleQuickActiveChange(record.id, value as "true" | "false")
              }
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {info.isActive ? (
              <Tag color="green" style={{ margin: 0 }}>
                ACTIVE
              </Tag>
            ) : (
              <Tag color="red" style={{ margin: 0 }}>
                INACTIVE
              </Tag>
            )}
            <Button
              type="link"
              size="small"
              onClick={() => showCommentsModal(record)}
              className="p-0"
            >
              Change
            </Button>
          </div>
        );

        const name = info.commentsUpdateBy || "—";
        const color = getColorForName(name.toUpperCase());
        const when = formatWhen(info.commentsCreatedDate);

        // ✅ callingType can be "" or null, show only if non-empty
      const callingType = (info.callingType ?? "").trim(); // "" if null/undefined


        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              lineHeight: 1.2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                fontSize: 12,
                color: "#666",
              }}
            >
              <Tag color={color} style={{ margin: 0 }}>
                <strong>{name}</strong>
              </Tag>

              <span>at {when || "—"}</span>

              {info.customerBehaviour && (
                <span>• {info.customerBehaviour}</span>
              )}

              {callingType && <span>• CallingType: {callingType}</span>}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Card className="shadow-md rounded-lg border-0">
      <div className="mb-3">
        <Row gutter={[12, 12]} align="middle" justify="space-between">
          <Col flex="auto">
            <h2 className="text-xl font-bold text-gray-800 m-0">
              All Kukatpally Data
            </h2>
            
          </Col>
          <Col flex="360px">
            <div className="flex gap-2">
              <Input.Search
                placeholder="Search by Mobile or User ID"
                allowClear
                enterButton="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSearch={doSearch}
              />
              {searchState === "ready" && (
                <Button onClick={clearSearch}>Clear</Button>
              )}
            </div>
          </Col>
        </Row>
      </div>

      {searchState !== "idle" && (
        <div className="mb-3">
          <Card size="small" className="border border-gray-200">
            {searchState === "loading" && (
              <div className="py-2">
                <Spin size="small" /> Searching…
              </div>
            )}
            {searchState === "error" && <Empty description="Search failed" />}
            {searchState === "ready" && searchResult && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                <div>
                  <div className="text-gray-500">Name</div>
                  <div className="font-medium">{searchResult.name || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Mobile</div>
                  <div className="font-medium">
                    {searchResult.mobileNumber || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Whatsapp</div>
                  <div className="font-medium">
                    {searchResult.whastappNumber || "—"}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-gray-500">Address</div>
                  <div className="font-medium">
                    {searchResult.address || "—"}
                  </div>
                </div>
              </div>
            )}
            {searchState === "ready" && !searchResult && (
              <Empty description="No user found" />
            )}
          </Card>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading Kukatpally Users..." />
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
            scroll={{ x: 1200 }}
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

      <HelpDeskCommentsModal
        open={commentsModalVisible}
        onClose={closeCommentsModalAndRefresh}
        userId={selectedRecord?.id}
        updatedBy={updatedBy}
        storedUniqueId={storedUniqueId}
        record={selectedRecord}
        BASE_URL={BASE_URL}
        initialIsActive={getSelectedIsActive()} // ✅ add this
      />

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

export default AllKukatpallyDataPage;
