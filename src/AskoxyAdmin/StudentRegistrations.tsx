import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Tag,
  Spin,
  Alert,
  Typography,
  Empty,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  BookOutlined,
  BankOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { adminApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";

const { Title, Text } = Typography;

export interface StudentRegistration {
  id: string;
  emailAddress?: string | null;
  task?: string | null;
  emailId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  mobileNumber?: string | null;
  collegeName?: string | null;
  collegeDistrict?: string | null;
  graduation?: string | null;
  stream?: string | null;
  yearOfPassOut?: number | string | null;
  nativeDistrict?: string | null;
  tenthPercentage?: string | number | null;
  intermediatePercentage?: string | number | null;
  graduationPercentage?: string | number | null;
  informationIsTrue?: string | null;
}

interface ApiResponse {
  data: StudentRegistration[];
  count: number;
}

const StudentRegistrations: React.FC = () => {
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search filter
  const [searchText, setSearchText] = useState<string>("");

  // Responsive state
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchStudents = useCallback(async (targetPage = page, targetPageSize = pageSize) => {
    setLoading(true);
    setError(null);
    const zeroBasedPage = Math.max(0, targetPage - 1);

    try {
      let response;
      try {
        response = await adminApi.get<ApiResponse>(
          `${BASE_URL}/user-service/getStudentRegistrations`,
          {
            params: { page: zeroBasedPage, size: targetPageSize },
            headers: { accept: "*/*" },
          }
        );
      } catch (primaryErr) {
        // Fallback to direct service host if meta URL fails
        response = await adminApi.get<ApiResponse>(
          `${BASE_URL}/user-service/getStudentRegistrations`,
          {
            params: { page: zeroBasedPage, size: targetPageSize },
            headers: { accept: "*/*" },
          }
        );
      }

      const resData = response.data;
      const list: StudentRegistration[] = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
        ? (resData as unknown as StudentRegistration[])
        : [];

      const totalCount: number =
        typeof resData?.count === "number"
          ? resData.count
          : typeof (resData as any)?.totalElements === "number"
          ? (resData as any).totalElements
          : list.length;

      setStudents(list);
      setTotal(totalCount);
      setPage(targetPage);
    } catch (err: any) {
      console.error("Failed to load student registrations:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load student registrations. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchStudents(page, pageSize);
  }, [page, pageSize, fetchStudents]);

  // Client-side search filtering over the currently loaded page
  const filteredStudents = useMemo(() => {
    if (!searchText.trim()) {
      return students;
    }

    const q = searchText.toLowerCase().trim();
    return students.filter((item) => {
      const fullName = `${item.firstName || ""} ${item.lastName || ""}`.toLowerCase();
      const rollNo = (item.task || "").toLowerCase();
      const email = (item.emailAddress || item.emailId || "").toLowerCase();
      const mobile = (item.mobileNumber || "").toLowerCase();
      const college = (item.collegeName || "").toLowerCase();
      const district = (item.collegeDistrict || item.nativeDistrict || "").toLowerCase();
      const stream = (item.stream || "").toLowerCase();
      const grad = (item.graduation || "").toLowerCase();

      return (
        fullName.includes(q) ||
        rollNo.includes(q) ||
        email.includes(q) ||
        mobile.includes(q) ||
        college.includes(q) ||
        district.includes(q) ||
        stream.includes(q) ||
        grad.includes(q)
      );
    });
  }, [students, searchText]);

  const columns: ColumnsType<StudentRegistration> = [
    {
      title: "S.No",
      key: "sno",
     
      align: "center",
      render: (_, __, index) => (
        <span className="font-semibold text-gray-500">
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Roll No / Task",
      key: "task",
     
    
      render: (_, record) => {
        const roll = record.task?.trim();
        return roll ? (
          <Tag color="geekblue" className="font-mono text-xs font-semibold px-2 py-0.5 rounded">
            <IdcardOutlined className="mr-1" />
            {roll}
          </Tag>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
    },
    {
      title: "Student Details",
      key: "studentDetails",
      width: 270,
      render: (_, record) => {
        const fullName = [record.firstName, record.lastName].filter(Boolean).join(" ").trim() || "Student";
        const gender = record.gender?.trim();
        const dob = record.dateOfBirth?.trim();

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-sm">
                <UserOutlined className="mr-1 text-blue-500" />
                {fullName}
              </span>
              {gender && (
                <Tag
                  color={gender.toLowerCase() === "male" ? "blue" : gender.toLowerCase() === "female" ? "magenta" : "cyan"}
                  className="text-xs px-1.5 py-0 rounded"
                >
                  {gender}
                </Tag>
              )}
            </div>
            {dob && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <CalendarOutlined className="text-amber-500" />
                <span>DOB: {dob}</span>
              </div>
            )}
            {record.nativeDistrict && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <EnvironmentOutlined className="text-emerald-500" />
                <span>Native: {record.nativeDistrict}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Contact",
      key: "contact",
      width: 230,
      render: (_, record) => {
        const email = record.emailAddress || record.emailId;
        const mobile = record.mobileNumber;

        return (
          <div className="flex flex-col gap-1.5 text-xs">
            {mobile ? (
              <a
                href={`tel:${mobile}`}
                className="text-[#1ab394] hover:text-teal-700 flex items-center gap-1 font-medium transition-colors"
              >
                <PhoneOutlined />
                <span>{mobile}</span>
              </a>
            ) : (
              <span className="text-gray-400">No Mobile</span>
            )}

            {email ? (
              <a
                href={`mailto:${email}`}
                className="text-[#008cba] hover:text-blue-700 flex items-center gap-1 truncate max-w-[190px] transition-colors"
                title={email}
              >
                <MailOutlined />
                <span className="truncate">{email}</span>
              </a>
            ) : (
              <span className="text-gray-400">No Email</span>
            )}
          </div>
        );
      },
    },
    {
      title: "College & District",
      key: "college",
      width: 270,
      render: (_, record) => {
        return (
          <div className="flex flex-col gap-1 text-xs">
            {record.collegeName ? (
              <div className="font-semibold text-gray-800 flex items-start gap-1">
                <BankOutlined className="text-[#008cba] mt-0.5 flex-shrink-0" />
                <span>{record.collegeName}</span>
              </div>
            ) : (
              <span className="text-gray-400">—</span>
            )}

            {record.collegeDistrict && (
              <div className="text-gray-500 flex items-center gap-1 ml-4">
                <EnvironmentOutlined className="text-gray-400" />
                <span>{record.collegeDistrict}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Education",
      key: "education",
      width: 170,
      render: (_, record) => {
        const grad = record.graduation;
        const stream = record.stream;
        const year = record.yearOfPassOut;

        return (
          <div className="flex flex-col gap-1 text-xs">
            {(grad || stream) && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag color="purple" className="font-semibold px-2 py-0.5 rounded m-0">
                  <BookOutlined className="mr-1" />
                  {[grad, stream].filter(Boolean).join(" - ")}
                </Tag>
              </div>
            )}
            {year && (
              <div className="text-gray-600 font-medium ml-1">
                Passout Year: <span className="font-bold text-gray-800">{year}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Academic Scores",
      key: "scores",
      width: 170,
      render: (_, record) => {
        const tenth = record.tenthPercentage;
        const inter = record.intermediatePercentage;
        const grad = record.graduationPercentage;

        return (
          <div className="flex flex-col gap-1 text-xs">
            {tenth && (
              <div>
                <span className="text-gray-500 font-medium">10th: </span>
                <span className="font-semibold text-gray-800">{tenth}%</span>
              </div>
            )}
            {inter && (
              <div>
                <span className="text-gray-500 font-medium">Inter: </span>
                <span className="font-semibold text-gray-800">{inter}%</span>
              </div>
            )}
            {grad && (
              <div>
                <span className="text-gray-500 font-medium">Graduation: </span>
                <span className="font-semibold text-indigo-600">{grad}%</span>
              </div>
            )}
            {!tenth && !inter && !grad && <span className="text-gray-400">—</span>}
          </div>
        );
      },
    },
    // {
    //   title: "Consent",
    //   key: "consent",
    //   width: 80,
    //   align: "center",
    //   render: (_, record) => {
    //     const consent = record.informationIsTrue?.trim();
    //     return consent ? (
    //       <Tag color="green" className="text-xs px-2 py-0.5 rounded font-medium">
    //         <CheckCircleOutlined className="mr-1" />
    //         {consent}
    //       </Tag>
    //     ) : (
    //       <span className="text-gray-400">—</span>
    //     );
    //   },
    // },
  ];

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50/60">
      {/* Header Row: Title & Subtitle on Left, Search Input on Right */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Title level={3} className="m-0 text-gray-800">
            Student Registrations
          </Title>
          <Text type="secondary" className="text-xs sm:text-sm">
            View and manage registered student details, academics, and college data
          </Text>
        </div>

        {/* Right side search functionality */}
        <div className="w-full sm:w-80">
          <Input
            allowClear
            placeholder="Search student, roll no, college, mobile..."
            prefix={<SearchOutlined className="text-gray-400 mr-1" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-lg h-10 border-gray-300 shadow-none w-full"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert
          type="error"
          message="Failed to Fetch Student Registrations"
          description={error}
          showIcon
          closable
          onClose={() => setError(null)}
          action={
            <Button size="small" type="primary" onClick={() => fetchStudents(page, pageSize)}>
              Retry
            </Button>
          }
          className="mb-6 rounded-lg"
        />
      )}

      {/* Loading Spinner */}
      {loading && !students.length && (
        <div className="py-20 text-center">
          <Spin size="large" tip="Loading student registrations..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && !filteredStudents.length && (
        <Card className="rounded-xl shadow-sm border border-gray-100 text-center py-12">
          <Empty
            description={
              searchText
                ? "No student records match the active search criteria."
                : "No student registrations found."
            }
          />
        </Card>
      )}

      {/* Mobile Card List View (<768px) */}
      {!loading && isMobile && filteredStudents.length > 0 && (
        <div className="space-y-4 mb-6">
          {filteredStudents.map((student, idx) => {
            const fullName = [student.firstName, student.lastName].filter(Boolean).join(" ") || "Student";
            const rollNo = student.task;
            const email = student.emailAddress || student.emailId;
            const mobile = student.mobileNumber;

            return (
              <Card
                key={student.id || idx}
                className="rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                bodyStyle={{ padding: 14 }}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <div className="text-xs text-gray-500 font-semibold mb-0.5">
                      #{(page - 1) * pageSize + idx + 1}
                    </div>
                    <div className="font-bold text-gray-900 text-base">{fullName}</div>
                    {rollNo && (
                      <Tag color="geekblue" className="font-mono text-xs mt-1">
                        {rollNo}
                      </Tag>
                    )}
                  </div>
                  {student.gender && (
                    <Tag
                      color={student.gender.toLowerCase() === "male" ? "blue" : "magenta"}
                      className="text-xs"
                    >
                      {student.gender}
                    </Tag>
                  )}
                </div>

                <Divider className="my-2" />

                <div className="text-xs space-y-1.5 text-gray-600 mb-3">
                  {student.collegeName && (
                    <div className="flex items-start gap-1.5">
                      <BankOutlined className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{student.collegeName}</span>
                    </div>
                  )}

                  {(student.graduation || student.stream) && (
                    <div className="flex items-center gap-1.5">
                      <BookOutlined className="text-purple-500 flex-shrink-0" />
                      <span className="font-semibold text-purple-700">
                        {[student.graduation, student.stream].filter(Boolean).join(" - ")}
                      </span>
                      {student.yearOfPassOut && (
                        <span className="text-gray-500">({student.yearOfPassOut})</span>
                      )}
                    </div>
                  )}

                  {mobile && (
                    <div className="flex items-center gap-1.5">
                      <PhoneOutlined className="text-teal-600 flex-shrink-0" />
                      <a href={`tel:${mobile}`} className="text-teal-600 font-medium">
                        {mobile}
                      </a>
                    </div>
                  )}

                  {email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MailOutlined className="text-blue-600 flex-shrink-0" />
                      <a href={`mailto:${email}`} className="text-blue-600 truncate">
                        {email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
                  <span className="text-gray-500">
                    {student.graduationPercentage ? `Grad Score: ${student.graduationPercentage}%` : ""}
                  </span>
                  {student.informationIsTrue && (
                    <Tag color="green" className="text-xs m-0">
                      <CheckCircleOutlined className="mr-1" />
                      {student.informationIsTrue}
                    </Tag>
                  )}
                </div>
              </Card>
            );
          })}

          {/* Mobile Pagination */}
          <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-200">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              size="small"
            >
              Previous
            </Button>
            <span className="text-xs text-gray-600">
              Page <strong>{page}</strong> of {Math.max(1, Math.ceil(total / pageSize))}
            </span>
            <Button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage((p) => p + 1)}
              size="small"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Desktop / Tablet Table View (>=768px) */}
      {!loading && !isMobile && filteredStudents.length > 0 && (
        <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6" bodyStyle={{ padding: 0 }}>
          <Table<StudentRegistration>
            columns={columns}
            dataSource={filteredStudents}
            rowKey={(r) => r.id || `${r.task}_${r.mobileNumber}`}
            loading={loading}
            scroll={{ x: true }}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              showSizeChanger: false,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (tot, range) => `${range[0]}-${range[1]} of ${tot} students`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                if (newPageSize !== pageSize) {
                  setPageSize(newPageSize);
                }
              },
            }}
            rowClassName={(_, idx) => (idx % 2 === 0 ? "bg-white" : "bg-gray-50/50")}
          />
        </Card>
      )}
    </div>
  );
};

export default StudentRegistrations;
