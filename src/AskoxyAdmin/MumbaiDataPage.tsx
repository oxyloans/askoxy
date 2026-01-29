import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Spin,
  Pagination,
  message,
  Select,
  Button,
  Card,
  Tag,
  Row,
  Col,
  Input,
  Empty,
} from "antd";
import axios from "axios";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

interface MumbaiUser {
  id: string;
  mobileNumber: string;
  createdAt: string;
  isActive: boolean;
  address: string | null;
  assignedHelpdeskId: string | null;
  name: string;
  email: string | null;
  vechicleNumber: string | null;
}

interface ApiResponse {
  totalCount: number;
  activeUsersResponse: MumbaiUser[];
}

interface AdminComment {
  adminComments: string;
  commentsCreatedDate: string;
  commentsUpdateBy: string;
  adminUserId: string;
  customerBehaviour: string | null;
  isActive: boolean | null;
  customerExpectedOrderDate: string | null;
  callingType?: string | null;
}

type VHState = "idle" | "loading" | "ready" | "error";

const COMMENTS_API =
  "https://meta.oxyloans.com/api/user-service/fetchAdminComments";

// 🔍 Mumbai search response type
interface SearchMumbaiUser {
  userId?: string | null;
  userName?: string | null;
  name?: string | null;
  mobileNumber?: string | null;
  whastappNumber?: string | null;
  email?: string | null;
  address?: string | null;
}

