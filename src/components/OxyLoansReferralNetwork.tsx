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
  CheckCircleFilled,
  DownOutlined,
  LinkOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
  UpOutlined,
  WalletOutlined,
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
  referralRole?: "BORROWER" | "LENDER" | "PARTNER" | string;
  askOxyRegistered?: boolean;
  oxyloans?: {
    borrower?: ReferralRoleStatus;
    lender?: ReferralRoleStatus;
    partner?: ReferralRoleStatus;
  };
  child?: ReferralNode | ReferralNode[];
  children?: ReferralNode | ReferralNode[];
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]{1,49}$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

const roleMeta = {
  lender: {
    label: "Lender",
    icon: <WalletOutlined />,
    accent: "#6D28D9",
    soft: "#F5F3FF",
    border: "#EDE9FE",
  },
  borrower: {
    label: "Borrower",
    icon: <UserOutlined />,
    accent: "#2563EB",
    soft: "#EFF6FF",
    border: "#DBEAFE",
  },
  partner: {
    label: "Partner",
    icon: <TeamOutlined />,
    accent: "#0F766E",
    soft: "#F0FDFA",
    border: "#CCFBF1",
  },
} as const;

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

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

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
    return value.filter(
      (item): item is ReferralNode => Boolean(item && typeof item === "object"),
    );
  }

  if (typeof value === "object") return [value as ReferralNode];
  return [];
};

const getChildNodes = (
  node: ReferralNode | null | undefined,
): ReferralNode[] => {
  if (!node || typeof node !== "object") return [];

  if (Array.isArray(node.children)) {
    return toNodeList(node.children);
  }

  if (node.child != null) {
    return toNodeList(node.child);
  }

  return [];
};

const getDisplayName = (node: ReferralNode, isRoot = false) => {
  if (node.name?.trim()) return node.name.trim();
  return isRoot ? "You" : "Referral User";
};

const getReferralRoleLabel = (role?: string) => {
  if (!role) return "";

  const normalized = role.trim().toUpperCase();

  if (normalized === "LENDER") return "Lender";
  if (normalized === "BORROWER") return "Borrower";
  if (normalized === "PARTNER") return "Partner";

  return role
    .toLowerCase()
    .replace(/(^|\s|_)([a-z])/g, (_, separator, letter) =>
      `${separator === "_" ? " " : separator}${letter.toUpperCase()}`,
    );
};

