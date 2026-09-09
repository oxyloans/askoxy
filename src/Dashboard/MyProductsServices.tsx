import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Empty,
  Image,
  Input,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import customerApi from "../utils/axiosInstances";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const USER_ID_KEY = "userId";

type MembersType = "PRODUCT" | "SERVICE";
type PriceType = "FIXED" | "HOURLY" | "NEGOTIABLE" | "PER_SESSION";
type ProductCondition = "NEW" | "USED" | "REFURBISHED";
type ServiceMode = "ONLINE" | "OFFLINE" | "HYBRID";

interface Entry {
  id: string;
  memberId: string;
  membersType: MembersType;
  name: string;
  category: string;
  subCategory: string | null;
  description: string | null;
  keyFeatures: string | null;
  price: number | null;
  mrp: number | null;
  availability: string | null;
  imageUrl: string | null;
  brand: string | null;
  color: string | null;
  quantity: number | null;
  quantityUnit: string | null;
  variant: string | null;
  stockQuantity: number | null;
  productCondition: ProductCondition | null;
  returnAvailable: boolean | null;
  returnDays: number | null;
  warrantyAvailable: boolean | null;
  warrantyPeriod: string | null;
  deliveryTime: string | null;
  priceType: PriceType;
  providerName: string | null;
  businessName: string | null;
  serviceMode: ServiceMode | null;
  serviceLocation: string | null;
  serviceDuration: string | null;
  bookingRequired: boolean | null;
  targetCustomers: string | null;
  cancellationPolicy: string | null;
  refundPolicy: string | null;
  brochureUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

const PRICE_TYPE_LABEL: Record<PriceType, string> = {
  FIXED: "Fixed Price",
  HOURLY: "Hourly Rate",
  NEGOTIABLE: "Negotiable",
  PER_SESSION: "Per Session",
};

const CONDITION_COLOR: Record<ProductCondition, string> = {
  NEW: "green",
  USED: "orange",
  REFURBISHED: "blue",
};

const MODE_COLOR: Record<ServiceMode, string> = {
  ONLINE: "blue",
  OFFLINE: "orange",
  HYBRID: "purple",
};

const fmt = (value: number | null) =>
  value != null ? `₹${value.toLocaleString("en-IN")}` : "—";

const ListingImage: React.FC<{ entry: Entry }> = ({ entry }) => {
  const isProduct = entry.membersType === "PRODUCT";

  if (entry.imageUrl) {
    return (
      <Image
        src={entry.imageUrl}
        alt={entry.name}
        width={46}
        height={46}
        preview={{
          mask: <EyeOutlined style={{ fontSize: 15 }} />,
        }}
        style={{
          objectFit: "cover",
          borderRadius: 9,
          border: "1px solid #f0f0f0",
          background: "#fff",
          cursor: "pointer",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf5ff",
        color: "#7c3aed",
        border: "1px solid #ede9fe",
        fontSize: 19,
      }}
    >
      {isProduct ? <ShoppingOutlined /> : <ToolOutlined />}
    </div>
  );
};

const DetailGrid: React.FC<{ entry: Entry }> = ({ entry }) => {
  const isProduct = entry.membersType === "PRODUCT";

  const details = isProduct
    ? [
      ["Brand", entry.brand],
      ["Sub-category", entry.subCategory],
      ["Selling Price", fmt(entry.price)],
      ["MRP", fmt(entry.mrp)],
      ["Price Type", PRICE_TYPE_LABEL[entry.priceType]],
      [
        "Quantity",
        entry.quantity != null
          ? `${entry.quantity} ${entry.quantityUnit ?? ""}`.trim()
          : null,
      ],
      [
        "Stock",
        entry.stockQuantity != null ? `${entry.stockQuantity} units` : null,
      ],
      ["Variant", entry.variant],
      ["Color", entry.color],
      ["Availability", entry.availability],
      ["Delivery Time", entry.deliveryTime],
      [
        "Returns",
        entry.returnAvailable === true
          ? `Available${entry.returnDays ? ` · ${entry.returnDays} days` : ""}`
          : entry.returnAvailable === false
            ? "Not available"
            : null,
      ],
      [
        "Warranty",
        entry.warrantyAvailable === true
          ? entry.warrantyPeriod || "Available"
          : entry.warrantyAvailable === false
            ? "Not available"
            : null,
      ],
    ]
    : [
      ["Provider", entry.providerName],
      ["Business", entry.businessName],
      ["Sub-category", entry.subCategory],
      ["Service Fee", fmt(entry.price)],
      ["Price Type", PRICE_TYPE_LABEL[entry.priceType]],
      ["Service Mode", entry.serviceMode],
      ["Location", entry.serviceLocation],
      ["Duration", entry.serviceDuration],
      ["Availability", entry.availability],
      [
        "Booking",
        entry.bookingRequired === true
          ? "Required"
          : entry.bookingRequired === false
            ? "Not required"
            : null,
      ],
      ["Target Customers", entry.targetCustomers],
      ["Cancellation Policy", entry.cancellationPolicy],
      ["Refund Policy", entry.refundPolicy],
    ];

  const filled = details.filter(([, value]) => value != null && value !== "" && value !== "—");

  return (
    <div style={{ padding: "6px 8px 10px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          border: "1px solid #f0f0f0",
          borderRadius: 10,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {filled.map(([label, value]) => (
          <div
            key={String(label)}
            style={{
              minHeight: 62,
              padding: "10px 14px",
              borderRight: "1px solid #f5f5f5",
              borderBottom: "1px solid #f5f5f5",
            }}
          >
            <Text
              type="secondary"
              style={{ display: "block", fontSize: 11, marginBottom: 3 }}
            >
              {label}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: 600, color: "#262626" }}>
              {String(value)}
            </Text>
          </div>
        ))}
      </div>

      {(entry.description || entry.keyFeatures) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 10,
            marginTop: 10,
          }}
        >
          {entry.description && (
            <div style={{ border: "1px solid #f0f0f0", borderRadius: 10, padding: 12 }}>
              <Text type="secondary" style={{ display: "block", fontSize: 11, marginBottom: 4 }}>
                Description
              </Text>
              <Text style={{ fontSize: 13, lineHeight: 1.6 }}>{entry.description}</Text>
            </div>
          )}
          {entry.keyFeatures && (
            <div style={{ border: "1px solid #f0f0f0", borderRadius: 10, padding: 12 }}>
              <Text type="secondary" style={{ display: "block", fontSize: 11, marginBottom: 4 }}>
                Key Features
              </Text>
              <Text style={{ fontSize: 13, lineHeight: 1.6 }}>{entry.keyFeatures}</Text>
            </div>
          )}
        </div>
      )}

