import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Empty, Table, Image, Input, Modal } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useOxyNavigate } from '../../utils/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import BASE_URL from '../../core/config/Config';

const API_BASE = `${BASE_URL}/ai-service`;

const UserAllVisits = () => {
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const { navigate } = useOxyNavigate();

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    const filtered = visits.filter(visit =>
      visit.categoryName?.toLowerCase().includes(searchText.toLowerCase()) ||
      visit.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredVisits(filtered);
  }, [searchText, visits]);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const isValidUuid = typeof userId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      const url = isValidUuid ? `${API_BASE}/visits?userId=${userId}` : `${API_BASE}/visits`;
      const response = await axios.get(url);
      const list = Array.isArray(response.data) ? [...response.data].reverse() : [];
      setVisits(list);
      setFilteredVisits(list);
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
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      align: "center",
      render: (text) => <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: "Visit Name",
      dataIndex: "name",
      key: "name",
      align: "center",
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
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (text) => (
        <span 
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectedDescription(text || '-');
            setDescriptionModalVisible(true);
          }}
        >
          {text?.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
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
              mask: <div>View</div>,
              closeIcon: <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#ef4444', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>✕</span>
              </div>
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
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          Back to Dashboard
        </Button>
        <div className="p-6 rounded-xl">
          <h1 className="text-xl md:text-1xl font-bold">All My Visits</h1>
          <p className="mt-2">View all your visits across all categories</p>
        </div>
      </div>

      <Card className="rounded-xl">
        <div className="mb-4">
          <Input
            placeholder="Search by category or visit name..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            style={{ maxWidth: '400px' }}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" tip="Loading your visits..." />
          </div>
        ) : filteredVisits.length === 0 ? (
          <Empty 
            description={searchText ? "No visits found matching your search" : "You haven't added any visits yet"}
            className="py-12"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredVisits}
            rowKey="visitId"
            loading={loading}
            bordered
            scroll={{ x: 'max-content' }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredVisits.length,
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

      <Modal
        title={
          <span style={{ 
            background: 'linear-gradient(90deg, #9333ea 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            Description
          </span>
        }
        open={descriptionModalVisible}
        onCancel={() => setDescriptionModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDescriptionModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        <div style={{ padding: '20px 0', fontSize: '15px', lineHeight: '1.6' }}>
          {selectedDescription}
        </div>
      </Modal>
    </div>
  );
};

export default UserAllVisits;
