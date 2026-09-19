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
  PhoneOutlined,
  UserOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  TagsOutlined,
  BookOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";

const { Text, Title } = Typography;
const { Search } = Input;

interface SaNaukariItem {
  id: string;
  candidateName: string;
  workExperience: string;
  location: string;
  salary: string;
  currentDesignationAndCompany: string;
  contactNo: string;
  emailIds: string;
  keySkills: string;
  keywords: string;
  savedSearchGroup: string;
  education: string;
  resumeHeadline: string;
  previousExperience: string;
  preferredLocation: string;
  recordId: number | string;
}

const DEFAULT_PAGE_SIZE = 100;

const PRIMARY_COLOR = "#008cba";

const SaNaukariRecords: React.FC = () => {
  const [records, setRecords] = useState<SaNaukariItem[]>([]);
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
        `${BASE_URL}/ai-service/entity-records/sa-naukari-records`,
        {
          params: { page, size },
        },
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredRecords = useMemo(() => {
    let data = [...records];

    if (searchText.trim()) {
      const search = searchText.toLowerCase().trim();

      data = data.filter(
        (item) =>
          item.candidateName?.toLowerCase().includes(search) ||
          item.currentDesignationAndCompany?.toLowerCase().includes(search) ||
          item.location?.toLowerCase().includes(search) ||
          item.preferredLocation?.toLowerCase().includes(search) ||
          item.contactNo?.toLowerCase().includes(search) ||
          item.emailIds?.toLowerCase().includes(search) ||
          item.keySkills?.toLowerCase().includes(search) ||
          item.education?.toLowerCase().includes(search) ||
          item.savedSearchGroup?.toLowerCase().includes(search) ||
          item.workExperience?.toLowerCase().includes(search) ||
          item.salary?.toLowerCase().includes(search),
      );
    }

    return data;
  }, [records, searchText]);

  const columns: ColumnsType<SaNaukariItem> = [
    {
      title: <div style={{ textAlign: "center" }}>S.No</div>,
      key: "serialNumber",
      align: "center",
      width: 70,
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
          Candidate Name
        </div>
      ),
      dataIndex: "candidateName",
      key: "candidateName",
      align: "center",
      width: 170,
      render: (value: string) => (
        <Text strong style={{ color: "#1f2937" }}>
          {hasValue(value) ? value : "-"}
        </Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <PhoneOutlined style={{ marginRight: 6 }} />
          Mobile Number
        </div>
      ),
      dataIndex: "contactNo",
      key: "contactNo",
      align: "center",
      width: 140,
      render: (value: string) =>
        hasValue(value) ? (
          <a
            href={`tel:${value}`}
            style={{
              color: PRIMARY_COLOR,
              fontWeight: 500,
              textDecoration: "none",
            }}
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
          Email
        </div>
      ),
      dataIndex: "emailIds",
      key: "emailIds",
      align: "center",
      width: 210,
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
          <EnvironmentOutlined style={{ marginRight: 6 }} />
          Location
        </div>
      ),
      dataIndex: "location",
      key: "location",
      align: "center",
      width: 140,
      render: (value: string) => (
        <Text>{hasValue(value) ? value : "-"}</Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <IdcardOutlined style={{ marginRight: 6 }} />
          Current Designation & Company
        </div>
      ),
      dataIndex: "currentDesignationAndCompany",
      key: "currentDesignationAndCompany",
      align: "center",
      width: 260,
      render: (value: string) => (
        <Text>{hasValue(value) ? value : "-"}</Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <FieldTimeOutlined style={{ marginRight: 6 }} />
          Experience
        </div>
      ),
      dataIndex: "workExperience",
      key: "workExperience",
      align: "center",
      width: 110,
      render: (value: string) => (
        <Text>{hasValue(value) ? value : "-"}</Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <DollarOutlined style={{ marginRight: 6 }} />
          Salary
        </div>
      ),
      dataIndex: "salary",
      key: "salary",
      align: "center",
      width: 110,
      render: (value: string) => (
        <Text>{hasValue(value) ? value : "-"}</Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <TagsOutlined style={{ marginRight: 6 }} />
          Key Skills
        </div>
      ),
      dataIndex: "keySkills",
      key: "keySkills",
      align: "center",
      width: 240,
      render: (value: string) => (
        <Text>{hasValue(value) ? value : "-"}</Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <BookOutlined style={{ marginRight: 6 }} />
          Education
        </div>
      ),
      dataIndex: "education",
      key: "education",
      align: "center",
      width: 200,
      render: (value: string) => (
        <Text>{hasValue(value) ? value : "-"}</Text>
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
            Naukri Records
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            View Naukri candidate records
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
            placeholder="Search by name, designation, company, skills or location"
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              maxWidth: 340,
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
              scroll={{ x: 1650 }}
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

export default SaNaukariRecords;
