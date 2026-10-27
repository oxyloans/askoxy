import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Empty, Table, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useOxyNavigate } from '../../utils/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import BASE_URL from '../../core/config/Config';
const API_BASE = `${BASE_URL}/ai-service`;

const UserVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { navigate } = useOxyNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      fetchVisits();
    }
  }, [categoryId]);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const isValidUuid = typeof userId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      const url = isValidUuid
        ? `${API_BASE}/visits?categoryId=${categoryId}&userId=${userId}`
        : `${API_BASE}/visits?categoryId=${categoryId}`;
      const response = await axios.get(url);
      const list = Array.isArray(response.data) ? [...response.data].reverse() : [];
      setVisits(list);
      if (list.length > 0 && list[0].categoryName) {
        setCategoryName(list[0].categoryName);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch visits';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      align: "center",
      render: (_, __, index) => (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      ),
      width: 80,
    },
    {
      title: "Visit Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
      render: (location) =>
        location ? (
          <a href={location} target="_blank" rel="noopener noreferrer">
            View Map
          </a>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (text) => (
        <span>{text?.length > 50 ? `${text.substring(0, 50)}...` : text}</span>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      align: "center",
      render: (url) =>
        url ? (
          <Image
            src={url}
            alt="Visit Image"
            width={50}
            height={50}
            style={{ borderRadius: '8px', objectFit: 'cover' }}
            preview={{
              mask: <div>View</div>
            }}
          />
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "Web Link",
      dataIndex: "webLink",
      key: "webLink",
      align: "center",
      render: (link) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Visit Site
          </a>
        ) : (
          <span>-</span>
        ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard/user-categories')}
          className="mb-4"
        >
          Back to Categories
        </Button>
        <div className="p-6 rounded-xl">
          <h1 className="text-xl md:text-1xl font-bold">
            My Visits {categoryName && <span style={{ textTransform: 'uppercase' }}>- {categoryName}</span>}
          </h1>
          <p className="mt-2">View and manage your personal visits</p>
        </div>
      </div>

      <Card className="rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" tip="Loading your visits..." />
          </div>
        ) : visits.length === 0 ? (
          <Empty 
            description={
              <div>
                <p className="text-gray-500 mb-2">You haven't added any visits in this category yet</p>
                <Button 
                  type="primary" 
                  onClick={() => navigate('/dashboard/user-categories')}
                  style={{ backgroundColor: '#1ab394', borderColor: '#1ab394' }}
                >
                  Go to Categories to Add Visit
                </Button>
              </div>
            }
            className="py-12"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={visits}
            rowKey="visitId"
            loading={loading}
            bordered
            scroll={{ x: 'max-content' }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: visits.length,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} visits`,
              pageSizeOptions: ['5', '10', '20', '50'],
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default UserVisits;
