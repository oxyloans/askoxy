import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Table, Image, Button, Input, Modal, Tag } from 'antd';
import { CheckCircleOutlined, AppstoreOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useOxyNavigate } from '../../utils/navigation';
import { getCurrentUser } from '../../utils/user';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

const UserDashboard = () => {
  const { navigate } = useOxyNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ categories: 0, visits: 0, todayVisits: 0 });
  const [userVisits, setUserVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = userVisits;

    if (filterTodayOnly) {
      filtered = filtered.filter(visit => isToday(visit.createdAt || visit.createdDate));
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase().trim();
      filtered = filtered.filter(visit =>
        visit.categoryName?.toLowerCase().includes(query) ||
        visit.name?.toLowerCase().includes(query) ||
        visit.location?.toLowerCase().includes(query) ||
        visit.contactNumber?.includes(query) ||
        (visit.createdAt || visit.createdDate || '').toLowerCase().includes(query)
      );
    }

    setFilteredVisits(filtered);
  }, [searchText, filterTodayOnly, userVisits]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      const currentUserId = user.id || localStorage.getItem('userId');
      const isValidUuid = typeof currentUserId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUserId);
      
      const categoriesUrl = `${API_BASE}/categories`;
      const visitsUrl = isValidUuid ? `${API_BASE}/visits?userId=${currentUserId}` : `${API_BASE}/visits`;
      
      const categoriesRes = await axios.get(categoriesUrl);
      const visitsRes = await axios.get(visitsUrl);
      
      const catList = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
      let visitList = Array.isArray(visitsRes.data) ? visitsRes.data : [];

      if (!isValidUuid && currentUserId && visitList.some(v => v.userId === currentUserId)) {
        visitList = visitList.filter(v => v.userId === currentUserId);
      }

      const activeCategories = catList.filter(cat => cat.active).length;
      const todayVisits = visitList.filter(visit => isToday(visit.createdAt || visit.createdDate)).length;
      
      if (visitList.length > 0 && visitList[0].userName) {
        localStorage.setItem('userName', visitList[0].userName);
      }
      
      setStats({ categories: activeCategories, visits: visitList.length, todayVisits });
      setUserVisits(visitList);
      setFilteredVisits(visitList);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTodayReport = async () => {
    try {
      const user = getCurrentUser();
      const currentUserId = user.id || localStorage.getItem('userId');
      const isValidUuid = typeof currentUserId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUserId);
      const url = isValidUuid ? `${API_BASE}/visits?userId=${currentUserId}` : `${API_BASE}/visits`;
      const response = await fetch(url);

      const visits = await response.json();
      const list = Array.isArray(visits) ? visits : (visits?.data || []);

      // filter today visits
      const todayVisits = list.filter(visit => isToday(visit.createdAt || visit.createdDate));

      if (todayVisits.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data',
          text: 'No visits found for today.',
        });
        return;
      }

      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const doc = new jsPDF('l', 'mm', 'a4');

      const userName = (todayVisits.length && todayVisits[0].userName)
        ? todayVisits[0].userName
        : (localStorage.getItem('userName') || 'User');

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('STORE VISIT REPORT', 148, 18, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`User: ${userName}`, 14, 32);
      doc.text(`Date: ${now.toLocaleDateString()}`, 14, 40);
      doc.text(`Today's Visits: ${todayVisits.length}`, 14, 48);

      // Table data
      const tableRows = todayVisits.map((v, index) => [
        index + 1,
        v.categoryName || '-',
        v.name || '-',
        v.contactNumber || '-',
        v.location || '-',
        v.description || '-',
        v.createdAt ? `${new Date(v.createdAt).toLocaleDateString()}\n${new Date(v.createdAt).toLocaleTimeString()}` : '-'
      ]);

      const renderTable = typeof autoTable === 'function' ? autoTable : (autoTable?.default || (typeof doc.autoTable === 'function' ? doc.autoTable.bind(doc) : null));
      if (renderTable) {
        renderTable(doc, {
          startY: 56,
        head: [[
          'No.',
          'Category',
          'Visit Name',
          'Contact',
          'Location',
          'Description',
          'Visited At'
        ]],
        body: tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [224, 231, 255],
          textColor: [0, 0, 0],
          fontSize: 12,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          cellPadding: 3
        },
        bodyStyles: {
          fontSize: 11,
          cellPadding: 3,
          textColor: [0, 0, 0],
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          fontStyle: 'normal'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center', fontStyle: 'bold', fontSize: 12 },
          1: { cellWidth: 35, fontStyle: 'bold', fontSize: 11 },
          2: { cellWidth: 40, fontStyle: 'bold', fontSize: 11 },
          3: { cellWidth: 28, halign: 'center', fontSize: 12, overflow: 'visible', fontStyle: 'bold' },
          4: { cellWidth: 50, fontSize: 11 },
          5: { cellWidth: 65, fontSize: 11 },
          6: { cellWidth: 35, halign: 'center', fontSize: 11, fontStyle: 'bold' }
        },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          minCellHeight: 8,
          lineColor: [0, 0, 0],
          lineWidth: 0.5
        },
        margin: { left: 14, right: 14 },
        tableWidth: 'auto',
        halign: 'center'
      });
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        );
      }

      doc.save(`Today_Report_${userName}_${today}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'Downloaded',
        text: `Today's report downloaded successfully!`,
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to download report.',
      });
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      align: "center",
      render: (_, __, index) => <span>{index + 1}</span>,
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
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
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
          <Image src={url} width={50} height={50} style={{ borderRadius: '8px', objectFit: 'cover' }} preview={{ closeIcon: <div style={{ 
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
          </div> }} />
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
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable onClick={() => navigate('/dashboard/user-categories')} style={{ cursor: 'pointer' }}>
            <Statistic
              title="Categories"
              value={stats.categories}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable onClick={() => navigate('/dashboard/user-all-visits')} style={{ cursor: 'pointer' }}>
            <Statistic
              title="My Visits"
              value={stats.visits}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
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
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#ff6b6b' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mt-6 rounded-xl">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <Input
            placeholder="Search by category, visit name, location..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            className="w-full sm:max-w-md"
          />
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={downloadTodayReport}
            style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
            size="large"
            className="w-full sm:w-auto"
          >
            Download Today's Report
          </Button>
        </div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              {filterTodayOnly ? "Today's Visits" : "My Visits"}
            </h2>
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
          {filterTodayOnly && (
            <Button size="small" onClick={() => setFilterTodayOnly(false)}>
              Show All Visits
            </Button>
          )}
        </div>
        <Table
          columns={columns}
          dataSource={filteredVisits}
          rowKey="visitId"
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} visits`,
          }}
        />
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
    </div>
  );
};

export default UserDashboard;
