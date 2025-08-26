import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Spin, Card, Tag, Avatar, Space, Tooltip, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EyeOutlined,
  RobotOutlined,
  CalendarOutlined,
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { getAssistants, Assistant, AssistantsResponse } from "./assistantApi";

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  firstId?: string;
  lastId?: string;
}

const Dashboard: React.FC = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 50,
    total: 0,
    hasMore: false,
  });
  const [pageHistory, setPageHistory] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchAssistants = useCallback(async (after?: string, isLoadMore: boolean = false) => {
    setLoading(true);
    try {
      const response: AssistantsResponse = await getAssistants(pagination.pageSize, after);
      
      if (isLoadMore) {
        // Load more: append to existing assistants
        setAssistants(prev => [...prev, ...response.data]);
      } else {
        // Fresh load or navigation: replace assistants
        setAssistants(response.data);
      }

      setPagination(prev => ({
        ...prev,
        hasMore: response.has_more,
        firstId: response.first_id,
        lastId: response.last_id,
        total: isLoadMore ? prev.total + response.data.length : response.data.length,
      }));
    } catch (error) {
      console.error("Error fetching assistants:", error);
      message.error("Failed to load assistants");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  useEffect(() => {
    fetchAssistants();
  }, []);

  const handleNavigate = (id: string) => {
    navigate(`/admn/conversation/${id}`);
  };

  const handleLoadMore = async () => {
    if (!pagination.hasMore || !pagination.lastId) return;
    
    await fetchAssistants(pagination.lastId, true);
    setPagination(prev => ({
      ...prev,
      current: prev.current + 1,
    }));
  };

  const handleNextPage = async () => {
    if (!pagination.hasMore || !pagination.lastId) return;
    
    // Save current first_id for back navigation
    if (pagination.firstId) {
      setPageHistory(prev => [...prev, pagination.firstId!]);
    }
    
    await fetchAssistants(pagination.lastId);
    setPagination(prev => ({
      ...prev,
      current: prev.current + 1,
    }));
  };

  const handlePrevPage = async () => {
    if (pagination.current <= 1 || pageHistory.length === 0) return;
    
    // Get the previous page's first_id
    const newHistory = [...pageHistory];
    const prevPageId = newHistory.pop();
    setPageHistory(newHistory);
    
    // If we're going to page 1, don't pass after parameter
    const afterParam = pagination.current === 2 ? undefined : prevPageId;
    
    await fetchAssistants(afterParam);
    setPagination(prev => ({
      ...prev,
      current: prev.current - 1,
    }));
  };

  const handleRefresh = () => {
    setPageHistory([]);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: 0,
    }));
    fetchAssistants();
  };

  const columns = [
    {
      title: "Assistant Details",
      key: "idName",
      render: (_: any, record: Assistant) => (
        <div className="py-2">
          <div className="flex items-center mb-2">
            <Avatar className="bg-purple-600 mr-3" icon={<RobotOutlined />} />
            <div>
              <div className="text-base font-semibold text-gray-800 mb-1">
                {record.name}
              </div>
              <Tag color="purple" className="text-sm rounded-full">
                ID: {record.id}
              </Tag>
            </div>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Instructions",
      key: "instructions",
      width: 400,
      render: (_: any, record: Assistant) => {
        const instructions =
          (record as any).instructions || "No instructions provided";
        return (
          <div className="max-h-32 overflow-y-auto whitespace-pre-wrap pr-2 scrollbar-none text-sm leading-relaxed text-gray-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
            {instructions}
          </div>
        );
      },
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: 130,
      render: (text: string | undefined) => (
        <Tag
          color={text ? "geekblue" : "default"}
          style={{
            borderRadius: "16px",
            fontWeight: 500,
            fontSize: "12px",
          }}
        >
          {text || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Created On",
      dataIndex: "created_at",
      key: "createdAt",
      width: 150,
      render: (timestamp: number | undefined) => (
        <div className="text-sm text-gray-600 font-medium">
          {timestamp ? new Date(timestamp * 1000).toLocaleString() : "-"}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_: any, record: Assistant) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleNavigate(record.id)}
          className="bg-purple-600 border-purple-600 rounded-md hover:bg-purple-700 hover:border-purple-700"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 p-2 pt-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="m-0 text-3xl font-semibold text-gray-800">
            Assistants Dashboard
          </h1>
          <Space>
            {/* <Button
              onClick={handleRefresh}
              className="rounded-md"
              loading={loading}
            >
              Refresh
            </Button> */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admn/createassistant")}
              className="bg-purple-600 border-purple-600 rounded-md hover:bg-purple-700 hover:border-purple-700"
            >
              Create New Assistant
            </Button>
          </Space>
        </div>

        {/* Pagination Info */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-600 text-sm">
            Showing{" "}
            <span className="text-purple-600 font-semibold">
              {assistants.length}
            </span>{" "}
            assistants (Page {pagination.current})
          </div>
          
          {/* Custom Pagination Controls */}
          <div className="flex items-center space-x-2">
            <Button
              icon={<LeftOutlined />}
              onClick={handlePrevPage}
              disabled={pagination.current <= 1}
              size="small"
              className="rounded-md"
            >
              Previous
            </Button>
            
            <span className="text-sm text-gray-600 px-2">
              Page {pagination.current}
            </span>
            
            <Button
              icon={<RightOutlined />}
              onClick={handleNextPage}
              disabled={!pagination.hasMore}
              size="small"
              className="rounded-md"
            >
              Next
            </Button>
          </div>
        </div>

        {loading && assistants.length === 0 ? (
          <div className="flex justify-center items-center h-80 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <Spin size="large" />
              <div className="mt-4 text-gray-600 text-base">
                Loading assistants...
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <Table
              dataSource={assistants}
              columns={columns}
              rowKey="id"
              pagination={false} // Disable default pagination
              scroll={{ x: 900 }}
              loading={loading && assistants.length > 0}
              className="[&_.ant-table-thead>tr>th]:bg-purple-600 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-b-purple-700 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:py-4 [&_.ant-table-thead>tr>th]:px-3 [&_.ant-table-tbody>tr>td]:border-b-gray-200 [&_.ant-table-tbody>tr>td]:py-4 [&_.ant-table-tbody>tr>td]:px-3 [&_.ant-table]:border-gray-200"
            />
            
{/*             
            {pagination.hasMore && (
              <div className="p-4 text-center border-t border-gray-200">
                <Button
                  onClick={handleLoadMore}
                  loading={loading}
                  className="bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 rounded-md"
                >
                  Load More ({pagination.pageSize} more)
                </Button>
              </div>
            )} */}
          </div>
        )}

        {/* Bottom Pagination (Alternative) */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-4 bg-white px-6 py-3 rounded-lg border border-gray-200">
            <Button
              icon={<LeftOutlined />}
              onClick={handlePrevPage}
              disabled={pagination.current <= 1}
              className="rounded-md"
            >
              Previous Page
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Page {pagination.current}
              </span>
              {pagination.hasMore && (
                <span className="text-xs text-gray-400">• More available</span>
              )}
            </div>
            
            <Button
              icon={<RightOutlined />}
              onClick={handleNextPage}
              disabled={!pagination.hasMore}
              className="rounded-md"
            >
              Next Page
            </Button>
          </div>
        </div>
      </div>

      {/* Custom CSS for scrollbar hiding */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;