import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Spin, Tag, Input, Space, Image, Row, Col, Statistic, Modal, Form, Upload } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, UserOutlined, AppstoreOutlined, CheckCircleOutlined, CalendarOutlined, EditOutlined, UploadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useOxyNavigate } from '../../utils/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import BASE_URL from '../../core/config/Config';

const API_BASE = `${BASE_URL}/ai-service`;

const isToday = (dateVal) => {
  if (!dateVal) return false;
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const now = new Date();
      if (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      ) {
        return true;
      }
    }
    const str = String(dateVal);
    const now = new Date();
    const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayISO = now.toISOString().slice(0, 10);
    return str.startsWith(todayLocal) || str.startsWith(todayISO);
  } catch {
    return false;
  }
};

const VisitsManagement = () => {
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [stats, setStats] = useState({ totalVisits: 0, totalCategories: 0, todayVisits: 0 });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    location: '',
    contactNumber: '',
    description: '',
    webLink: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const { navigate } = useOxyNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    fetchVisits();
  }, [categoryId]);

  useEffect(() => {
    let filtered = visits;

    if (filterTodayOnly) {
      filtered = filtered.filter(visit => isToday(visit.createdAt || visit.createdDate));
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase().trim();
      filtered = filtered.filter(visit =>
        visit.name?.toLowerCase().includes(query) ||
        visit.userName?.toLowerCase().includes(query) ||
        visit.categoryName?.toLowerCase().includes(query) ||
        visit.location?.toLowerCase().includes(query) ||
        visit.contactNumber?.includes(query) ||
        (visit.createdAt || visit.createdDate || '').toLowerCase().includes(query)
      );
    }

    setFilteredVisits(filtered);
  }, [searchText, filterTodayOnly, visits]);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const url = categoryId 
        ? `${API_BASE}/visits?categoryId=${categoryId}`
        : `${API_BASE}/visits`;
      const response = await axios.get(url);
      const list = Array.isArray(response.data) ? [...response.data].reverse() : [];
      setVisits(list);
      setFilteredVisits(list);

      const uniqueCategories = new Set(list.map(v => v.categoryId)).size;
      const todayCount = list.filter(v => isToday(v.createdAt || v.createdDate)).length;
      setStats({
        totalVisits: list.length,
        totalCategories: uniqueCategories,
        todayVisits: todayCount
      });

      if (categoryId && list.length > 0 && list[0].categoryName) {
        setCategoryName(list[0].categoryName);
      } else {
        setCategoryName('');
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Visit name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[0-9]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Must be only digits';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.webLink && !/^https?:\/\/.+/.test(formData.webLink)) {
      newErrors.webLink = 'Must be a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (visit) => {
    setSelectedVisit(visit);
    setFormData({
      name: visit.name || '',
      userName: visit.userName || '',
      location: visit.location || '',
      contactNumber: visit.contactNumber || '',
      description: visit.description || '',
      webLink: visit.webLink || '',
      image: null
    });
    setEditModalVisible(true);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setFormData({ ...formData, location: googleMapsUrl });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to get location. Please enable location access.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Geolocation is not supported by your browser.',
      });
    }
  };

  const handleUpdateVisit = async () => {
    if (!validateForm()) return;

    try {
      // Keep the exact same userId and userName from the GET call (selectedVisit); never change or overwrite with admin name
      const rawUserName = selectedVisit?.userName ?? selectedVisit?.username ?? selectedVisit?.user_name ?? '';
      const resolvedUserName = (rawUserName === null || rawUserName === undefined || rawUserName === 'null') ? '' : rawUserName;

      const rawUserId = selectedVisit?.userId ?? selectedVisit?.userid ?? selectedVisit?.user_id ?? '';
      const resolvedUserId = (rawUserId === null || rawUserId === undefined || rawUserId === 'null') ? '' : rawUserId;

      const data = new FormData();
      data.append('userId', resolvedUserId);
      data.append('userName', resolvedUserName);
      data.append('name', formData.name);
      data.append('location', formData.location);
      data.append('contactNumber', formData.contactNumber);
      data.append('description', formData.description);
      if (formData.webLink) data.append('webLink', formData.webLink);
      if (formData.image) data.append('image', formData.image);

      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE}/visits/${selectedVisit.visitId}?userId=${resolvedUserId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Visit Updated!',
        text: 'The visit details have been updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
      setEditModalVisible(false);
      setSelectedVisit(null);
      setFormData({ name: '', userName: '', location: '', contactNumber: '', description: '', webLink: '', image: null });
      setErrors({});
      fetchVisits();
    } catch (error) {
      const errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.status ||
        'Failed to update visit. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: errorMessage,
      });
    }
  };

  const columns = [
    {
      title: "#",
      key: "sno",
      align: "center",
      render: (_, __, index) => (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (text) => (
        <div className="flex gap-2 justify-center">
          <span>{text || '-'}</span>
        </div>
      ),
      sorter: (a, b) => (a.userName || '').localeCompare(b.userName || ''),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      align: "center",
      render: (text) => <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{text}</span>,
      sorter: (a, b) => (a.categoryName || '').localeCompare(b.categoryName || ''),
    },
    {
      title: "Visit Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => <div>{text}</div>,
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
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
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
      align: "center",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (text) => (
        <div>
          {text?.length > 80 ? (
            <span title={text}>{text.substring(0, 80)}...</span>
          ) : (
            text
          )}
        </div>
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
            style={{ borderRadius: "8px", objectFit: "cover" }}
            preview={{
              mask: <div>View</div>,
            }}
          />
        ) : (
          <span>No image</span>
        ),
    },
    {
      title: "Website",
      dataIndex: "webLink",
      key: "webLink",
      align: "center",
      render: (link) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        ) : (
          <span>No link</span>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div>
        {categoryId && (
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard/categories')}
            className="mb-4"
          >
            Back to Categories
          </Button>
        )}
        
        <div className="p-2 md:p-4 rounded-xl">
          <h1 className="text-xl md:text-1xl font-bold">
            Visits Management
            {categoryName && (
              <span> - {categoryName}</span>
            )}
          </h1>
          <p className="mt-2">{categoryId ? 'View and manage all visits in this category' : 'View and manage all visits'}</p>
        </div>

        <Row gutter={16} className="mt-4">
          <Col xs={24} sm={8}>
            <Card 
              hoverable
              onClick={() => {
                if (categoryId) {
                  navigate('/dashboard/visits');
                } else {
                  setSearchText('');
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <Statistic
                title={categoryId ? "Category Visits (Click for All)" : "Total Visits"}
                value={stats.totalVisits}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card 
              hoverable
              onClick={() => navigate('/dashboard/categories')}
              style={{ cursor: 'pointer' }}
            >
              <Statistic
                title="Total Categories (Click to view)"
                value={stats.totalCategories}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card 
              hoverable
              onClick={() => setFilterTodayOnly((prev) => !prev)}
              style={{ 
                cursor: 'pointer',
                borderColor: filterTodayOnly ? '#ff6b6b' : undefined,
                backgroundColor: filterTodayOnly ? '#fff5f5' : undefined,
                boxShadow: filterTodayOnly ? '0 0 0 2px rgba(255, 107, 107, 0.25)' : undefined,
                transition: 'all 0.3s ease'
              }}
            >
              <Statistic
                title={filterTodayOnly ? "Today's Visits (Filter Active - Click to clear)" : "Today's Visits (Click to filter)"}
                value={stats.todayVisits}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#ff6b6b' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
      
      <Card className="rounded-xl">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <p className="mt-4">Loading visits...</p>
          </div>
        ) : (
          <>
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold m-0">
                    {filterTodayOnly ? "Today's Visits" : "All Visits"}
                  </h3>
                  {filterTodayOnly && (
                    <Tag 
                      color="red" 
                      closable 
                      onClose={() => setFilterTodayOnly(false)}
                      style={{ cursor: 'pointer', fontSize: '12px', padding: '2px 8px' }}
                    >
                      Showing Today Only (Click × to show all)
                    </Tag>
                  )}
                </div>
                <div className="w-full sm:w-auto">
                  <Input
                    placeholder="Search visits, users, locations..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large"
                    style={{ width: '100%', maxWidth: '320px' }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <Table
                columns={columns}
                  dataSource={filteredVisits}
                   bordered
                rowKey="visitId"
                scroll={{ x: "max-content" }}
                size="small"
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: filteredVisits.length,
                  showSizeChanger: true,
                  showQuickJumper: true,
                 
                  showTotal: (total, range) => (
                    `${range[0]}-${range[1]} of ${total} visits`
                  ),
                  pageSizeOptions: ['5', '10', '20', '50'],
                  onChange: (page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  },
                }}
              />
            </div>
          </>
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
            Edit Visit - {selectedVisit?.categoryName}
          </span>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedVisit(null);
          setFormData({ name: '', userName: '', location: '', contactNumber: '', description: '', webLink: '', image: null });
          setErrors({});
        }}
        footer={null}
        width={600}
        style={{ maxWidth: '95vw', top: 20 }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Visit Name"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name || ''}
          >
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter visit name"
            />
          </Form.Item>
          <Form.Item
            label="Location"
            validateStatus={errors.location ? 'error' : ''}
            help={errors.location || ''}
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
              />
              <Button onClick={getCurrentLocation} icon={<EnvironmentOutlined />} type="primary">
                Current Location
              </Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="Contact Number"
            validateStatus={errors.contactNumber ? 'error' : ''}
            help={errors.contactNumber || ''}
          >
            <Input
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="Enter contact number"
            />
          </Form.Item>
          <Form.Item
            label="Web Link"
            validateStatus={errors.webLink ? 'error' : ''}
            help={errors.webLink || ''}
          >
            <Input
              value={formData.webLink}
              onChange={(e) => setFormData({ ...formData, webLink: e.target.value })}
              placeholder="Enter web link"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description || ''}
          >
            <Input.TextArea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Enter description"
            />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                setFormData({ ...formData, image: file });
                return false;
              }}
              onRemove={() => setFormData({ ...formData, image: null })}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={handleUpdateVisit}
                style={{ backgroundColor: '#008cba', borderColor: '#008cba' }}
              >
                Update
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                setSelectedVisit(null);
                setFormData({ name: '', location: '', contactNumber: '', description: '', webLink: '', image: null });
                setErrors({});
              }}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitsManagement;