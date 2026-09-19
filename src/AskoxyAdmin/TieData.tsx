import React, { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import {
  Table,
  Button,
  Spin,
  Pagination,
  Typography,
  Input,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";

const { Text, Title } = Typography;
const { Search } = Input;

interface TieDataItem {
  id: string;
  firstName: string;
  lastName: string;
  email1: string | null;
  email2: string | null;
}

const DEFAULT_PAGE_SIZE = 100;
const PRIMARY_COLOR = "#008cba";

const TieData: React.FC = () => {
  const [records, setRecords] = useState<TieDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);

  const [searchText, setSearchText] = useState("");

  const hasValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return false;
    const text = String(value).trim();
    return text !== "" && text !== "-" && text.toLowerCase() !== "null";
  };

  const fetchRecords = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/ai-service/entity-records/tie-data`,
        {
          params: { page, size },
        }
      );

      const content = response.data?.content || [];
      setRecords(content);
      setTotal(response.data?.totalElements ?? content.length);
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Unable to load records. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = useMemo(() => {
    let data = [...records];

    if (searchText.trim()) {
      const search = searchText.toLowerCase().trim();

      data = data.filter(
        (item) =>
          item.firstName?.toLowerCase().includes(search) ||
          item.lastName?.toLowerCase().includes(search) ||
          item.email1?.toLowerCase().includes(search) ||
          item.email2?.toLowerCase().includes(search)
      );
    }

    return data;
  }, [records, searchText]);

  const columns: ColumnsType<TieDataItem> = [
    {
      title: <div style={{ textAlign: "center" }}>S.No</div>,
      key: "serialNumber",
      align: "center",
      width: 80,
      render: (_value, _record, index) => (
        <Text strong style={{ color: "#6b7280" }}>
          {page * size + index + 1}
        </Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <UserOutlined style={{ marginRight: 6 }} />
          Name
        </div>
      ),
      key: "name",
      align: "center",
      render: (_value, record: TieDataItem) => {
        const fullName = [record.firstName, record.lastName]
          .filter((part) => hasValue(part))
          .join(" ");

        return (
          <Text strong style={{ color: "#1f2937" }}>
            {fullName || "-"}
          </Text>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <MailOutlined style={{ marginRight: 6 }} />
          Email 1
        </div>
      ),
      dataIndex: "email1",
      key: "email1",
      align: "center",
      render: (value: string | null) =>
        hasValue(value) ? (
          <a
            href={`mailto:${value}`}
            style={{ color: PRIMARY_COLOR, textDecoration: "none" }}
          >
            {value}
          </a>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <MailOutlined style={{ marginRight: 6 }} />
          Email 2
        </div>
      ),
      dataIndex: "email2",
      key: "email2",
      align: "center",
      render: (value: string | null) =>
        hasValue(value) ? (
          <a
            href={`mailto:${value}`}
            style={{ color: PRIMARY_COLOR, textDecoration: "none" }}
          >
            {value}
          </a>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <Title
            level={4}
            style={{ margin: 0, color: "#1f2937", fontWeight: 700 }}
          >
            TiE Data
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            View TiE entity contact records
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchRecords}
          loading={loading}
          style={{
            borderRadius: 8,
            fontWeight: 600,
            borderColor: PRIMARY_COLOR,
            color: PRIMARY_COLOR,
          }}
        >
          Refresh
        </Button>
      </div>

      {/* Stat Card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: 12,
            padding: "16px 20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            borderLeft: `4px solid ${PRIMARY_COLOR}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#e6f7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TeamOutlined style={{ fontSize: 22, color: PRIMARY_COLOR }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: PRIMARY_COLOR,
                lineHeight: 1.2,
              }}
            >
              {total}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
              Total Records
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Search
            allowClear
            placeholder="Search by name, email 1 or email 2"
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              maxWidth: 320,
              width: "100%",
              borderRadius: 8,
            }}
          />
        </div>

        {/* Table or Loading */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 60,
              gap: 12,
            }}
          >
            <Spin size="large" />
            <Text type="secondary">Loading records...</Text>
          </div>
        ) : (
          <>
            <Table
              rowKey="id"
              dataSource={filteredRecords}
              columns={columns}
              pagination={false}
              bordered
              size="middle"
              scroll={{ x: true }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span style={{ color: "#9ca3af" }}>
                        {searchText
                          ? `No results found for "${searchText}"`
                          : "No records found"}
                      </span>
                    }
                  />
                ),
              }}
            />

            {/* Pagination */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Text type="secondary" style={{ fontSize: 13 }}>
                Showing <strong>{filteredRecords.length}</strong> of{" "}
                <strong>{records.length}</strong> records on this page
              </Text>
              <Pagination
                current={page + 1}
                pageSize={size}
                total={total}
                showSizeChanger={false}
                showTotal={(totalRecords) => `Total ${totalRecords} records`}
                onChange={(pageNumber) => setPage(pageNumber - 1)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TieData;
