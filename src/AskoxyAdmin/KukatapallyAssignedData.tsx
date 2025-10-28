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
  Alert,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  WhatsAppOutlined,
  PhoneOutlined,
  SearchOutlined,
  MailOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

interface KukatpallyAssignedUser {
  userId: string;
  userName: string | null;
  mobileNumber: string | null;
  whastappNumber: string | null;
  familyMemberName: string | null;
  // (others exist but hidden)
}

interface SearchUser {
  userId: string | null;
  userType?: string | null;
  userName: string | null;
  mobileNumber: string | null;
  whastappNumber: string | null;
  countryCode?: string | null;
  whatsappVerified?: boolean | null;
  mobileVerified?: boolean | null;
  registeredFrom?: string | null;
  ericeCustomerId?: number | null;
  alterNativeMobileNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  pincode?: string | null;
  flatNo?: string | null;
  landMark?: string | null;
  addressType?: string | null;
  address: string | null;
  panNumber?: string | null;
  lastFourDigitsUserId?: string | null;
  userRegisterDate?: number | null;
  userRegisterCreatedDate?: string | null;
  aadharNumber?: string | null;
  gender?: string | null;
  assignCoins?: string | null;
  mutliChainCreatedAt?: string | null;
  multiChainAddress?: string | null;
  assignedTo?: string | null;
  isActive: boolean | null;
  familyMemberName: string | null;
  houseNumber?: string | null;
}

interface ApiResponse {
  totalCount: number;
  activeUsersResponse: KukatpallyAssignedUser[];
}

interface HelpDeskUser {
  userId: string;
  name: string;
  mail: string;
}

type SearchState = "idle" | "loading" | "ready" | "error";

