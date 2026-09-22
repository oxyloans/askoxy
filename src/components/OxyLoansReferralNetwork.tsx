import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import {
  DownOutlined,
  RightOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";

const { Title, Text } = Typography;
const API_BASE = `${BASE_URL.replace(/\/$/, "")}/user-service`;

type ReferralRoleStatus = {
  clicked?: boolean;
  registered?: boolean;
  loginCount?: number;
  activity?: unknown;
};

type ReferralNode = {
  userId?: string;
  askoxyUserId?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  referralStatus?: string;
  askOxyRegistered?: boolean;
  oxyloans?: {
    borrower?: ReferralRoleStatus;
    lender?: ReferralRoleStatus;
    partner?: ReferralRoleStatus;
  };
  child?: ReferralNode | ReferralNode[];
  children?: ReferralNode | ReferralNode[];
};

type ApiEnvelope<T> = { success: boolean; message?: string; data: T };

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]{1,49}$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

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

const getApiMessage = (error: unknown): string => {
  const data = (error as { response?: { data?: { message?: string } } })
    ?.response?.data;
  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message.trim();
  }
  if (error instanceof Error && error.message.trim()) return error.message.trim();
  return "";
};

const showToast = (
  icon: "success" | "warning" | "error",
  title: string,
) => {
  if (!title) return;
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toastEl) => {
      toastEl.onmouseenter = Swal.stopTimer;
      toastEl.onmouseleave = Swal.resumeTimer;
    },
  }).fire({ icon, title });
};

const toNodeList = (value: unknown): ReferralNode[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "object");
  }
  if (typeof value === "object") return [value as ReferralNode];
  return [];
};

const getChildNodes = (node: ReferralNode | null | undefined): ReferralNode[] => {
  if (!node || typeof node !== "object") return [];

  if (Array.isArray(node.children)) {
    return toNodeList(node.children);
  }

  if (node.child != null) {
    return toNodeList(node.child);
  }

  return [];
};

const getDisplayName = (node: ReferralNode) =>
  node.name ||
  node.mobileNumber ||
  node.email ||
  node.userId ||
  node.askoxyUserId ||
  "Referral user";

const collectRootNodes = (
  data: ReferralNode | ReferralNode[] | null,
): ReferralNode[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return [data];
};

