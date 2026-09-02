import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../utils/axiosInstances";
import {
  Button,
  Card,
  Col,
  Empty,
  Image,
  Input,
  Row,
  Select,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
  Alert,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  ToolOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
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

const fmt = (n: number | null) =>
  n != null ? `₹${n.toLocaleString("en-IN")}` : "—";

/* ── Placeholder image when no imageUrl ── */
const Placeholder: React.FC<{ isProduct: boolean }> = ({ isProduct }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f3f0ff 0%, #e9e4f8 100%)",
      gap: 4,
    }}
  >
    {isProduct ? (
      <ShoppingOutlined style={{ fontSize: 28, color: "#7c3aed" }} />
    ) : (
      <ToolOutlined style={{ fontSize: 28, color: "#4f46e5" }} />
    )}
    <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>
      {isProduct ? "PRODUCT" : "SERVICE"}
    </span>
  </div>
);

/* ── Entry Card ── */
const EntryCard: React.FC<{
  entry: Entry;
  onEdit: (id: string) => void;
  openId: string | null;
  onToggle: (id: string) => void;
}> = ({ entry, onEdit, openId, onToggle }) => {
  const isProduct = entry.membersType === "PRODUCT";
  const isOpen = openId === entry.id;

  const detailItems = isProduct
    ? [
      { label: "Brand", value: entry.brand },
      { label: "Selling Price", value: fmt(entry.price) },
      { label: "MRP", value: fmt(entry.mrp) },
      { label: "Price Type", value: PRICE_TYPE_LABEL[entry.priceType] },
      {
        label: "Quantity",
        value:
          entry.quantity != null
            ? `${entry.quantity} ${entry.quantityUnit ?? ""}`.trim()
            : null,
      },
      {
        label: "Stock",
        value:
          entry.stockQuantity != null
            ? `${entry.stockQuantity} units`
            : null,
      },
      { label: "Variant", value: entry.variant },
      { label: "Color", value: entry.color },
      { label: "Availability", value: entry.availability },
      { label: "Delivery Time", value: entry.deliveryTime },
      {
        label: "Return Policy",
        value:
          entry.returnAvailable === true
            ? `Yes — ${entry.returnDays ?? "?"} days`
            : entry.returnAvailable === false
              ? "No returns"
              : null,
      },
      {
        label: "Warranty",
        value:
          entry.warrantyAvailable === true
            ? `Yes — ${entry.warrantyPeriod ?? ""}`
            : entry.warrantyAvailable === false
              ? "No warranty"
              : null,
      },
    ]
    : [
      { label: "Provider", value: entry.providerName },
      { label: "Business", value: entry.businessName },
      { label: "Price", value: fmt(entry.price) },
      { label: "Price Type", value: PRICE_TYPE_LABEL[entry.priceType] },
      { label: "Service Mode", value: entry.serviceMode },
      { label: "Location", value: entry.serviceLocation },
      { label: "Duration", value: entry.serviceDuration },
      { label: "Availability", value: entry.availability },
      {
        label: "Booking",
        value:
          entry.bookingRequired === true
            ? "Required"
            : entry.bookingRequired === false
              ? "Walk-in"
              : null,
      },
      { label: "Target Customers", value: entry.targetCustomers },
      { label: "Cancellation", value: entry.cancellationPolicy },
      { label: "Refund Policy", value: entry.refundPolicy },
    ];

  const filledItems = detailItems.filter((i) => i.value);

  return (
    <Card
      style={{
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        boxShadow: isOpen
          ? "0 4px 20px rgba(124,58,237,0.12)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s",
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* ── Fixed-height summary row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 110,
          padding: "0 24px 0 0",
        }}
      >
        {/* Image */}
        <div
          style={{
            width: 110,
            minWidth: 110,
            height: 110,
            flexShrink: 0,
            padding: 8,
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {entry.imageUrl ? (
            <Image
              src={entry.imageUrl}
              alt={entry.name}
              width={94}
              height={94}
              style={{ objectFit: "cover", display: "block", borderRadius: 8 }}
              preview={{ mask: <span style={{ fontSize: 11 }}>View</span> }}
              fallback=""
              placeholder={
                <div style={{ width: 94, height: 94, borderRadius: 8, overflow: "hidden" }}>
                  <Placeholder isProduct={isProduct} />
                </div>
              }
            />
          ) : (
            <div style={{ width: 94, height: 94, borderRadius: 8, overflow: "hidden" }}>
              <Placeholder isProduct={isProduct} />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              right: 8,
              background: isProduct ? "rgba(109,40,217,0.82)" : "rgba(67,56,202,0.82)",
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              textAlign: "center",
              padding: "2px 0",
              letterSpacing: 0.5,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            {isProduct ? "PRODUCT" : "SERVICE"}
          </div>
        </div>

        {/* Info — px-6 = 24px left padding */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            paddingLeft: 24,
            paddingRight: 8,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 4,
            overflow: "hidden",
          }}
        >
          {/* Name + badge */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            <Text
              strong
              style={{
                fontSize: 14,
                lineHeight: 1.3,
                color: "#111827",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {entry.name}
            </Text>
            {isProduct && entry.productCondition && (
              <Tag color={CONDITION_COLOR[entry.productCondition]} style={{ margin: 0, fontSize: 10, flexShrink: 0 }}>
                {entry.productCondition}
              </Tag>
            )}
            {!isProduct && entry.serviceMode && (
              <Tag color={MODE_COLOR[entry.serviceMode]} style={{ margin: 0, fontSize: 10, flexShrink: 0 }}>
                {entry.serviceMode}
              </Tag>
            )}
          </div>

          {/* Category */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
            <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>
              {entry.category}
            </Tag>
            {entry.subCategory && (
              <Text type="secondary" style={{ fontSize: 11 }}>{entry.subCategory}</Text>
            )}
          </div>

          {/* Price */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {entry.price != null && (
              <Text strong style={{ fontSize: 14, color: "#7c3aed" }}>
                {fmt(entry.price)}
              </Text>
            )}
            {isProduct && entry.mrp != null && entry.mrp !== entry.price && (
              <Text delete type="secondary" style={{ fontSize: 12 }}>
                {fmt(entry.mrp)}
              </Text>
            )}
            <Tag style={{ margin: 0, fontSize: 10, background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#6b7280" }}>
              {PRICE_TYPE_LABEL[entry.priceType]}
            </Tag>
            {entry.availability && (
              <Tag color="green" style={{ margin: 0, fontSize: 10 }}>
                {entry.availability}
              </Tag>
            )}
          </div>
        </div>

        {/* Actions — right side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(entry.id)}
            style={{
              background: "linear-gradient(135deg, #4C1D95, #7C3AED)",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => onToggle(entry.id)}
            style={{
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              color: isOpen ? "#7c3aed" : "#6b7280",
              borderColor: isOpen ? "#c4b5fd" : "#e5e7eb",
              background: isOpen ? "#f5f3ff" : "#fff",
            }}
          >
            {isOpen ? "Hide Details ▲" : "View Details ▼"}
          </Button>
        </div>
      </div>

      {/* ── Collapsible details panel ── */}
      {isOpen && (
        <div
          style={{
            borderTop: "1px solid #ede9fe",
            background: "linear-gradient(to bottom, #faf5ff, #fff)",
            padding: "16px 24px 20px",
          }}
        >
          <Table
            dataSource={filledItems.map((item, i) => ({
              key: i,
              field: item.label,
              value: item.value,
            }))}
            columns={[
              {
                title: "Field",
                dataIndex: "field",
                key: "field",
                width: "38%",
                render: (text: string) => (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                    }}
                  >
                    {text}
                  </Text>
                ),
              },
              {
                title: "Value",
                dataIndex: "value",
                key: "value",
                render: (text: string) => (
                  <Text style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>
                    {text}
                  </Text>
                ),
              },
            ]}
            pagination={false}
            size="small"
            showHeader={false}
            style={{ marginBottom: 12, borderRadius: 4 }}
          />

          {entry.keyFeatures && (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 4,
                padding: "10px 14px",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#d97706",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Key Features
              </Text>
              <Text style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                {entry.keyFeatures}
              </Text>
            </div>
          )}

          {entry.description && (
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 4,
                padding: "10px 14px",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Description
              </Text>
              <Text style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>
                {entry.description}
              </Text>
            </div>
          )}

          {entry.brochureUrl && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              href={entry.brochureUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                borderColor: "#c4b5fd",
                color: "#7c3aed",
              }}
            >
              View Brochure / Portfolio
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

/* ── Stats Bar ── */
const StatBar: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  const products = entries.filter((e) => e.membersType === "PRODUCT").length;
  const services = entries.filter((e) => e.membersType === "SERVICE").length;
  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
      {[
        { title: "Total Listings", value: entries.length, color: "#7c3aed", bg: "#f5f3ff", icon: <AppstoreOutlined /> },
        { title: "Products", value: products, color: "#4f46e5", bg: "#eef2ff", icon: <ShoppingOutlined /> },
        { title: "Services", value: services, color: "#6d28d9", bg: "#faf5ff", icon: <ToolOutlined /> },
      ].map((s) => (
        <Col xs={8} key={s.title}>
          <Card
            style={{ borderRadius: 14, border: "1px solid #e5e7eb", background: s.bg }}
            bodyStyle={{ padding: "12px 14px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <Statistic
                title={<span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>{s.title}</span>}
                value={s.value}
                valueStyle={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1 }}
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

/* ── Main Page ── */
const MyProductsServices: React.FC = () => {
  const navigate = useNavigate();
  const memberId = localStorage.getItem(USER_ID_KEY) || "";

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "PRODUCT" | "SERVICE">("ALL");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

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
        setEntries(Array.isArray(res.data) ? res.data.reverse() : []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Something went wrong.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEntries();
  }, [memberId]); // eslint-disable-line

  const handleEdit = (id: string) => {
    navigate("/main/dashboard/addproduct-service", { state: { editId: id } });
  };

  const categories = Array.from(
    new Set(entries.map((e) => e.category).filter(Boolean)),
  );

  const filtered = entries.filter((e) => {
    const matchTab = activeTab === "ALL" || e.membersType === activeTab;
    const matchCat = !categoryFilter || e.category === categoryFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.description ?? "").toLowerCase().includes(q) ||
      (e.brand ?? "").toLowerCase().includes(q) ||
      (e.providerName ?? "").toLowerCase().includes(q);
    return matchTab && matchCat && matchSearch;
  });

  const products = filtered.filter((e) => e.membersType === "PRODUCT");
  const services = filtered.filter((e) => e.membersType === "SERVICE");

  const tabItems = [
    { key: "ALL", label: `All (${entries.length})` },
    { key: "PRODUCT", label: `Products (${entries.filter((e) => e.membersType === "PRODUCT").length})` },
    { key: "SERVICE", label: `Services (${entries.filter((e) => e.membersType === "SERVICE").length})` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: "20px 12px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <div>
            <Title level={3} style={{ margin: 0, color: "#111827", fontWeight: 800 }}>
              My Products &amp; Services
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {loading
                ? "Fetching your listings…"
                : entries.length === 0
                  ? "No listings yet — add your first one!"
                  : `Showing ${filtered.length} of ${entries.length} listing${entries.length !== 1 ? "s" : ""}`}
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            onClick={() => navigate("/main/dashboard/addproduct-service")}
            style={{
              background: "linear-gradient(135deg, #4C1D95, #7C3AED)",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              height: 40,
              paddingInline: 20,
              boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
            }}
          >
            Add Product / Service
          </Button>
        </div>

        {/* ── Stats ── */}
        {!loading && !error && entries.length > 0 && <StatBar entries={entries} />}

        {/* ── Filters ── */}
        <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {/* Search */}
          <Input
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder="Search by name, brand, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ flex: 1, minWidth: 200, borderRadius: 10, height: 38 }}
          />

          {/* Type tabs as segmented buttons */}
          <div style={{ display: "flex", height: 38, borderRadius: 10, padding: 4, gap: 2, border: "1px solid #e5e7eb" }}>
            {tabItems.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key as "ALL" | "PRODUCT" | "SERVICE")}
                style={{
                  padding: "5px 14px",
                  height: 30,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  transition: "all 0.2s",
                  background:
                    activeTab === t.key
                      ? "linear-gradient(135deg, #4C1D95, #7C3AED)"
                      : "transparent",
                  color: activeTab === t.key ? "#fff" : "#6b7280",
                  boxShadow: activeTab === t.key ? "0 2px 8px rgba(124,58,237,0.25)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

        
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 16 }}>
            <Spin size="large" />
            <Text type="secondary">Loading your listings…</Text>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <Alert
            type="error"
            message="Failed to load listings"
            description={error}
            showIcon
            style={{ borderRadius: 12, marginBottom: 16 }}
          />
        )}

        {/* ── Empty ── */}
        {!loading && !error && filtered.length === 0 && (
          <Empty
            description={
              <span style={{ color: "#6b7280", fontSize: 14 }}>
                {entries.length === 0
                  ? "No products or services yet"
                  : "No results match your filters"}
              </span>
            }
            style={{ padding: "60px 0" }}
          >
            {entries.length === 0 ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/main/dashboard/addproduct-service")}
                style={{
                  background: "linear-gradient(135deg, #4C1D95, #7C3AED)",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                Add Now
              </Button>
            ) : (
              <Button
                onClick={() => { setSearch(""); setCategoryFilter(""); setActiveTab("ALL"); }}
                style={{ borderRadius: 10 }}
              >
                Clear Filters
              </Button>
            )}
          </Empty>
        )}

        {/* ── Products ── */}
        {!loading && !error && products.length > 0 && (activeTab === "ALL" || activeTab === "PRODUCT") && (
          <div style={{ marginBottom: 24 }}>
            {activeTab === "ALL" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
                <Text strong style={{ color: "#7c3aed", fontSize: 13, letterSpacing: 0.3 }}>
                  Products{" "}
                  <Text type="secondary" style={{ fontWeight: 400 }}>
                    ({products.length})
                  </Text>
                </Text>
              </div>
            )}
            <Row gutter={[12, 12]}>
              {products.map((e) => (
                <Col key={e.id} xs={24} sm={24} md={12} lg={12} xl={12}>
                  <EntryCard entry={e} onEdit={handleEdit} openId={openId} onToggle={handleToggle} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* ── Services ── */}
        {!loading && !error && services.length > 0 && (activeTab === "ALL" || activeTab === "SERVICE") && (
          <div>
            {activeTab === "ALL" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f46e5" }} />
                <Text strong style={{ color: "#4f46e5", fontSize: 13, letterSpacing: 0.3 }}>
                  Services{" "}
                  <Text type="secondary" style={{ fontWeight: 400 }}>
                    ({services.length})
                  </Text>
                </Text>
              </div>
            )}
            <Row gutter={[12, 12]}>
              {services.map((e) => (
                <Col key={e.id} xs={24} sm={24} md={12} lg={12} xl={12}>
                  <EntryCard entry={e} onEdit={handleEdit} openId={openId} onToggle={handleToggle} />
                </Col>
              ))}
            </Row>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyProductsServices;
