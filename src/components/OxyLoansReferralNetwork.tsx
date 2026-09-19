import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  ConfigProvider,
  Empty,
  Input,
  Modal,
  Select,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import {
  ApartmentOutlined,
  DownOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import Swal from "sweetalert2";

const { Title, Text } = Typography;
const API_BASE = `${BASE_URL.replace(/\/$/, "")}/user-service`;

type ReferralNode = {
  userId?: string;
  askoxyUserId?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  referralStatus?: string;
  oxyloans?: {
    borrower?: {
      clicked?: boolean;
      registered?: boolean;
      loginCount?: number;
      activity?: unknown;
    };
    lender?: {
      clicked?: boolean;
      registered?: boolean;
      loginCount?: number;
      activity?: unknown;
    };
    partner?: {
      clicked?: boolean;
      registered?: boolean;
      loginCount?: number;
      activity?: unknown;
    };
  };
  child?: ReferralNode[];
  children?: ReferralNode[];
  referrals?: ReferralNode[];
};

type ApiEnvelope<T> = { success: boolean; message?: string; data: T };

const readJson = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const getUserId = () => {
  const direct = localStorage.getItem("userId")?.trim();
  if (direct) return direct;
  for (const key of ["user", "auth", "authData", "loginData"]) {
    const value = readJson(key);
    const id =
      value?.userId ||
      value?.data?.userId ||
      value?.data?.body?.userId ||
      value?.body?.userId;
    if (id) return String(id);
  }
  return "";
};

const getAccessToken = () => {
  for (const key of ["accessToken", "token", "authToken", "jwtToken"]) {
    const value = localStorage.getItem(key)?.trim();
    if (value) return value.replace(/^Bearer\s+/i, "");
  }
  for (const key of ["user", "auth", "authData", "loginData"]) {
    const value = readJson(key);
    const token =
      value?.accessToken ||
      value?.token ||
      value?.data?.accessToken ||
      value?.data?.token ||
      value?.data?.body?.accessToken;
    if (token) return String(token).replace(/^Bearer\s+/i, "");
  }
  return "";
};

const apiRequest = async <T,>(path: string): Promise<ApiEnvelope<T>> => {
  const token = getAccessToken();
  if (!token)
    throw new Error("Your login session is missing. Please sign in again.");
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false)
    throw new Error(payload?.message || `Request failed (${response.status})`);
  return payload as ApiEnvelope<T>;
};

