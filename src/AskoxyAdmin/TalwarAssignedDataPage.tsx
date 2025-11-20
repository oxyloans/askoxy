import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Spin,
  Empty,
  Row,
  Col,
  Button,
  Pagination,
  message,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  WhatsAppOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

interface AssignedTalwarUser {
  userId: string;
  userName: string | null; // ✅ comes from assigned API
  name?: string | null; // optional, in case backend sends both
  mobileNumber: string | null;
  whastappNumber: string | null;
  vechicleNumber: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean | null;
  createdAt?: string | null;
  assignedHelpdeskId?: string | null;
}

interface TalwarMasterUser {
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

interface TalwarMasterApiResponse {
  totalCount: number;
  activeUsersResponse: TalwarMasterUser[];
}

interface ApiResponse {
  totalCount: number;
  activeUsersResponse: AssignedTalwarUser[];
}

interface HelpDeskUser {
  userId: string;
  name: string;
  mail: string;
}

// ✅ Talwar search user (from getTalwarsDataWithMobileOrUserId)
interface SearchUser {
  userId: string | null;
  userName: string | null;
  mobileNumber: string | null;
  whastappNumber: string | null;
  email: string | null;
  address: string | null;
}

type SearchState = "idle" | "loading" | "ready" | "error";

const TalwarAssignedDataPage: React.FC = () => {
  // logged-in admin context
  const updatedBy = (
    localStorage.getItem("admin_userName") || ""
  ).toUpperCase();
  const storedUniqueId = localStorage.getItem("admin_uniquId") || "";

  // helpdesk selection (auto-locked to logged-in admin)
  const [helpdeskUsers, setHelpdeskUsers] = useState<HelpDeskUser[]>([]);
  const [helpdeskUserId, setHelpdeskUserId] = useState<string>("");

  // assigned talwar data
  const [data, setData] = useState<AssignedTalwarUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // paging
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(100);

  // comments modal
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] =
    useState<AssignedTalwarUser | null>(null);

  // 🔍 search
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [searchResult, setSearchResult] = useState<SearchUser | null>(null);

  // Talwar master data map: userId -> { name, vechicleNumber }
  const [talwarMasterMap, setTalwarMasterMap] = useState<
    Record<string, { name: string; vechicleNumber: string | null }>
  >({});

  // ----------------------------------
  // Load TALWAR MASTER DATA (name + vehicle)
  // ----------------------------------
  const loadTalwarMasterData = async () => {
    try {
      const response = await axios.get<TalwarMasterApiResponse>(
        `${BASE_URL}/user-service/getAllTalwarData`,
        {
          params: { pageNo: 1, pageSize: 100000 }, // big page to build map
          headers: { "Content-Type": "application/json", accept: "*/*" },
        }
      );

      const list = response.data?.activeUsersResponse || [];
      const map: Record<
        string,
        { name: string; vechicleNumber: string | null }
      > = {};

      list.forEach((u) => {
        map[u.id] = {
          name: u.name || "",
          vechicleNumber: u.vechicleNumber || null,
        };
      });

      setTalwarMasterMap(map);
    } catch (err) {
      console.error("Failed loading Talwar master data", err);
    }
  };