const collectRootNodes = (
  data: ReferralNode | ReferralNode[] | null,
): ReferralNode[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getReferralState = (node: ReferralNode) => {
  const raw = String(node.referralStatus || "").toUpperCase();

  if (raw === "REGISTERED" || node.askOxyRegistered) {
    return "Registered";
  }

  if (raw) return node.referralStatus || "Invited";
  return "Invited";
};

const countDirectReferrals = (roots: ReferralNode[]) =>
  roots.reduce((total, root) => total + getChildNodes(root).length, 0);

const RoleStatus = ({
  role,
  item,
}: {
  role: keyof typeof roleMeta;
  item?: ReferralRoleStatus;
}) => {
  const meta = roleMeta[role];

  const state = item?.registered
    ? "Registered"
    : item?.clicked
      ? "Started"
      : "Not started";

  return (
    <div
      className="min-w-0 rounded-lg border px-2 py-1.5 sm:px-2.5 sm:py-2"
      style={{
        backgroundColor: meta.soft,
        borderColor: meta.border,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs"
          style={{
            color: meta.accent,
            border: `1px solid ${meta.border}`,
          }}
        >
          {meta.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="truncate text-[11px] font-bold sm:text-xs"
            style={{ color: meta.accent }}
          >
            {meta.label}
          </div>

          <div
            className={`mt-0.5 truncate text-[10px] font-semibold sm:text-[11px] ${
              item?.registered
                ? "text-emerald-600"
                : item?.clicked
                  ? "text-blue-600"
                  : "text-slate-400"
            }`}
          >
            {state}
          </div>
        </div>

        {item?.registered && (
          <CheckCircleFilled className="shrink-0 text-[12px] text-emerald-500" />
        )}
      </div>
    </div>
  );
};

const RootCard = ({ node }: { node: ReferralNode }) => {
  const displayName = getDisplayName(node, true);

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-[0_6px_20px_rgba(109,40,217,0.07)]">
      <div className="flex items-center gap-2 border-b border-violet-100 bg-violet-50/80 px-3 py-2.5 sm:px-4">
        <LinkOutlined className="text-violet-700" />
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-violet-700">
          Your Profile
        </span>
      </div>

      <div className="flex items-start gap-3 p-3.5 sm:p-4">
        <Avatar
          size={44}
          icon={<UserOutlined />}
          className="shrink-0"
          style={{ backgroundColor: "#6D28D9" }}
        />

        <div className="min-w-0 flex-1">
          <Text
            strong
            ellipsis={{ tooltip: displayName }}
            className="block !text-[15px] !text-slate-900 sm:!text-base"
          >
            {displayName}
          </Text>

          {node.mobileNumber && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
              <PhoneOutlined className="text-[11px]" />
              <span>{node.mobileNumber}</span>
            </div>
          )}

          {node.email && (
            <div className="mt-1 break-all text-xs leading-5 text-slate-500">
              {node.email}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReferralCard = ({
  node,
  index,
}: {
  node: ReferralNode;
  index: number;
}) => {
  const displayName = getDisplayName(node);
  const referralState = getReferralState(node);
  const referredAs = getReferralRoleLabel(node.referralRole);

  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
      <div className="p-3 sm:p-3.5 lg:p-4">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-xs font-bold text-violet-700 sm:h-10 sm:w-10">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <Text
                  strong
                  ellipsis={{ tooltip: displayName }}
                  className="block !text-[14px] !text-slate-900 sm:!text-[15px]"
                >
                  {displayName}
                </Text>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {node.mobileNumber && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 sm:text-xs">
                      <PhoneOutlined className="text-[10px]" />
                      {node.mobileNumber}
                    </span>
                  )}

                  {node.email && (
                    <span className="max-w-full break-all text-[11px] text-slate-400 sm:text-xs">
                      {node.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                <Tag
                  color={referralState === "Registered" ? "success" : "default"}
                  className="!m-0 rounded-full !px-2.5 !py-0.5 text-[10px] font-semibold"
                >
                  {referralState}
                </Tag>
              </div>
            </div>

            {referredAs && (
              <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-violet-100 bg-violet-50/70 px-2.5 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-500 sm:text-[11px]">
                  Referred as
                </span>
                <span className="rounded-md bg-violet-700 px-2.5 py-1 text-[11px] font-bold text-white sm:text-xs">
                  {referredAs}
                </span>
              </div>
            )}

            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2">
              <RoleStatus role="lender" item={node.oxyloans?.lender} />
              <RoleStatus role="borrower" item={node.oxyloans?.borrower} />
              <RoleStatus role="partner" item={node.oxyloans?.partner} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const ReferralBranch = ({ node }: { node: ReferralNode }) => {
  const children = getChildNodes(node);
  const [showReferrals, setShowReferrals] = useState(true);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[420px]">
        <RootCard node={node} />
      </div>

      {children.length > 0 && (
        <div className="mt-3.5 sm:mt-4">
          <div className="mb-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <TeamOutlined />
              </div>

              <div className="min-w-0">
                <div className="text-[13px] font-bold text-slate-800 sm:text-sm">
                  Direct Referrals
                </div>
                <div className="text-[10px] text-slate-400 sm:text-[11px]">
                  {children.length} referral{children.length === 1 ? "" : "s"} in your network
                </div>
              </div>
            </div>

            <Button
              type="text"
              size="small"
              icon={showReferrals ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setShowReferrals((value) => !value)}
              className="!flex !h-9 !w-full !items-center !justify-center !rounded-xl !border !border-slate-200 !bg-white !px-3 !text-[11px] !font-semibold !text-slate-600 hover:!border-violet-200 hover:!bg-violet-50 hover:!text-violet-700 sm:!w-auto"
            >
              {showReferrals ? "Hide Referrals" : `Show Referrals (${children.length})`}
            </Button>
          </div>

          {showReferrals && (
            <div
              className={`grid gap-2.5 sm:gap-3 ${
                children.length === 1
                  ? "grid-cols-1"
                  : children.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {children.map((child, index) => (
                <ReferralCard
                  key={
                    child.userId ||
                    child.askoxyUserId ||
                    child.mobileNumber ||
                    index
                  }
                  node={child}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      )}
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
      title={
        <div>
          <div className="text-[17px] font-bold text-slate-900">
            Add Referral
          </div>
          <div className="mt-0.5 text-xs font-normal text-slate-400">
            Add a person to your OxyLoans referral network.
          </div>
        </div>
      }
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
        header: { paddingBottom: 10 },
        body: { paddingTop: 4 },
        footer: { paddingTop: 10 },
      }}
      maskClosable={!submitting}
      closable={!submitting}
      okText="Add Referral"
      cancelText="Cancel"
      confirmLoading={submitting}
      onOk={() => form.submit()}
      okButtonProps={{
        icon: <UserAddOutlined />,
        className: "!h-10 !rounded-xl !font-semibold",
      }}
      cancelButtonProps={{
        disabled: submitting,
        className: "!h-10 !rounded-xl",
      }}
    >
      <style>{`
        .referral-toast-only-form .ant-form-item-explain {
          display: none !important;
        }

        @media (max-width: 575px) {
          .ant-modal {
            max-width: calc(100vw - 20px) !important;
            margin: 10px auto !important;
          }

          .ant-modal-content {
            border-radius: 18px !important;
            padding: 16px !important;
          }

          .ant-modal-footer {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .ant-modal-footer .ant-btn {
            margin-inline-start: 0 !important;
            width: 100%;
          }
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
        requiredMark={false}
      >
        <Form.Item
          label="Referral Name"
          name="referralName"
          validateTrigger="onSubmit"
          rules={[
            { required: true, message: "Please enter the referral name." },
            { whitespace: true, message: "Please enter the referral name." },
            { min: 2, message: "Name must be at least 2 characters." },
            {
              max: 50,
              message: "Name cannot be longer than 50 characters.",
            },
            {
              pattern: NAME_PATTERN,
              message:
                "Use letters only. Spaces, dots, apostrophes, and hyphens are allowed.",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter full name"
            maxLength={50}
            className="!rounded-xl"
          />
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
            String(event?.target?.value || "")
              .replace(/\D/g, "")
              .slice(0, 10)
          }
        >
          <Input
            size="large"
            placeholder="9876543210"
            addonBefore="+91"
            maxLength={10}
            inputMode="numeric"
            autoComplete="tel"
            className="!rounded-xl"
          />
        </Form.Item>

        <Form.Item
          label="Referral Role"
          name="role"
          validateTrigger="onSubmit"
          rules={[
            {
              required: true,
              message: "Please select a referral role.",
            },
          ]}
        >
          <Select
            size="large"
            placeholder="Select role"
            className="w-full"
            options={[
              { value: "LENDER", label: "Lender" },
              { value: "BORROWER", label: "Borrower" },
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
      } catch (error) {
        const message = getApiMessage(error);
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
  const totalReferrals = useMemo(() => countDirectReferrals(roots), [roots]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6D28D9",
          borderRadius: 12,
          borderRadiusLG: 18,
          colorBgLayout: "#F8FAFC",
        },
        components: {
          Button: {
            primaryShadow: "none",
          },
        },
      }}
    >
      <div className="min-h-full bg-[#F8FAFC]">
        <main className="mx-auto w-full max-w-[1480px] px-3 py-4 sm:px-4 sm:py-5 lg:px-5 xl:px-6">
          <header className="mb-3 sm:mb-4">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <Title
                    level={2}
                    className="!m-0 !text-[21px] !font-bold !leading-tight !text-slate-900 sm:!text-[27px]"
                  >
                    Referral Network
                  </Title>

                  {!loading && roots.length > 0 && (
                    <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 sm:text-[11px]">
                      {totalReferrals} Direct Referral
                      {totalReferrals === 1 ? "" : "s"}
                    </span>
                  )}
                </div>

                <Text className="mt-1 block max-w-2xl !text-[11px] !leading-5 !text-slate-500 sm:!text-[13px]">
                  View your referrals and their Lender, Borrower and Partner
                  journey progress.
                </Text>
              </div>

              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setOpenModal(true)}
                className="!h-10 w-full !rounded-xl !px-4 !font-semibold shadow-none sm:w-auto"
              >
                Add Referral
              </Button>
            </div>
          </header>

          <section className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_4px_18px_rgba(15,23,42,0.04)] sm:p-3.5 lg:p-4">
            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="text-center">
                  <Spin />
                  <div className="mt-3 text-xs text-slate-400 sm:text-sm">
                    Loading your referral network...
                  </div>
                </div>
              </div>
            ) : !roots.length ? (
              <div className="flex min-h-[250px] items-center justify-center px-4 text-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <div className="font-semibold text-slate-700">
                        No referrals yet
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Add your first referral to start building your network.
                      </div>
                    </div>
                  }
                >
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => setOpenModal(true)}
                    className="!rounded-xl"
                  >
                    Add Referral
                  </Button>
                </Empty>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
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
          </section>

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