const MumbaiDataPage: React.FC = () => {
  const [data, setData] = useState<MumbaiUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MumbaiUser | null>(null);

  const [commentsMap, setCommentsMap] = useState<
    Record<string, AdminComment | null | "loading" | "error">
  >({});

  const updatedBy = localStorage.getItem("admin_userName")?.toUpperCase();
  const storedUniqueId = localStorage.getItem("admin_uniquId");

  // 🔍 search state
  const [searchInput, setSearchInput] = useState("");
  const [searchState, setSearchState] = useState<VHState>("idle");
  const [searchResult, setSearchResult] = useState<SearchMumbaiUser | null>(
    null
  );

  // ---------------------------
  // FETCH MUMBAI DATA
  // ---------------------------
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/getAllMumbaiData`,
        {
          params: { pageNo: currentPage, pageSize },
          headers: { "Content-Type": "application/json", accept: "*/*" },
        }
      );

      const rows = response.data?.activeUsersResponse || [];
      setData(rows);
      setTotalCount(response.data?.totalCount || 0);

      const nextMap: any = { ...commentsMap };
      rows.forEach((u) => {
        if (nextMap[u.id] === undefined) nextMap[u.id] = "loading";
      });
      setCommentsMap(nextMap);

      // fetch comments
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
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch Mumbai data");
    } finally {
      setLoading(false);
    }
  };

  // QUICK ACTIVE CHANGE
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
          adminComments: "Updated user active status via Mumbai page",
          adminUserId: storedUniqueId,
          commentsUpdateBy,
          userId,
          isActive: value === "true",
          customerBehaviour: "UNDERSTANDING",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("User active status updated");

      setCommentsMap((prev) => {
        const old = prev[userId];
        const materialized: AdminComment =
          old && old !== "loading" && old !== "error"
            ? (old as AdminComment)
            : {
                adminComments: "—",
                commentsCreatedDate: new Date().toISOString(),
                commentsUpdateBy,
                adminUserId: String(storedUniqueId || ""),
                customerBehaviour: "UNDERSTANDING",
                customerExpectedOrderDate: null,
                isActive: value === "true",
              };

        return {
          ...prev,
          [userId]: { ...materialized, isActive: value === "true" },
        };
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to update status");
    }
  };

  const getSelectedIsActive = () => {
    if (!selectedRecord) return null;
    const info = commentsMap[selectedRecord.id];
    if (!info || info === "loading" || info === "error") return null;
    return (info as AdminComment).isActive;
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const showCommentsModal = (record: MumbaiUser) => {
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

  // 🔍 Mumbai Search
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

      const res = await axios.get<
        SearchMumbaiUser | { activeUsersResponse: SearchMumbaiUser[] } | null
      >(`${BASE_URL}/user-service/getMumbaiDataWithMobileOrUserId`, {
        params,
      });

      let payload: SearchMumbaiUser | null = null;

      if (res.data) {
        if (
          (res.data as any).activeUsersResponse &&
          Array.isArray((res.data as any).activeUsersResponse)
        ) {
          payload = (res.data as any).activeUsersResponse[0] ?? null;
        } else {
          payload = res.data as SearchMumbaiUser;
        }
      }

      setSearchResult(payload);
      setSearchState("ready");
      if (!payload)
        message.info("No Mumbai user found for the given input");
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

  // ---------------------------
  // TABLE COLUMNS (with limited widths)
  // ---------------------------
  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (text: string) => {
        const lastFour = text ? text.slice(-4) : "";
        return (
          <div
            style={{
              maxWidth: 80,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Tag
              color="blue"
              style={{ fontSize: 12, padding: "2px 6px", margin: 0 }}
            >
              #{lastFour}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string) => (
        <div
          style={{
            maxWidth: 140,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.25,
          }}
          title={text}
        >
          {text || "—"}
        </div>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 130,
      render: (text: string) => (
        <div
          style={{
            maxWidth: 120,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={text}
        >
          <Tag
            color="green"
            style={{ padding: "0 8px", fontSize: 12, margin: 0 }}
          >
            {text ? `📞 ${text}` : "No Mobile"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Updated comments",
      key: "updatedComments",
      width: 280,
      render: (_: any, record: MumbaiUser) => {
        const info = commentsMap[record.id];

        if (info === "loading" || info === undefined)
          return <Spin size="small" />;
        if (info === "error" || info === null)
          return (
            <div
              className="text-gray-500 text-sm"
              style={{ lineHeight: 1.2, maxWidth: 360 }}
            >
              <Tag style={{ margin: 0 }}>—</Tag> No recent comments
            </div>
          );

        const typedInfo = info as AdminComment;

        const statusTag =
          typedInfo.isActive == null ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-xs">User Active:</span>
              <Select
                style={{ width: 130 }}
                placeholder="Select"
                options={[
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },
                ]}
                value={"true"}
                onChange={(value: string) =>
                  handleQuickActiveChange(record.id, value as "true" | "false")
                }
                size="small"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {typedInfo.isActive ? (
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

        const name = typedInfo.commentsUpdateBy || "—";
        const color = getColorForName(name.toUpperCase());
        const when = formatWhen(typedInfo.commentsCreatedDate);

        // ✅ callingType can be "" or null, show only if non-empty
        const callingType = (info.callingType ?? "").trim(); // "" if null/undefined
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              lineHeight: 1.2,
              maxWidth: 360,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "nowrap",
              }}
            >
              {statusTag}
              <span
                className="text-gray-800"
                style={{
                  maxWidth: 220,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={typedInfo.adminComments || ""}
              >
                {typedInfo.adminComments || "—"}
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
              {typedInfo.customerBehaviour && (
                <span>• {typedInfo.customerBehaviour}</span>
              )}

              {callingType && <span>• CallingType: {callingType}</span>}
            </div>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      render: (_: any, record: MumbaiUser) => (
        <div
          style={{
            maxWidth: 80,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Button
            type="default"
            size="small"
            onClick={() => showCommentsModal(record)}
            className="rounded-md border border-blue-400 text-blue-600 hover:bg-blue-100"
          >
            Comments
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Card className="shadow-md rounded-lg border-0 mumbai-page-card">
        {/* Header + Search */}
        <div className="mb-3">
          <Row gutter={[12, 12]} align="middle" justify="space-between">
            <Col flex="auto">
              <h2 className="text-xl font-bold text-gray-800 m-0">
                All Mumbai Data
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

        {/* 🔍 Search Result */}
        {searchState !== "idle" && (
          <div className="mb-3">
            <Card size="small" className="border border-gray-200">
              {searchState === "loading" && (
                <div className="py-2">
                  <Spin size="small" /> Searching…
                </div>
              )}

              {searchState === "error" && (
                <Empty description="Search failed" />
              )}

              {searchState === "ready" && searchResult && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">Name</div>
                    <div className="font-medium">
                      {searchResult.userName ||
                        searchResult.name ||
                        "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Mobile</div>
                    <div className="font-medium">
                      {searchResult.mobileNumber || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Email</div>
                    <div className="font-medium">
                      {searchResult.email || "—"}
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

        {/* Main Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading Mumbai data..." />
          </div>
        ) : (
          <>
            <Table
              size="small"
              className="compact-table"
              rowClassName={() => "compact-row"}
              columns={columns as any}
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
                showTotal={(t, range) =>
                  `${range[0]}-${range[1]} of ${t} Mumbai records`
                }
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
          initialIsActive={getSelectedIsActive()}
        />

        {/* Compact Row + Limited Width Styling */}
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

          /* Limit width & ellipsis for all cells by default */
          .compact-table .ant-table-cell {
            max-width: 220px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          @media (max-width: 768px) {
            .mumbai-page-card {
              padding: 8px !important;
            }
          }
        `}
        </style>
      </Card>
    </div>
  );
};

export default MumbaiDataPage;