      {entry.membersType === "SERVICE" && entry.brochureUrl && (
        <Button
          href={entry.brochureUrl}
          target="_blank"
          rel="noreferrer"
          size="small"
          style={{ marginTop: 10, borderRadius: 8, color: "#7c3aed", borderColor: "#c4b5fd" }}
        >
          View Brochure / Portfolio
        </Button>
      )}
    </div>
  );
};

const MyProductsServices: React.FC = () => {
  const navigate = useNavigate();
  const memberId = localStorage.getItem(USER_ID_KEY) || "";

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MembersType>("PRODUCT");
  const [search, setSearch] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const loadEntries = () => {
    if (!memberId) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    customerApi
      .get(`${BASE_URL}/marketing-service/campgin/products-services/${memberId}`)
      .then((res) => {
        setEntries(Array.isArray(res.data) ? [...res.data] : []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEntries();
  }, [memberId]); // eslint-disable-line react-hooks/exhaustive-deps

  const products = useMemo(
    () => entries.filter((entry) => entry.membersType === "PRODUCT"),
    [entries],
  );

  const services = useMemo(
    () => entries.filter((entry) => entry.membersType === "SERVICE"),
    [entries],
  );

  const visibleRows = useMemo(() => {
    const source = activeTab === "PRODUCT" ? products : services;
    const query = search.trim().toLowerCase();
    if (!query) return source;

    return source.filter((entry) =>
      [
        entry.name,
        entry.category,
        entry.subCategory,
        entry.brand,
        entry.providerName,
        entry.businessName,
        entry.serviceLocation,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [activeTab, products, services, search]);

  const handleEdit = (id: string) => {
    navigate(`/main/dashboard/addproduct-service?editId=${encodeURIComponent(id)}`);
  };

  const handleAddListing = () => {
    navigate(`/main/dashboard/addproduct-service?tab=${activeTab}`);
  };

  const commonNameColumn = (kind: MembersType) => ({
    title: kind === "PRODUCT" ? "Product" : "Service",
    key: "listing",
    width: 290,

    render: (_: unknown, entry: Entry) => (
      <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
        <ListingImage entry={entry} />
        <div style={{ minWidth: 0 }}>
          <Tooltip title={entry.name}>
            <Text
              strong
              style={{
                display: "block",
                maxWidth: 205,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 13,
                color: "#111827",
              }}
            >
              {entry.name}
            </Text>
          </Tooltip>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {entry.category || "Uncategorized"}
          </Text>
        </div>
      </div>
    ),
  });

  const serialColumn = {
    title: "S.No",
    key: "serial",
    width: 72,
    align: "center" as const,
    render: (_: unknown, __: Entry, index: number) => (
      <Text style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>
        {index + 1}
      </Text>
    ),
  };

  const actionColumn = {
    title: "Actions",
    key: "action",
    width: 190,

    align: "center" as const,
    render: (_: unknown, entry: Entry) => {
      const isExpanded = expandedRowKeys.includes(entry.id);
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Button
            size="middle"
            icon={<EyeOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              setExpandedRowKeys((prev) =>
                prev.includes(entry.id)
                  ? prev.filter((key) => key !== entry.id)
                  : [...prev, entry.id],
              );
            }}
            style={{
              borderRadius: 7,
              fontWeight: 600,
              color: "#6d28d9",
              borderColor: "#c4b5fd",
              background: "#fff",
            }}
          >
            {isExpanded ? "Hide" : "View Details"}
          </Button>
          <Button
            type="primary"
            size="middle"
            icon={<EditOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(entry.id);
            }}
            style={{
              borderRadius: 7,
              background: "#7c3aed",
              borderColor: "#7c3aed",
              fontWeight: 600,
            }}
          >
            Edit
          </Button>
        </div>
      );
    },
  };

  const productColumns: ColumnsType<Entry> = [
    serialColumn,
    commonNameColumn("PRODUCT"),
    {
      title: "Price",
      dataIndex: "price",
      align: "center",
      key: "price",
      width: 120,
      render: (value: number | null, entry) => (
        <div>
          <Text strong style={{ color: "#7c3aed", fontSize: 13 }}>{fmt(value)}</Text>
          {entry.mrp != null && entry.mrp !== entry.price && (
            <Text delete type="secondary" style={{ display: "block", fontSize: 11 }}>
              {fmt(entry.mrp)}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      align: "center",
      width: 95,
      render: (value: number | null) => (
        <Text style={{ fontSize: 12 }}>{value != null ? value : "—"}</Text>
      ),
    },
    {
      title: "Quantity",
      key: "quantity",
      align: "center",
      width: 125,
      render: (_: unknown, entry: Entry) => (
        <Text style={{ fontSize: 12 }}>
          {entry.quantity != null
            ? `${entry.quantity}${entry.quantityUnit ? ` ${entry.quantityUnit}` : ""}`
            : "—"}
        </Text>
      ),
    },
    {
      title: "Delivery Time",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
      width: 140,

      align: "center",
      render: (value: string | null) => (
        <Text style={{ fontSize: 12 }}>{value || "—"}</Text>
      ),
    },
    {
      title: "Condition",
      dataIndex: "productCondition",
      key: "productCondition",
      align: "center",
      width: 120,
      render: (value: ProductCondition | null) =>
        value ? <Tag color={CONDITION_COLOR[value]} style={{ margin: 0 }}>{value}</Tag> : "—",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      align: "center",
      key: "availability",
      width: 150,
      render: (value: string | null) =>
        value ? <Tag color="green" style={{ margin: 0 }}>{value}</Tag> : "—",
    },
    actionColumn,
  ];

  const serviceColumns: ColumnsType<Entry> = [
    serialColumn,
    commonNameColumn("SERVICE"),
    {
      title: "Service Fee",
      dataIndex: "price",
      key: "price",
      align: "center",
      width: 130,
      render: (value: number | null, entry) => (
        <div>
          <Text strong style={{ color: "#7c3aed", fontSize: 13 }}>{fmt(value)}</Text>
          <Text type="secondary" style={{ display: "block", fontSize: 10 }}>
            {PRICE_TYPE_LABEL[entry.priceType]}
          </Text>
        </div>
      ),
    },
    {
      title: "Mode",
      dataIndex: "serviceMode",
      key: "serviceMode",
      align: "center",
      width: 105,
      render: (value: ServiceMode | null) =>
        value ? <Tag color={MODE_COLOR[value]} style={{ margin: 0 }}>{value}</Tag> : "—",
    },
    {
      title: "Location",
      dataIndex: "serviceLocation",
      key: "serviceLocation",
      width: 180,
      align: "center",
      ellipsis: true,
      render: (value: string | null) => <Text style={{ fontSize: 12 }}>{value || "—"}</Text>,
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      align: "center",
      width: 150,
      render: (value: string | null) =>
        value ? <Tag color="green" style={{ margin: 0 }}>{value}</Tag> : "—",
    },
    actionColumn,
  ];

  const currentCount = activeTab === "PRODUCT" ? products.length : services.length;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: "22px 12px 40px" }}>
      <div className="mx-auto w-full max-w-7xl">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0, color: "#111827", fontWeight: 800 }}>
              My Products &amp; Services
            </Title>

          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddListing}
            style={{
              height: 40,
              borderRadius: 9,
              paddingInline: 17,
              fontWeight: 700,
              background: "#7c3aed",
              borderColor: "#7c3aed",
            }}
          >
            Add {activeTab === "PRODUCT" ? "Product" : "Service"}
          </Button>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0 16px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key as MembersType);
                setSearch("");
                setExpandedRowKeys([]);
              }}
              items={[
                {
                  key: "PRODUCT",
                  label: (
                    <span>
                      <ShoppingOutlined /> Products ({products.length})
                    </span>
                  ),
                },
                {
                  key: "SERVICE",
                  label: (
                    <span>
                      <ToolOutlined /> Services ({services.length})
                    </span>
                  ),
                },
              ]}
              style={{ marginBottom: -1, minWidth: 260 }}
            />

            <Input
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              placeholder={`Search ${activeTab === "PRODUCT" ? "products" : "services"}...`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              allowClear
              style={{ width: 260, maxWidth: "100%", borderRadius: 8 }}
            />
          </div>

          {loading ? (
            <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
                <div style={{ marginTop: 12 }}>
                  <Text type="secondary">Loading your listings…</Text>
                </div>
              </div>
            </div>
          ) : error ? (
            <div style={{ padding: 16 }}>
              <Alert
                type="error"
                showIcon
                message="Failed to load listings"
                description={error}
                action={<Button size="small" onClick={loadEntries}>Retry</Button>}
              />
            </div>
          ) : currentCount === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`No ${activeTab === "PRODUCT" ? "products" : "services"} added yet`}
              style={{ padding: "70px 16px" }}
            >
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddListing}>
                Add {activeTab === "PRODUCT" ? "Product" : "Service"}
              </Button>
            </Empty>
          ) : visibleRows.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No matching results"
              style={{ padding: "60px 16px" }}
            >
              <Button onClick={() => setSearch("")}>Clear Search</Button>
            </Empty>
          ) : (
            <Table<Entry>
              rowKey="id"
              dataSource={visibleRows}
              bordered
              columns={activeTab === "PRODUCT" ? productColumns : serviceColumns}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showTotal: (total) => `${total} ${activeTab === "PRODUCT" ? "products" : "services"}`,
                position: ["bottomRight"],
              }}
              size="middle"

              scroll={{ x: true }}
              expandable={{
                expandedRowKeys,
                onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
                expandedRowRender: (record) => <DetailGrid entry={record} />,
                expandRowByClick: false,
                rowExpandable: () => true,
                showExpandColumn: false,
              }}
              onRow={() => ({
                style: { cursor: "default" },
              })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProductsServices;
