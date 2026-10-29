import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Row, Col, Empty, Spin, Upload, Space } from 'antd';
import { PlusOutlined, EyeOutlined, UploadOutlined, EnvironmentOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useOxyNavigate } from '../../utils/navigation';
import { getCurrentUser } from '../../utils/user';
import BASE_URL from '../../core/config/Config';
const API_BASE = `${BASE_URL}/ai-service`;

const FLUENT_3D_BASE = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets';

const getCategory3D = (name = '') => {
  const lower = name.toLowerCase();

  if (lower.includes('mill') || lower.includes('factory') || lower.includes('plant') || lower.includes('industry') || lower.includes('steel') || lower.includes('cement') || lower.includes('iron')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Factory/3D/factory_3d.png`,
      bg: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)',
      borderColor: '#fde68a',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      textColor: '#92400e',
      chipBg: '#fef3c7',
      chipBorder: '#fde68a',
      tag: 'Industry & Mills'
    };
  }
  if (lower.includes('store') || lower.includes('shop') || lower.includes('retail') || lower.includes('mart') || lower.includes('market') || lower.includes('mall') || lower.includes('supermarket') || lower.includes('grocer') || lower.includes('bazaar')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Shopping%20bags/3D/shopping_bags_3d.png`,
      bg: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)',
      borderColor: '#a7f3d0',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      textColor: '#065f46',
      chipBg: '#d1fae5',
      chipBorder: '#a7f3d0',
      tag: 'Retail & Stores'
    };
  }
  if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('health') || lower.includes('medical') || lower.includes('pharma') || lower.includes('doctor') || lower.includes('care')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Hospital/3D/hospital_3d.png`,
      bg: 'linear-gradient(145deg, #fff1f2 0%, #fee2e2 100%)',
      borderColor: '#fecaca',
      glowColor: 'rgba(239, 68, 68, 0.25)',
      textColor: '#991b1b',
      chipBg: '#fee2e2',
      chipBorder: '#fecaca',
      tag: 'Health & Medical'
    };
  }
  if (lower.includes('school') || lower.includes('college') || lower.includes('education') || lower.includes('university') || lower.includes('academy') || lower.includes('class') || lower.includes('institute') || lower.includes('study')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/School/3D/school_3d.png`,
      bg: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%)',
      borderColor: '#ddd6fe',
      glowColor: 'rgba(139, 92, 246, 0.25)',
      textColor: '#5b21b6',
      chipBg: '#ede9fe',
      chipBorder: '#ddd6fe',
      tag: 'Education'
    };
  }
  if (lower.includes('bank') || lower.includes('finance') || lower.includes('money') || lower.includes('loan') || lower.includes('atm') || lower.includes('credit') || lower.includes('cash')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Bank/3D/bank_3d.png`,
      bg: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)',
      borderColor: '#bfdbfe',
      glowColor: 'rgba(59, 130, 246, 0.25)',
      textColor: '#1e40af',
      chipBg: '#dbeafe',
      chipBorder: '#bfdbfe',
      tag: 'Banking & Finance'
    };
  }
  if (lower.includes('hotel') || lower.includes('restaurant') || lower.includes('cafe') || lower.includes('food') || lower.includes('dining') || lower.includes('tea') || lower.includes('coffee') || lower.includes('bakery') || lower.includes('resort')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Hotel/3D/hotel_3d.png`,
      bg: 'linear-gradient(145deg, #fff7ed 0%, #ffedd5 100%)',
      borderColor: '#fed7aa',
      glowColor: 'rgba(249, 115, 22, 0.25)',
      textColor: '#9a3412',
      chipBg: '#ffedd5',
      chipBorder: '#fed7aa',
      tag: 'Hotels & Dining'
    };
  }
  if (lower.includes('real estate') || lower.includes('property') || lower.includes('home') || lower.includes('house') || lower.includes('villa') || lower.includes('plot') || lower.includes('flat') || lower.includes('apartment') || lower.includes('land')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/House/3D/house_3d.png`,
      bg: 'linear-gradient(145deg, #ecfeff 0%, #cffafe 100%)',
      borderColor: '#a5f3fc',
      glowColor: 'rgba(6, 182, 212, 0.25)',
      textColor: '#155e75',
      chipBg: '#cffafe',
      chipBorder: '#a5f3fc',
      tag: 'Real Estate'
    };
  }
  if (lower.includes('vehicle') || lower.includes('auto') || lower.includes('car') || lower.includes('transport') || lower.includes('logistics') || lower.includes('bike') || lower.includes('travel') || lower.includes('garage')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Automobile/3D/automobile_3d.png`,
      bg: 'linear-gradient(145deg, #eef2ff 0%, #e0e7ff 100%)',
      borderColor: '#c7d2fe',
      glowColor: 'rgba(99, 102, 241, 0.25)',
      textColor: '#3730a3',
      chipBg: '#e0e7ff',
      chipBorder: '#c7d2fe',
      tag: 'Automotive & Travel'
    };
  }
  if (lower.includes('tech') || lower.includes('it') || lower.includes('software') || lower.includes('computer') || lower.includes('digital') || lower.includes('web') || lower.includes('electronic')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Laptop/3D/laptop_3d.png`,
      bg: 'linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%)',
      borderColor: '#bae6fd',
      glowColor: 'rgba(14, 165, 233, 0.25)',
      textColor: '#075985',
      chipBg: '#e0f2fe',
      chipBorder: '#bae6fd',
      tag: 'Tech & Digital'
    };
  }
  if (lower.includes('office') || lower.includes('company') || lower.includes('corporate') || lower.includes('business') || lower.includes('agency') || lower.includes('enterprise')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Office%20building/3D/office_building_3d.png`,
      bg: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
      borderColor: '#e2e8f0',
      glowColor: 'rgba(100, 116, 139, 0.25)',
      textColor: '#334155',
      chipBg: '#f1f5f9',
      chipBorder: '#e2e8f0',
      tag: 'Office & Corporate'
    };
  }
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('sport') || lower.includes('workout') || lower.includes('game') || lower.includes('club')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Trophy/3D/trophy_3d.png`,
      bg: 'linear-gradient(145deg, #fdf2f8 0%, #fce7f3 100%)',
      borderColor: '#fbcfe8',
      glowColor: 'rgba(236, 72, 153, 0.25)',
      textColor: '#9d174d',
      chipBg: '#fce7f3',
      chipBorder: '#fbcfe8',
      tag: 'Sports & Fitness'
    };
  }
  if (lower.includes('beauty') || lower.includes('salon') || lower.includes('spa') || lower.includes('jewel') || lower.includes('gold') || lower.includes('luxury')) {
    return {
      iconUrl: `${FLUENT_3D_BASE}/Sparkles/3D/sparkles_3d.png`,
      bg: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)',
      borderColor: '#fde68a',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      textColor: '#92400e',
      chipBg: '#fef3c7',
      chipBorder: '#fde68a',
      tag: 'Beauty & Premium'
    };
  }

  // Rotating 3D icons for unmapped / custom categories
  const fallbacks = [
    {
      iconUrl: `${FLUENT_3D_BASE}/Package/3D/package_3d.png`,
      bg: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)',
      borderColor: '#bfdbfe',
      glowColor: 'rgba(59, 130, 246, 0.25)',
      textColor: '#1e40af',
      chipBg: '#dbeafe',
      chipBorder: '#bfdbfe',
      tag: 'Category'
    },
    {
      iconUrl: `${FLUENT_3D_BASE}/Round%20pushpin/3D/round_pushpin_3d.png`,
      bg: 'linear-gradient(145deg, #fff1f2 0%, #fee2e2 100%)',
      borderColor: '#fecaca',
      glowColor: 'rgba(239, 68, 68, 0.25)',
      textColor: '#991b1b',
      chipBg: '#fee2e2',
      chipBorder: '#fecaca',
      tag: 'Location Visits'
    },
    {
      iconUrl: `${FLUENT_3D_BASE}/Card%20file%20box/3D/card_file_box_3d.png`,
      bg: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%)',
      borderColor: '#ddd6fe',
      glowColor: 'rgba(139, 92, 246, 0.25)',
      textColor: '#5b21b6',
      chipBg: '#ede9fe',
      chipBorder: '#ddd6fe',
      tag: 'Directory'
    },
    {
      iconUrl: `${FLUENT_3D_BASE}/Sparkles/3D/sparkles_3d.png`,
      bg: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)',
      borderColor: '#a7f3d0',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      textColor: '#065f46',
      chipBg: '#d1fae5',
      chipBorder: '#a7f3d0',
      tag: 'Special'
    }
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return fallbacks[Math.abs(hash) % fallbacks.length];
};

const UserCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const getUserId = () => getCurrentUser().id;
  const getUserName = () => getCurrentUser().name;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/categories`);
      const activeCategories = response.data.filter(cat => cat.active);
      setCategories(activeCategories.reverse());
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

  const handleAddVisit = async () => {
    if (!validateForm()) return;

    try {
      const user = getCurrentUser();
      const resolvedUserId = user.id;
      const resolvedUserName = user.name || user.userName || '';

      const data = new FormData();
      data.append('categoryId', selectedCategory.id);
      data.append('contactNumber', formData.contactNumber);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('name', formData.name);
      data.append('userId', resolvedUserId);
      data.append('userName', resolvedUserName);
      if (formData.webLink) data.append('webLink', formData.webLink);
      if (formData.image) data.append('image', formData.image);

      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/addVisit`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Visit Added!',
        text: 'Your visit has been recorded successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
      setModalVisible(false);
      setSelectedCategory(null);
      setFormData({ name: '', userName: '', location: '', contactNumber: '', description: '', webLink: '', image: null });
      setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.status ||
        'Failed to add visit. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Error Adding Visit',
        text: errorMessage,
      });
    }
  };

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/dashboard')}
        className="mb-4"
      >
        Back to Dashboard
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-600 mt-2">Browse and manage your categories</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : categories.length === 0 ? (
        <div>
          <Empty description="No active categories available" />
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {categories.map((category) => {
            const meta = getCategory3D(category.name);
            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={category.id}>
                <Card
                  hoverable
                  className="h-full group transition-all duration-300 hover:-translate-y-2"
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#ffffff',
                  }}
                  bodyStyle={{ padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  {/* Subtle 3D Top Accent Glow Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: meta.bg,
                    }}
                  />

                  <div className="flex flex-col items-center text-center h-full">
                    {/* 3D Icon Presentation Container */}
                    <div
                      style={{
                        width: '92px',
                        height: '92px',
                        borderRadius: '26px',
                        background: meta.bg,
                        border: `1.5px solid ${meta.borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        boxShadow: `0 10px 25px ${meta.glowColor}, inset 0 2px 4px rgba(255,255,255,0.8)`,
                        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                      className="group-hover:scale-110 group-hover:rotate-2"
                    >
                      <img
                        src={meta.iconUrl}
                        alt={category.name}
                        style={{
                          width: '66px',
                          height: '66px',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.18))',
                          userSelect: 'none',
                          pointerEvents: 'none',
                        }}
                        loading="lazy"
                      />
                    </div>

                    {/* Category Name */}
                    <h3
                      className="text-base md:text-lg font-bold text-gray-800 mb-1"
                      style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        lineHeight: '1.3',
                      }}
                      title={category.name}
                    >
                      {category.name}
                    </h3>

                    {/* Category Tag Badge */}
                    <div className="mb-6">
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: meta.textColor,
                          backgroundColor: meta.chipBg,
                          border: `1px solid ${meta.chipBorder}`,
                          padding: '3px 12px',
                          borderRadius: '16px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                      >
                        {meta.tag}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full mt-auto pt-2">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setSelectedCategory(category);
                          setFormData({
                            name: '',
                            userName: getUserName(),
                            location: '',
                            contactNumber: '',
                            description: '',
                            webLink: '',
                            image: null,
                          });
                          setErrors({});
                          setModalVisible(true);
                        }}
                        style={{
                          backgroundColor: '#1ab394',
                          borderColor: '#1ab394',
                          flex: 1,
                          borderRadius: '10px',
                          fontWeight: 600,
                          height: '40px',
                          boxShadow: '0 2px 6px rgba(26, 179, 148, 0.3)',
                        }}
                      >
                        Add Visit
                      </Button>
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/dashboard/user-visits/${category.id}`)}
                        style={{
                          backgroundColor: '#008cba',
                          borderColor: '#008cba',
                          flex: 1,
                          borderRadius: '10px',
                          fontWeight: 600,
                          height: '40px',
                          boxShadow: '0 2px 6px rgba(0, 140, 186, 0.3)',
                        }}
                      >
                        View Visits
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title={
          <div className="flex items-center gap-3">
            {selectedCategory && (
              <img
                src={getCategory3D(selectedCategory.name).iconUrl}
                alt=""
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
            )}
            <span style={{ 
              background: 'linear-gradient(90deg, #9333ea 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              Add Visit - {selectedCategory?.name}
            </span>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedCategory(null);
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
                onClick={handleAddVisit}
                style={{ backgroundColor: '#008cba', borderColor: '#008cba' }}
              >
                Submit
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setSelectedCategory(null);
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

export default UserCategories;
