import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Pagination,
  message,
  Row,
  Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { adminApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import { FaEdit } from "react-icons/fa";

const CBS_BASE = `${BASE_URL}/ai-service/agent`;
const CBS_SEARCH_URL = `${BASE_URL}/ai-service/agent/serachForCbs`;

interface CbsRecord {
  id: string;
  studentId: number | null;
  name: string;
  email: string;
  city: string | null;
  country: string | null;
  phoneNumber: string | null;
  linkedinUrl: string | null;
}

interface PageResponse {
  content: CbsRecord[];
  totalElements: number;
  totalPages: number;
}

type CbsFormValues = {
  studentId?: string | number;
  name: string;
  email: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  linkedinUrl?: string;
};

const PRIMARY = "#008cba";

const getApiErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const trimValue = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed || null;
};

const CbsDataPage: React.FC = () => {
  const [data, setData] = useState<CbsRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<CbsRecord[] | null>(null);
  const isSearchingRef = useRef(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<CbsRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<CbsFormValues>();

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res = await adminApi.get<PageResponse>(`${CBS_BASE}/getAllCbsData`, {
        params: { page: p, size: pageSize },
      });
      setData(res.data?.content || []);
      setTotal(res.data?.totalElements || 0);
      setPage(p);
    } catch (error: any) {
      message.error(getApiErrorMessage(error, "Failed to fetch CBS data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // Debounced search via API when searchText changes
  useEffect(() => {
    const value = searchText.trim();
    if (!value) {
      setSearchResults(null);
      isSearchingRef.current = false;
      return;
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(async () => {
      isSearchingRef.current = true;
      setLoading(true);
      try {
        const res = await adminApi.get<CbsRecord[]>(
          `${CBS_SEARCH_URL}?search=${encodeURIComponent(value)}`,
        );
        setSearchResults(res.data || []);
      } catch (error: any) {
        message.error(getApiErrorMessage(error, "Search failed"));
        setSearchResults([]);
      } finally {
        setLoading(false);
        isSearchingRef.current = false;
      }
    }, 400);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchText]);

  // Determine which data to display: search results if available, otherwise paginated data
  const displayData = useMemo(() => {
    if (searchResults !== null) {
      return searchResults;
    }
    return data;
  }, [data, searchResults]);

  const openAdd = () => {
    setEditRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: CbsRecord) => {
    setEditRecord(record);
    form.setFieldsValue({
      ...record,
      studentId: record.studentId ? String(record.studentId) : undefined,
      city: record.city || undefined,
      country: record.country || undefined,
      phoneNumber: record.phoneNumber || undefined,
      linkedinUrl: record.linkedinUrl || undefined,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditRecord(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        studentId: values.studentId ? Number(values.studentId) : null,
        phoneNumber: trimValue(values.phoneNumber),
        city: trimValue(values.city),
        country: trimValue(values.country),
        linkedinUrl: trimValue(values.linkedinUrl),
        ...(editRecord ? { id: editRecord.id } : {}),
      };

      await adminApi.patch(`${CBS_BASE}/mycbsData`, payload);

      message.success(
        editRecord
          ? "Record updated successfully"
          : "Record added successfully",
      );
      closeModal();
      fetchData(page);
    } catch (error: any) {
      if (error?.errorFields) return;
      message.error(getApiErrorMessage(error, "Failed to save record"));
    } finally {
      setSaving(false);
    }
  };

  const commonColumnProps = {
    align: "center" as const,
    onHeaderCell: () => ({
      className: "!text-center !font-bold",
    }),
  };

  const columns: ColumnsType<CbsRecord> = [
    {
      title: "S.No",
      key: "sno",
      width: 80,
      ...commonColumnProps,
      render: (_value, _record, index) =>
        searchResults !== null
          ? index + 1
          : page * pageSize + index + 1,
    },
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      ...commonColumnProps,
      render: (value: number | null) => value || "-",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...commonColumnProps,
      render: (value: string) => value || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 240,
      ...commonColumnProps,
      render: (value: string) => value || "-",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...commonColumnProps,
      render: (value: string | null) => value || "-",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      ...commonColumnProps,
      render: (value: string | null) => value || "-",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      ...commonColumnProps,
      render: (value: string | null) => value || "-",
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedinUrl",
      key: "linkedinUrl",
      ...commonColumnProps,
      render: (value: string | null) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="font-medium"
            style={{ color: PRIMARY }}
          >
            View
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      key: "action",
      ...commonColumnProps,
      render: (_value, record) => (
        <Button
          icon={<FaEdit />}
          type="primary"
          size="middle"
          style={{
            backgroundColor: "#1ab394",
            borderColor: "#1ab394",
          }}
          onClick={() => openEdit(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto bg-white p-4">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="m-0 text-[22px] font-bold text-gray-900">CBS Data</h2>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto md:justify-end">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search name, email, phone..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="w-full sm:!w-[320px]"
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="w-full sm:w-auto"
            style={{ background: PRIMARY, borderColor: PRIMARY }}
            onClick={openAdd}
          >
            Add Record
          </Button>
        </div>
      </div>

      <Table
        bordered
        rowKey={(record) => record.id || String(record.studentId)}
        dataSource={displayData}
        columns={columns}
        loading={loading}
        pagination={false}
        scroll={{ x: true }}
        size="middle"
      />

      <div className="mt-4 flex justify-center md:justify-end">
        <Pagination
          current={page + 1}
          pageSize={pageSize}
          total={searchResults !== null ? displayData.length : total}
          onChange={(currentPage) => setPage(currentPage - 1)}
          showTotal={(count, range) =>
            `${range[0]}-${range[1]} of ${count} records`
          }
          showSizeChanger
          pageSizeOptions={["10", "20", "50", "100"]}
          onShowSizeChange={(_current, size) => {
            setPage(0);
            setPageSize(Number(size));
          }}
          className="w-full md:w-auto"
        />
      </div>

      <Modal
        title={
          <div className="text-left text-lg font-bold text-gray-900">
            {editRecord ? "Edit CBS Record" : "Add CBS Record"}
          </div>
        }
        open={modalOpen}
        onOk={handleSave}
        onCancel={closeModal}
        okText={editRecord ? "Update" : "Save"}
        confirmLoading={saving}
        width={780}
        destroyOnClose
        maskClosable={!saving}
        okButtonProps={{
          size: "large",
          className: "min-w-[110px]",
          style: { background: PRIMARY, borderColor: PRIMARY },
        }}
        cancelButtonProps={{
          size: "large",
          className: "min-w-[110px]",
          disabled: saving,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="pt-3"
          validateMessages={{
            required: "${label} is required",
            types: { email: "Please enter a valid email address" },
          }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Name"
                name="name"
                normalize={(value) => value?.replace(/\s+/g, " ")}
                rules={[
                  { required: true },
                  { min: 2, message: "Name must be at least 2 characters" },
                  {
                    pattern: /^[A-Za-z.\s]+$/,
                    message: "Name can contain only letters, spaces, and dots",
                  },
                ]}
              >
                <Input size="large" variant="filled" placeholder="Enter name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                normalize={(value) => value?.trim()}
                rules={[{ required: true }, { type: "email" }]}
              >
                <Input
                  size="large"
                  variant="filled"
                  placeholder="Enter email"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Student ID"
                name="studentId"
                normalize={(value) => value?.replace(/\D/g, "")}
                rules={[
                  {
                    validator: (_rule, value) => {
                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {
                        return Promise.resolve();
                      }
                      return /^\d+$/.test(String(value))
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Student ID must contain only numbers"),
                          );
                    },
                  },
                ]}
              >
                <Input
                  size="large"
                  variant="filled"
                  placeholder="Enter student ID"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                normalize={(value) => value?.replace(/\D/g, "")}
                rules={[
                  {
                    validator: (_rule, value) => {
                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {
                        return Promise.resolve();
                      }
                      return /^\d{10,15}$/.test(String(value))
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Phone number must be 10 to 15 digits"),
                          );
                    },
                  },
                ]}
              >
                <Input
                  size="large"
                  variant="filled"
                  maxLength={15}
                  placeholder="Enter phone number"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="City"
                name="city"
                normalize={(value) => value?.replace(/\s+/g, " ")}
                rules={[
                  {
                    validator: (_rule, value) => {
                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {
                        return Promise.resolve();
                      }
                      return /^[A-Za-z.\s-]+$/.test(String(value))
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "City can contain only letters, spaces, dots, and hyphens",
                            ),
                          );
                    },
                  },
                ]}
              >
                <Input size="large" variant="filled" placeholder="Enter city" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Country"
                name="country"
                normalize={(value) => value?.replace(/\s+/g, " ")}
                rules={[
                  {
                    validator: (_rule, value) => {
                      if (
                        value === undefined ||
                        value === null ||
                        value === ""
                      ) {
                        return Promise.resolve();
                      }
                      return /^[A-Za-z.\s-]+$/.test(String(value))
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "Country can contain only letters, spaces, dots, and hyphens",
                            ),
                          );
                    },
                  },
                ]}
              >
                <Input
                  size="large"
                  variant="filled"
                  placeholder="Enter country"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="LinkedIn URL"
                name="linkedinUrl"
                normalize={(value) => value?.trim()}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const isValidLinkedIn =
                        /^https?:\/\/(www\.)?linkedin\.com\/.*$/i.test(value);
                      return isValidLinkedIn
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Please enter a valid LinkedIn URL"),
                          );
                    },
                  },
                ]}
              >
                <Input
                  size="large"
                  variant="filled"
                  placeholder="https://www.linkedin.com/in/profile"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CbsDataPage;