const ReferralTree: React.FC<{ node: ReferralNode; depth?: number }> = ({
  node,
  depth = 0,
}) => {
  const [open, setOpen] = useState(depth < 1);
  const children = node.children || node.child || node.referrals || [];
  const displayName =
    node.name ||
    node.email ||
    node.mobileNumber ||
    node.userId ||
    node.askoxyUserId ||
    "Referral user";

  const roleStyles = {
    borrower: { bg: "#e6f4ff", accent: "#1677ff" },
    lender: { bg: "#f9f0ff", accent: "#722ed1" },
    partner: { bg: "#e6fffb", accent: "#13c2c2" },
  } as const;

  return (
    <div
      className={
        depth ? "ml-2  pl-2 sm:ml-4 sm:pl-4" : ""
      }
    >
      <div className="flex items-start gap-2 py-2 sm:gap-3">
        <Button
          type="text"
          size="small"
          shape="circle"
          aria-label={open ? "Collapse referrals" : "Expand referrals"}
          disabled={!children.length}
          icon={
            children.length ? (
              open ? (
                <DownOutlined />
              ) : (
                <RightOutlined />
              )
            ) : (
              // <UserOutlined />" "
              " "
            )
          }
          onClick={() => children.length && setOpen((value) => !value)}
          className="mt-1 shrink-0"
        />

        <div className="min-w-0 flex-1 rounded-xl border border-[#f0f0f0] bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-[#d9d9d9] hover:shadow-md sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <Text
                strong
                ellipsis={{ tooltip: displayName }}
                className="block max-w-full text-sm sm:text-base"
              >
                {displayName}
              </Text>

              <div className="mt-1 flex flex-col gap-0.5">
                {node.email && (
                  <Text type="secondary" className="break-all text-xs">
                    {node.email}
                  </Text>
                )}

                {node.mobileNumber && (
                  <Text type="secondary" className="text-xs">
                    {node.mobileNumber}
                  </Text>
                )}

               
              </div>
            </div>

            {node.referralStatus && (
              <Tag
                color={
                  node.referralStatus === "REGISTERED" ? "success" : "default"
                }
                className="m-0 w-fit shrink-0 rounded-full px-2.5 py-0.5 text-[11px]"
              >
                {node.referralStatus}
              </Tag>
            )}
          </div>

          {node.oxyloans && (
            <div className="mt-3 border-t border-[#f0f0f0] pt-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(["borrower", "lender", "partner"] as const).map((role) => {
                  const item = node.oxyloans?.[role];
                  if (!item) return null;

                  const roleLabel = role[0].toUpperCase() + role.slice(1);
                  const state = item.registered
                    ? "Registered"
                    : item.clicked
                      ? "Started"
                      : "Not started";
                  const style = roleStyles[role];

                  return (
                    <div
                      key={role}
                      className="rounded-lg border border-[#f0f0f0] p-2.5"
                      style={{ backgroundColor: style.bg }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Text
                          strong
                          className="text-xs"
                          style={{ color: style.accent }}
                        >
                          {roleLabel}
                        </Text>

                        <Tag
                          color={
                            item.registered
                              ? "success"
                              : item.clicked
                                ? "processing"
                                : "default"
                          }
                          className="m-0 rounded-full text-[10px]"
                        >
                          {state}
                        </Tag>
                      </div>

                      <Text type="secondary" className="mt-1 block text-[11px]">
                        {item.loginCount ?? 0} login
                        {item.loginCount === 1 ? "" : "s"}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {open &&
        children.map((child, index) => (
          <ReferralTree
            key={child.userId || child.askoxyUserId || `${depth}-${index}`}
            node={child}
            depth={depth + 1}
          />
        ))}
    </div>
  );
};

const OxyloansAddReferralNetwork = ({ openModal, onClose }: any) => {
  const [referralName, setReferralName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [role, setRole] = useState<"BORROWER" | "LENDER" | "PARTNER">("LENDER");
  const [error, setError] = useState("");
  const handleAddReferral =async () => {
    if (!referralName || !mobileNumber || !role) {
      setError("Please fill in all required fields.");
      return;
    }
    // Here you can add the logic to submit the referral data to your API or state management
    console.log("Adding referral:", { referralName, mobileNumber, role });
  await  axios.post(`${API_BASE}/referrals`, {
      "refereeMobileNumber": mobileNumber,
      "refereeName": referralName,
      "role": role
    },{
  headers: {
    "Authorization": `Bearer ${getAccessToken()}`,
    "Content-Type": "application/json",
  }}
  )
    .then(response => {
      console.log("Referral added successfully:", response.data);
      setReferralName("");
      setMobileNumber("");
      setRole("LENDER");
      Swal.fire({
        title: 'Success!',
        text: 'Referral added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          onClose();
          setError("");
        }
      });
    }
    )
    .catch(error => {
      console.error("Error adding referral:", error);
      setError(error.response?.data?.message || "Failed to add referral. Please try again.");
    });
  }

  return (
    <Modal
      title={null}
      open={openModal}
      onCancel={() => {
        setReferralName("");
        setMobileNumber("");
        setRole("LENDER");
        setError("");
        onClose();
      }}
      destroyOnClose
      footer={null}
      centered
      width={480}
      className="referral-modal"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <span className="text-xl">👤</span>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add Referral
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Add a new member to your referral network
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Referral Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Referral Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <Input
              size="large"
              placeholder="Enter referral name"
              className="rounded-lg"
              value={referralName}
              onChange={(e) => setReferralName(e.target.value)}
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mobile Number
              <span className="ml-1 text-red-500">*</span>
            </label>

            <Input
              size="large"
              placeholder="Enter mobile number"
              maxLength={10}
              className="rounded-lg"
              addonBefore="+91"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Referral Role
              <span className="ml-1 text-red-500">*</span>
            </label>

            <Select
              size="large"
              className="w-full"
              placeholder="Select referral role"
              options={[
                {
                  value: "BORROWER",
                  label: "Borrower",
                },
                {
                  value: "LENDER",
                  label: "Lender",
                },
                {
                  value: "PARTNER",
                  label: "Partner",
                },
              ]}
              value={role}
              onChange={(value) => setRole(value)}
            />
          </div>
          {error && ( <span className="text-red-500 text-sm mt-4">{error}</span> )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
          <Button
            size="large"
            onClick={() => {
              setReferralName("");
              setMobileNumber("");
              setRole("LENDER");
              setError("");
              onClose();
            }}
            className="min-w-[100px] rounded-lg"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            size="large"
            className="min-w-[120px] rounded-lg"
            onClick={handleAddReferral}
          >
            Add Referral
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const OxyLoansReferralNetwork: React.FC = () => {
  const askoxyUserId = useMemo(() => getUserId(), []);
  const [data, setData] = useState<ReferralNode | ReferralNode[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal,setOpenModal]= useState(false)

  useEffect(() => {
    if (!askoxyUserId) {
      setError("We could not find your AskOxy user ID. Please sign in again.");
      setLoading(false);
      return;
    }
    apiRequest<ReferralNode | ReferralNode[]>(
      `/referral-tree/${encodeURIComponent(askoxyUserId)}`,
    )
      .then((result) => setData(result.data || null))
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load referral network.",
        ),
      )
      .finally(() => setLoading(false));
  }, [askoxyUserId]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#722ed1",
          borderRadius: 10,
          borderRadiusLG: 12,
        },
      }}
    >
      <div className="min-h-full">
        <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
          <Title level={3} className="!mb-4 !mt-0 !text-xl sm:!text-2xl">
            Referral Network
          </Title>
          {error && (
            <Alert
              className="mb-4"
              type="error"
              showIcon
              message="Unable to load referral network"
              description={error}
            />
          )}
          <div className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#f0f0f0] px-4 py-3 sm:px-5 row justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  size={34}
                  icon={<ApartmentOutlined />}
                  style={{ backgroundColor: "#e6fffb", color: "#08979c"}}
                />

                <div className="min-w-0">
                  <Text strong className="block text-sm sm:text-base">
                    OxyLoans Referral Network
                  </Text>
                  <Text type="secondary" className="text-xs">
                    View your referral hierarchy and OxyLoans journey status.
                  </Text>
                </div>
              </div>
              <div>
                  <Button 
                    type="primary"
                    size="small"
                    onClick={() => setOpenModal(true)}
                    >
                    <FaPlus />  ADD REFERRAL
                    </Button>
              </div>
            </div>

            <div className="p-3 sm:p-4 lg:p-5">
              {loading ? (
                <div className="flex min-h-[260px] items-center justify-center">
                  <Spin size="large" />
                </div>
              ) : !data ? (
                <div className="flex min-h-[220px] items-center justify-center">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No referral-network data available yet."
                  />
                </div>
              ) : Array.isArray(data) ? (
                <div className="space-y-2">
                  {data.map((node, index) => (
                    <ReferralTree
                      key={node.userId || node.askoxyUserId || index}
                      node={node}
                    />
                  ))}
                </div>
              ) : (
                <ReferralTree node={data} />
              )}
            </div>
          </div>
          <OxyloansAddReferralNetwork openModal={openModal} onClose={() => setOpenModal(false)} />
        </main>
      </div>
    </ConfigProvider>
  );
};

export default OxyLoansReferralNetwork;
