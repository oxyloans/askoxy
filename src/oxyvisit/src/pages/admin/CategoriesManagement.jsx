import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Card } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useOxyNavigate } from '../../utils/navigation';
import BASE_URL from '../../core/config/Config';
const API_BASE = `${BASE_URL}/ai-service`;

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoryName, setCategoryName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [errors, setErrors] = useState({});
  const { navigate } = useOxyNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(cat =>
      cat.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchText, categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/categories`);
      const list = Array.isArray(response.data) ? [...response.data].reverse() : [];
      setCategories(list);
      setFilteredCategories(list);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch categories';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!categoryName.trim()) {
      newErrors.name = 'Category name is required';
    } else if (categoryName.trim().length < 2) {
      newErrors.name = 'Must be at least 2 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await axios.post(`${API_BASE}/create-category`, { name: categoryName.trim() });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Category created successfully',
        timer: 2000,
      });
      setModalVisible(false);
      setCategoryName('');
      setErrors({});
      fetchCategories();
    } catch (error) {
      const errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.status ||
        'Failed to create category. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Error Creating Category',
        text: errorMessage,
      });
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_BASE}/categories/toggle/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Category ${currentStatus ? 'deactivated' : 'activated'} successfully`,
        timer: 2000,
        showConfirmButton: false,
      });
      fetchCategories();
    } catch (error) {
      const errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.status ||
        'Failed to toggle category status. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Status Update Error',
        text: errorMessage,
      });
    }
  };

  const columns = [
    {
      title: 'S.No',
      key: 'sno',
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 80,
      responsive: ['sm'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text) => <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      render: (active) => (
        <span className={`px-2 py-1 rounded text-xs ${active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/dashboard/visits/${record.id}`)}
            style={{ backgroundColor: '#008cba', borderColor: '#008cba' }}
          >
            View Visits
          </Button>
          <Button
            type="primary"
            onClick={() => handleToggle(record.id, record.active)}
            style={{
              backgroundColor: record.active ? '#f5222d' : '#1ab394',
              borderColor: record.active ? '#f5222d' : '#1ab394',
            }}
          >
            {record.active ? 'Inactive' : 'Active'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Categories Management</h1>
        <p className="text-gray-600 mt-2">Manage all categories and their status</p>
      </div>
      
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <Input
            placeholder="Search by category name..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            style={{ backgroundColor: '#1ab394', borderColor: '#1ab394' }}
          >
            Add Category
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          loading={loading}
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredCategories.length,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            pageSizeOptions: ['5', '10', '20', '50'],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      <Modal
        title="Create Category"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setCategoryName('');
          setErrors({});
        }}
        footer={null}
        width={500}
        style={{ maxWidth: '95vw', top: 20 }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Category Name"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name || ''}
          >
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={handleCreate}
                style={{ backgroundColor: '#008cba', borderColor: '#008cba' }}
              >
                Create
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setCategoryName('');
                setErrors({});
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesManagement;
