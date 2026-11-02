import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Empty, Table, Image, Input, Modal, Form, Upload, Row, Col, Space } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, EditOutlined, EnvironmentOutlined, UploadOutlined } from '@ant-design/icons';
import { useOxyNavigate } from '../../utils/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  validateVisitForm,
  showValidationErrorsPopup,
  showBackendErrorPopup,
  showInvalidImagePopup,
  handleContactNumberChange,
} from '../../utils/visitValidation';
import BASE_URL from '../../core/config/Config';

const API_BASE = `${BASE_URL}/ai-service`;

export default function UserAllVisits() {
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    location: '',
    contactNumber: '',
    description: '',
    webLink: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const { navigate } = useOxyNavigate();

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredVisits(visits);
      return;
    }
    const query = searchText.toLowerCase().trim();
    const filtered = visits.filter(visit =>
      visit.categoryName?.toLowerCase().includes(query) ||
      visit.name?.toLowerCase().includes(query) ||
      visit.location?.toLowerCase().includes(query) ||
      visit.contactNumber?.includes(query) ||
      (visit.createdAt || visit.createdDate || '').toLowerCase().includes(query)
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

  const validateForm = () => {
    const result = validateVisitForm(formData, 'Edit');
    setErrors(result.errors);
    return result;
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
      image: null,
    });
    setErrors({});
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
        () => {
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
    const { isValid, errorDetails } = validateForm();
    if (!isValid) {
      showValidationErrorsPopup(errorDetails, 'Update');
      return;
    }

    try {
      const rawUserName = selectedVisit?.userName ?? selectedVisit?.username ?? selectedVisit?.user_name ?? '';
      const resolvedUserName = (rawUserName === null || rawUserName === undefined || rawUserName === 'null') ? '' : rawUserName;

      const rawUserId = selectedVisit?.userId ?? selectedVisit?.userid ?? selectedVisit?.user_id ?? localStorage.getItem('userId') ?? '';
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
      showBackendErrorPopup(error, 'Update');
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
      width: 70,
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
            className="w-full sm:max-w-md"
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
        style={{ maxWidth: '95vw', top: 20 }}
      >
        <div style={{ padding: '20px 0', fontSize: '15px', lineHeight: '1.6' }}>
          {selectedDescription}
        </div>
      </Modal>

      {/* Edit Visit Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: 'linear-gradient(90deg, #9333ea 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              Edit Visit - {selectedVisit?.categoryName || 'Visit'}
            </span>
          </div>
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
          <Row gutter={16}>
            <Col xs={24} sm={12}>
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
            </Col>
            <Col xs={24} sm={12}>
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    Contact Number <span style={{ color: '#ef4444' }}>*</span>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal', marginLeft: '6px' }}>
                      (10 numeric digits only)
                    </span>
                  </span>
                }
                required
                validateStatus={
                  errors.contactNumber
                    ? 'error'
                    : formData.contactNumber?.length === 10
                    ? 'success'
                    : ''
                }
                help={
                  errors.contactNumber ? (
                    <span style={{ color: '#dc2626', fontWeight: 500 }}>
                      ⚠️ {errors.contactNumber}
                    </span>
                  ) : formData.contactNumber?.length === 10 ? (
                    <span style={{ color: '#16a34a', fontWeight: 500 }}>
                      ✓ Valid 10-digit mobile number
                    </span>
                  ) : formData.contactNumber ? (
                    <span style={{ color: '#d97706', fontSize: '12px' }}>
                      ℹ️ {formData.contactNumber.length}/10 digits entered. Enter {10 - formData.contactNumber.length} more numeric digit(s).
                    </span>
                  ) : (
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      Enter 10-digit mobile number using numeric digits (0-9) only. Alphabets are not allowed.
                    </span>
                  )
                }
              >
                <Input
                  value={formData.contactNumber}
                  onChange={(e) => {
                    const res = handleContactNumberChange(e.target.value);
                    setFormData({ ...formData, contactNumber: res.value });
                    setErrors((prev) => ({
                      ...prev,
                      contactNumber: res.error,
                    }));
                  }}
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
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
            </Col>
          </Row>
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
          <Form.Item
            label="Image"
            validateStatus={errors.image ? 'error' : ''}
            help={errors.image || 'Allowed formats: PNG, JPG, JPEG only'}
          >
            <Upload
              maxCount={1}
              accept="image/png, image/jpeg, image/jpg, .png, .jpg, .jpeg, .img"
              beforeUpload={(file) => {
                const isAllowed =
                  file.type === 'image/png' ||
                  file.type === 'image/jpeg' ||
                  file.type === 'image/jpg' ||
                  /\.(png|jpe?g|img)$/i.test(file.name);

                if (!isAllowed) {
                  showInvalidImagePopup(file);
                  setErrors((prev) => ({
                    ...prev,
                    image: 'Only PNG, JPG, or JPEG image files are allowed. Please upload a valid image file.',
                  }));
                  return Upload.LIST_IGNORE || false;
                }

                setErrors((prev) => ({ ...prev, image: '' }));
                setFormData({ ...formData, image: file });
                return false;
              }}
              onRemove={() => {
                setFormData({ ...formData, image: null });
                setErrors((prev) => ({ ...prev, image: '' }));
              }}
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
                Update Visit
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
}