const KukatpallyAssignedDataPage: React.FC = () => {
  // logged-in admin context
  const updatedBy = (
    localStorage.getItem("admin_userName") || ""
  ).toUpperCase();
  const storedUniqueId = localStorage.getItem("admin_uniquId") || "";

  // helpdesk selection (locked to logged-in admin)
  const [helpdeskUsers, setHelpdeskUsers] = useState<HelpDeskUser[]>([]);
  const [helpdeskUserId, setHelpdeskUserId] = useState<string>(""); // set after loading users

  // table data
  const [data, setData] = useState<KukatpallyAssignedUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // paging
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(100);

  // comments modal
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] =
    useState<KukatpallyAssignedUser | null>(null);

  // search (privacy-safe: only show email)
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [searchResult, setSearchResult] = useState<SearchUser | null>(null);

  // columns
  const columns: ColumnsType<KukatpallyAssignedUser> = useMemo(
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
        title: "User Name",
        dataIndex: "userName",
        key: "userName",
        width: 200,
        render: (text: string | null) => (
          <span className="font-medium text-gray-800">{text || "No Name"}</span>
        ),
      },
      {
        title: "Mobile / WhatsApp",
        key: "contact",
        width: 200,
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
        title: "Family Member Name",
        dataIndex: "familyMemberName",
        key: "familyMemberName",
        width: 220,
        render: (text: string | null) => (
          <span className="text-gray-800">{text || "Not Provided"}</span>
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
    []
  );

  // load helpdesk users then lock to logged-in admin
  const fetchHelpDeskUsers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user-service/getAllHelpDeskUsers`,
        {
          headers: { accept: "*/*" },
        }
      );
      const list: HelpDeskUser[] = Array.isArray(res.data) ? res.data : [];
      setHelpdeskUsers(list);

      // try by uniqueId first
      let id = "";
      if (storedUniqueId) {
        const byId = list.find((u) => u.userId === storedUniqueId);
        if (byId) id = byId.userId;
      }
      // fallback by name (case-insensitive)
      if (!id && updatedBy) {
        const byName = list.find(
          (u) => (u.name || "").toUpperCase() === updatedBy
        );
        if (byName) id = byName.userId;
      }
      // if still not found, fallback to first (no cross-leak but keeps page usable)
      if (!id && list.length > 0) id = list[0].userId;

      setHelpdeskUserId(id);
    } catch (e) {
      console.error("Failed to load helpdesk users", e);
      // still allow page to try with storedUniqueId directly
      setHelpdeskUserId(storedUniqueId || "");
    }
  };

  // fetch assigned users for this helpdesk admin
  const fetchKukatpallyAssigned = async (id: string, p = 1, s = 100) => {
    if (!id) {
      setData([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/assigned-kukatpally-users/${id}`,
        { params: { page: p, size: s } }
      );
      const list = Array.isArray(resp.data?.activeUsersResponse)
        ? resp.data.activeUsersResponse
        : [];
      setData(list);
      setTotal(resp.data?.totalCount ?? list.length);
    } catch (err) {
      console.error("Failed to fetch Kukatpally assigned users", err);
      setData([]);
      setTotal(0);
      message.error("Failed to fetch Kukatpally assigned users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpDeskUsers();
  }, []);

  useEffect(() => {
    if (helpdeskUserId) {
      fetchKukatpallyAssigned(helpdeskUserId, page, size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helpdeskUserId, page, size]);

  const header = useMemo(() => {
    const selected = helpdeskUsers.find((u) => u.userId === helpdeskUserId);
    // prefer server-provided name, else localStorage username
    const name = selected?.name || updatedBy || "Helpdesk";
    return `${name} — Kukatpally Assigned`;
  }, [helpdeskUsers, helpdeskUserId, updatedBy]);

  // --- Search helpers (email only + membership check) ---
  const extractEmailAndUserId = (
    raw: any
  ): { email: string | null; userId: string | null } => {
    if (!raw || typeof raw !== "object") return { email: null, userId: null };
    if (Array.isArray(raw) && raw.length > 0) {
      return { email: raw[0]?.email ?? null, userId: raw[0]?.userId ?? null };
    }
    let email = (raw as any).email ?? null;
    let userId = (raw as any).userId ?? null;
    if (
      Array.isArray((raw as any).activeUsersResponse) &&
      (raw as any).activeUsersResponse.length > 0
    ) {
      const first = (raw as any).activeUsersResponse[0];
      email = email ?? first?.email ?? null;
      userId = userId ?? first?.userId ?? null;
    }
    return { email, userId };
  };

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

      // allow either direct object or wrapped list from backend
      const res = await axios.get<
        SearchUser | { activeUsersResponse: SearchUser[] } | null
      >(`${BASE_URL}/user-service/getDataWithMobileOrUserId`, { params });

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
      if (!payload) message.info("No user found for the given input");
    } catch {
      message.error("Search failed");
      setSearchState("error");
    }
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
        <Col flex="none">
          <h1 className="text-2xl font-bold text-gray-800">
            Kukatpally Assigned Data
          </h1>
        </Col>

        <Col flex="auto" style={{ textAlign: "right" }}>
          <Input
            placeholder="Search by User ID or Mobile Number"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={doSearch}
            allowClear
            style={{ width: 280, marginRight: 8 }}
          />
          <Button
            icon={<SearchOutlined />}
            type="primary"
            onClick={doSearch}
            loading={searchState === "loading"}
          >
            Search
          </Button>
        </Col>
      </Row>

      {/* Search Result Display */}
      {searchState === "ready" && searchResult && (
        <Card className="mt-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <Row gutter={[16, 12]}>
            <Col span={12}>
              <strong>User Name:</strong>{" "}
              <span>{searchResult.userName || "—"}</span>
            </Col>
            <Col span={12}>
              <strong>Mobile:</strong>{" "}
              <Tag color="blue">
                <PhoneOutlined /> {searchResult.mobileNumber || "—"}
              </Tag>
            </Col>
            <Col span={12}>
              <strong>Family Member:</strong>{" "}
              <span>{searchResult.familyMemberName || "—"}</span>
            </Col>
            <Col span={12}>
              <strong>Address:</strong>{" "}
              <span>{searchResult.address || "—"}</span>
            </Col>
            <Col span={12}>
              <strong>User ID:</strong>{" "}
              <Tag color="purple">{searchResult.userId?.slice(-6) || "—"}</Tag>
            </Col>
            <Col span={12}>
              <strong>Active:</strong>{" "}
              <Tag color={searchResult.isActive ? "green" : "volcano"}>
                {searchResult.isActive === true
                  ? "Yes"
                  : searchResult.isActive === false
                  ? "No"
                  : "Not Set"}
              </Tag>
            </Col>
          </Row>
        </Card>
      )}

      {searchState === "ready" && !searchResult && (
        <Alert className="mt-3" message="No user found" type="info" showIcon />
      )}

      {searchState === "error" && (
        <Alert
          className="mt-3"
          message="Search failed. Please try again."
          type="error"
          showIcon
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading Kukatpally users..." />
        </div>
      ) : data.length === 0 ? (
        <Empty
          className="my-16"
          description="No Kukatpally-assigned users found"
        />
      ) : (
        <>
          <Table<KukatpallyAssignedUser>
            columns={columns}
            dataSource={data}
            rowKey={(r, i) => `${r.userId}-${i ?? 0}`}
            pagination={false}
            className="border border-gray-200 rounded-lg mt-3"
            scroll={{ x: 900 }}
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
                userName: selectedUser.userName ?? "",
                mobileNumber: selectedUser.mobileNumber ?? "",
                whastappNumber: selectedUser.whastappNumber ?? "",
                email: "",
                address: "",
                userType: "",
                id: selectedUser.userId,
                lastFourDigitsUserId: "",
                ericeCustomerId: 0,
                alterNativeMobileNumber: null,
                firstName: null,
                lastName: null,
                longitude: null,
                latitude: null,
                pincode: null,
                flatNo: null,
                landMark: null,
                addressType: null,
                panNumber: null,
                userRegisterDate: 0,
                userRegisterCreatedDate: "",
                aadharNumber: null,
                gender: null,
                assignCoins: "",
                mutliChainCreatedAt: null,
                multiChainAddress: null,
                assignedTo: "",
                registeredFrom: null,
                countryCode: null,
                whatsappVerified: false,
                mobileVerified: false,
              } as any)
            : null
        }
        BASE_URL={BASE_URL}
      />
    </Card>
  );
};

export default KukatpallyAssignedDataPage;