  useEffect(() => {
    // 🔹 First: load master data
    loadTalwarMasterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------
  // Table Columns (use master map for Name + Vehicle)
  // ----------------------------------
  const columns: ColumnsType<AssignedTalwarUser> = useMemo(
    () => [
      {
        title: "User ID",
        dataIndex: "userId",
        key: "userId",
        width: 100,
        render: (text: string) => (
          <Tag color="blue" className="font-normal text-sm">
            {text ? text.slice(-4) : "N/A"}
          </Tag>
        ),
      },
      {
        title: "Name",
        dataIndex: "userName",
        key: "userName",
        width: 220,
        render: (_: any, record) => {
          const fromMaster =
            talwarMasterMap[record.userId]?.name ||
            record.userName ||
            record.name ||
            "No Name";
          return (
            <span className="font-medium text-gray-800">{fromMaster}</span>
          );
        },
      },
      {
        title: "Mobile / WhatsApp",
        key: "contact",
        width: 180,
        render: (_: any, record) => {
          const phone = record.mobileNumber || record.whastappNumber || "";
          if (!phone) return <span className="text-gray-400">N/A</span>;
          const isWhatsApp = !!record.whastappNumber && !record.mobileNumber;
          return (
            <Tag
              color={isWhatsApp ? "green" : "purple"}
              style={{ fontSize: 14 }}
            >
              {isWhatsApp ? (
                <WhatsAppOutlined className="mr-1" />
              ) : (
                <PhoneOutlined className="mr-1" />
              )}
              {phone}
            </Tag>
          );
        },
      },
      {
        title: "Vehicle No.",
        dataIndex: "vechicleNumber",
        key: "vechicleNumber",
        width: 160,
        render: (_: any, record) => {
          const vehicleFromMaster =
            talwarMasterMap[record.userId]?.vechicleNumber ||
            record.vechicleNumber ||
            null;
          return (
            <Tag color="geekblue" style={{ fontSize: 13 }}>
              {vehicleFromMaster || "Not Provided"}
            </Tag>
          );
        },
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 240,
        render: (text: string | null) =>
          text ? (
            <span className="text-gray-800 flex items-center gap-1">
              <MailOutlined /> {text}
            </span>
          ) : (
            <span className="text-gray-400">No Email</span>
          ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        render: (_text, record) => (
          <Button
            size="small"
            className="rounded-md border border-blue-400 text-blue-600 hover:bg-blue-50"
            onClick={() => {
              setSelectedUser(record);
              setCommentsOpen(true);
            }}
          >
            Comments
          </Button>
        ),
      },
    ],
    [talwarMasterMap]
  );

  // ----------------------------------
  // Helpdesk users (to lock by logged-in admin)
  // ----------------------------------
  const fetchHelpDeskUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user-service/getAllHelpDeskUsers`, {
        headers: { accept: "*/*" },
      });
      const list: HelpDeskUser[] = Array.isArray(res.data) ? res.data : [];
      setHelpdeskUsers(list);

      let id = "";
      if (storedUniqueId) {
        const byId = list.find((u) => u.userId === storedUniqueId);
        if (byId) id = byId.userId;
      }
      if (!id && updatedBy) {
        const byName = list.find(
          (u) => (u.name || "").toUpperCase() === updatedBy
        );
        if (byName) id = byName.userId;
      }
      if (!id && list.length > 0) id = list[0].userId;

      setHelpdeskUserId(id);
    } catch (e) {
      console.error("Failed to load helpdesk users", e);
      setHelpdeskUserId(storedUniqueId || "");
    }
  };

  // ----------------------------------
  // Fetch ASSIGNED TALWAR USERS
  // ----------------------------------
  const fetchAssignedTalwar = async (id: string, p = 1, s = 100) => {
    if (!id) {
      setData([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/assigned-talwar-users/${id}`,
        { params: { page: p, size: s } }
      );
      const list = Array.isArray(resp.data?.activeUsersResponse)
        ? resp.data.activeUsersResponse
        : [];
      setData(list);
      setTotal(resp.data?.totalCount ?? list.length);
    } catch (err) {
      console.error("Failed to fetch Talwar assigned users", err);
      setData([]);
      setTotal(0);
      message.error("Failed to fetch Talwar assigned users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpDeskUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (helpdeskUserId) {
      fetchAssignedTalwar(helpdeskUserId, page, size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helpdeskUserId, page, size]);

  const header = useMemo(() => {
    const selected = helpdeskUsers.find((u) => u.userId === helpdeskUserId);
    const name = selected?.name || updatedBy || "Helpdesk";
    return `${name} — Talwar Assigned`;
  }, [helpdeskUsers, helpdeskUserId, updatedBy]);

  // ----------------------------------
  // Search (Talwar-specific API)
  // ----------------------------------
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
        SearchUser | { activeUsersResponse: SearchUser[] } | null
      >(`${BASE_URL}/user-service/getTalwarsDataWithMobileOrUserId`, {
        params,
      });

      let payload: SearchUser | null = null;
      if (res.data) {
        if (
          (res.data as any).activeUsersResponse &&
          Array.isArray((res.data as any).activeUsersResponse)
        ) {
          payload = (res.data as any).activeUsersResponse[0] ?? null;
        } else {
          payload = res.data as SearchUser;
        }
      }

      setSearchResult(payload);
      setSearchState("ready");
      if (!payload) message.info("No Talwar user found for the given input");
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

  return (
    <Card className="shadow-lg rounded-lg border-0">
      {/* Header + Search Row */}
      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        style={{ marginBottom: "1rem" }}
      >
        <Col flex="auto">
          <h1 className="text-2xl font-bold text-gray-800">
            Talwar Assigned Data
          </h1>
          <div className="text-xs text-gray-500">{header}</div>
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

      {/* 🔍 Search Result Card */}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="text-gray-500">Name</div>
                  <div className="font-medium">
                    {searchResult.userName || "—"}
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

      {/* Table / Loading / Empty */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading Talwar users..." />
        </div>
      ) : data.length === 0 ? (
        <Empty
          className="my-16"
          description="No Talwar-assigned users found"
        />
      ) : (
        <>
          <Table<AssignedTalwarUser>
            columns={columns}
            dataSource={data}
            rowKey={(r, i) => `${r.userId}-${i ?? 0}`}
            pagination={false}
            className="border border-gray-200 rounded-lg mt-3"
            scroll={{ x: 1100 }}
            size="middle"
            rowClassName={(_, idx) => (idx % 2 === 0 ? "bg-gray-50" : "")}
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              current={page}
              pageSize={size}
              total={total}
              onChange={(p, s) => {
                setPage(p);
                if (s) setSize(s);
              }}
              showSizeChanger
              pageSizeOptions={[50, 100, 200]}
              showQuickJumper
            />
          </div>
        </>
      )}

      {/* Comments Modal */}
      <HelpDeskCommentsModal
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        userId={selectedUser?.userId}
        updatedBy={updatedBy}
        storedUniqueId={storedUniqueId}
        record={
          selectedUser
            ? ({
                userId: selectedUser.userId,
                userName:
                  talwarMasterMap[selectedUser.userId]?.name ||
                  selectedUser.userName ||
                  selectedUser.name ||
                  "",
                mobileNumber: selectedUser.mobileNumber ?? "",
                whastappNumber: selectedUser.whastappNumber ?? "",
                email: selectedUser.email ?? "",
                address: selectedUser.address ?? "",
              } as any)
            : null
        }
        BASE_URL={BASE_URL}
      />
    </Card>
  );
};

export default TalwarAssignedDataPage;