const ReferralCard: React.FC<{ node: ReferralNode }> = ({ node }) => {
  const displayName = getDisplayName(node);
  const showEmail = Boolean(node.email && node.email !== displayName);
  const showMobile = Boolean(
    node.mobileNumber && node.mobileNumber !== displayName,
  );

  return (
    <div className="min-w-0 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-purple-200 hover:shadow-[0_6px_18px_rgba(15,23,42,0.06)] sm:p-4 lg:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar
            size={36}
            icon={<UserOutlined />}
            className="shrink-0"
            style={{
              backgroundColor: "#f5f3ff",
              color: "#722ed1",
              border: "1px solid #e9d5ff",
            }}
          />
          <div className="min-w-0">
            <Text
              strong
              ellipsis={{ tooltip: displayName }}
              className="block max-w-full !text-[15px] !text-slate-900 sm:!text-base"
            >
              {displayName}
            </Text>
            <div className="mt-1 flex flex-col gap-0.5">
              {showEmail && (
                <Text className="break-all !text-xs !text-slate-500 sm:!text-[13px]">
                  {node.email}
                </Text>
              )}
              {showMobile && (
                <Text className="!text-xs !text-slate-500 sm:!text-[13px]">
                  {node.mobileNumber}
                </Text>
              )}
            </div>
          </div>
        </div>

        {node.referralStatus && (
          <Tag
            color={
              String(node.referralStatus).toUpperCase() === "REGISTERED"
                ? "success"
                : "default"
            }
            className="m-0 w-fit shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:text-xs"
          >
            {node.referralStatus}
          </Tag>
        )}
      </div>

      {node.oxyloans && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:gap-3">
            {(["borrower", "lender", "partner"] as const).map((role) => {
              const item = node.oxyloans?.[role];
              if (!item) return null;
              const roleLabel = role[0].toUpperCase() + role.slice(1);
              const state = item.registered
                ? "Registered"
                : item.clicked
                  ? "Started"
                  : "Not started";

              const roleStyle =
                role === "borrower"
                  ? {
                      background: "#f8fafc",
                      borderColor: "#e2e8f0",
                      labelColor: "#334155",
                    }
                  : role === "lender"
                    ? {
                        background: "#f5f3ff",
                        borderColor: "#e9d5ff",
                        labelColor: "#6d28d9",
                      }
                    : {
                        background: "#f0fdfa",
                        borderColor: "#ccfbf1",
                        labelColor: "#0f766e",
                      };

              return (
                <div
                  key={role}
                  className="rounded-lg border p-3 transition-colors sm:p-3.5"
                  style={{
                    backgroundColor: roleStyle.background,
                    borderColor: roleStyle.borderColor,
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Text
                      strong
                      className="!text-xs sm:!text-[13px]"
                      style={{ color: roleStyle.labelColor }}
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
                      className="m-0 rounded-full px-2 text-[10px] font-medium"
                    >
                      {state}
                    </Tag>
                  </div>
                  <Text className="mt-1.5 block !text-[11px] !text-slate-500 sm:!text-xs">
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
  );
};

const ReferralBranch: React.FC<{ node: ReferralNode; depth?: number }> = ({
  node,
  depth = 0,
}) => {
  // Show only the root user's direct `children`.
  // Do NOT render `children` inside a referral item, whether empty or populated.
  const children = depth === 0 ? getChildNodes(node) : [];
  const [open, setOpen] = useState(true);

  return (
    <div
      className={
        depth
          ? "ml-2 border-l-2 border-purple-100 pl-2 sm:ml-6 sm:pl-4 lg:ml-8"
          : ""
      }
    >
      <div className="flex items-start gap-1.5 py-2 sm:gap-2.5 sm:py-2.5">
        {children.length > 0 ? (
          <Button
            type="text"
            size="small"
            className="mt-2.5 shrink-0 !h-8 !w-8 !min-w-8 rounded-full !text-purple-700 hover:!bg-purple-50"
            aria-label={open ? "Hide referrals" : "Show referrals"}
            icon={open ? <DownOutlined /> : <RightOutlined />}
            onClick={() => setOpen((value) => !value)}
          />
        ) : (
          <span className="mt-2.5 inline-block w-8 shrink-0" />
        )}
        <ReferralCard node={node} />
      </div>

      {open &&
        children.map((child, index) => (
          <ReferralBranch
            key={
              child.userId ||
              child.askoxyUserId ||
              child.mobileNumber ||
              `${depth}-${index}`
            }
            node={child}
            depth={depth + 1}
          />
        ))}
    </div>
  );
};

const OxyloansAddReferralNetwork = ({
  openModal,
  onClose,
  onAdded,
}: {
  openModal: boolean;
  onClose: () => void;
  onAdded: () => void;
}) => {
  const [form] = Form.useForm<{
    referralName: string;
    mobileNumber: string;
    role: "BORROWER" | "LENDER" | "PARTNER";
  }>();
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    form.resetFields();
  };

  const handleAddReferral = async (values: {
    referralName: string;
    mobileNumber: string;
    role: "BORROWER" | "LENDER" | "PARTNER";
  }) => {
    setSubmitting(true);
    try {
      const response = await customerApi.post(`${API_BASE}/referrals`, {
        refereeMobileNumber: values.mobileNumber.trim(),
        refereeName: values.referralName.trim(),
        role: values.role,
      });
      const payload = response.data as ApiEnvelope<unknown>;

      if (payload?.success === false) {
        const message = payload?.message || "";
        if (message) showToast("error", message);
        return;
      }

      if (payload?.message) showToast("success", payload.message);
      resetForm();
      onClose();
      onAdded();
    } catch (error) {
      const message = getApiMessage(error);
      if (message) showToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add Referral"
      open={openModal}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      afterClose={resetForm}
      destroyOnClose
      centered
      width={480}
      styles={{
        header: { paddingBottom: 12 },
        body: { paddingTop: 4 },
        footer: { paddingTop: 12 },
      }}
      maskClosable={!submitting}
      closable={!submitting}
      okText="Add Referral"
      cancelText="Cancel"
      confirmLoading={submitting}
      onOk={() => form.submit()}
      okButtonProps={{ icon: <UserAddOutlined /> }}
      cancelButtonProps={{ disabled: submitting }}
    >
      <style>{`
        .referral-toast-only-form .ant-form-item-explain {
          display: none !important;
        }
      `}</style>
      <Form
        form={form}
        layout="vertical"
        className="referral-toast-only-form"
        initialValues={{ role: "LENDER" }}
        onFinish={handleAddReferral}
        onFinishFailed={({ errorFields }) => {
          const message = errorFields[0]?.errors?.[0];
          if (message) showToast("warning", message);
        }}
        autoComplete="off"
        requiredMark
      >
        <Form.Item
          label="Referral Name"
          name="referralName"
          validateTrigger="onSubmit"
          rules={[
            { required: true, message: "Please enter the referral name." },
            { whitespace: true, message: "Please enter the referral name." },
            { min: 2, message: "Name must be at least 2 characters." },
            { max: 50, message: "Name cannot be longer than 50 characters." },
            {
              pattern: NAME_PATTERN,
              message:
                "Use letters only. Spaces, dots, apostrophes, and hyphens are allowed.",
            },
          ]}
        >
          <Input size="large" placeholder="Enter full name" maxLength={50} className="rounded-lg" />
        </Form.Item>

        <Form.Item
          label="Mobile Number"
          name="mobileNumber"
          validateTrigger="onSubmit"
          rules={[
            { required: true, message: "Please enter a mobile number." },
            {
              pattern: MOBILE_PATTERN,
              message:
                "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.",
            },
          ]}
          getValueFromEvent={(event) =>
            String(event?.target?.value || "").replace(/\D/g, "").slice(0, 10)
          }
        >
          <Input
            size="large"
            placeholder="9876543210"
            addonBefore="+91"
            maxLength={10}
            inputMode="numeric"
            autoComplete="tel"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label="Referral Role"
          name="role"
          validateTrigger="onSubmit"
          rules={[{ required: true, message: "Please select a referral role." }]}
        >
          <Select
            size="large"
            placeholder="Select role"
            className="w-full"
            options={[
              { value: "BORROWER", label: "Borrower" },
              { value: "LENDER", label: "Lender" },
              { value: "PARTNER", label: "Partner" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const OxyLoansReferralNetwork: React.FC = () => {
  const askoxyUserId = useMemo(() => getUserId(), []);
  const [data, setData] = useState<ReferralNode | ReferralNode[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const loadNetwork = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!askoxyUserId) {
        if (!options?.silent) {
          showToast(
            "error",
            "We could not find your AskOxy user ID. Please sign in again.",
          );
        }
        setLoading(false);
        return;
      }

      if (!options?.silent) setLoading(true);
      try {
        const response = await customerApi.get(
          `${API_BASE}/referral-tree/${encodeURIComponent(askoxyUserId)}`,
        );
        const payload = response.data as ApiEnvelope<
          ReferralNode | ReferralNode[]
        >;
        if (payload?.success === false) {
          const message = payload?.message || "";
          if (message) showToast("error", message);
          setData(null);
          return;
        }
        setData(payload?.data || null);
      } catch (err) {
        const message = getApiMessage(err);
        if (message) showToast("error", message);
      } finally {
        setLoading(false);
      }
    },
    [askoxyUserId],
  );

  useEffect(() => {
    loadNetwork();
  }, [loadNetwork]);

  const roots = useMemo(() => collectRootNodes(data), [data]);

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
      <div className="min-h-full bg-slate-50/60">
        <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-7">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <Title
              level={3}
              className="!m-0 !text-lg !font-semibold !text-purple-800 sm:!text-2xl"
            >
              Referral Network
            </Title>

            <Button
              type="primary"
              icon={<UserAddOutlined />}
              className="shrink-0 !h-9 rounded-lg !px-3 text-sm font-medium shadow-sm sm:!h-10 sm:!px-4"
              onClick={() => setOpenModal(true)}
            >
              Add Referral
            </Button>
          </div>



          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_4px_rgba(15,23,42,0.04)] sm:p-3 lg:p-4">
            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-xl bg-white">
                <Spin size="default" />
              </div>
            ) : !roots.length ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-white">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No referral-network data available yet."
                />
              </div>
            ) : (
              <div>
                {roots.map((node, index) => (
                  <ReferralBranch
                    key={
                      node.userId ||
                      node.askoxyUserId ||
                      node.mobileNumber ||
                      index
                    }
                    node={node}
                  />
                ))}
              </div>
            )}
          </div>

          <OxyloansAddReferralNetwork
            openModal={openModal}
            onClose={() => setOpenModal(false)}
            onAdded={() => loadNetwork({ silent: true })}
          />
        </main>
      </div>
    </ConfigProvider>
  );
};

export default OxyLoansReferralNetwork;
