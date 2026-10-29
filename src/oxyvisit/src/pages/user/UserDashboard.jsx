import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Table, Image, Button, Input, Modal, Tag } from 'antd';
import { CheckCircleOutlined, AppstoreOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useOxyNavigate } from '../../utils/navigation';
import { getCurrentUser } from '../../utils/user';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import BASE_URL from '../../core/config/Config';

// Attach autoTable plugin to jsPDF prototype immediately
try {
  if (typeof applyPlugin === 'function') {
    applyPlugin(jsPDF);
  } else if (autoTable && typeof autoTable.applyPlugin === 'function') {
    autoTable.applyPlugin(jsPDF);
  }
} catch (e) {
  console.warn('Could not apply autoTable plugin:', e);
}

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
      const userId = localStorage.getItem('userId') || getCurrentUser().id || '';
      let visits = [];

      try {
        const response = await fetch(`${API_BASE}/visits?userId=${userId}`);
        const resJson = await response.json();
        visits = Array.isArray(resJson) ? resJson : (resJson?.data || []);
      } catch (fetchErr) {
        console.warn('Direct fetch failed, falling back to state/axios:', fetchErr);
      }

      // Fallback to already loaded user visits if direct fetch returned empty
      if ((!visits || visits.length === 0) && userVisits && userVisits.length > 0) {
        visits = userVisits;
      }

      // Filter today visits using both the old format and isToday matcher
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const todayVisits = visits.filter(visit => {
        const dateField = visit.createdAt || visit.createdDate;
        if (!dateField) return false;
        const dateStr = String(dateField).trim();
        const visitDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0];
        return visitDate === today || visitDate === todayLocal || isToday(dateField);
      });

      // Select target visits for report:
      // If table has filtered visits (e.g. today filter or search), use filteredVisits.
      // Otherwise, if today's visits exist, use todayVisits.
      // Otherwise, use all available visits from the table.
      let targetVisits = [];
      if (filterTodayOnly) {
        targetVisits = (filteredVisits && filteredVisits.length > 0) ? filteredVisits : todayVisits;
      } else if (filteredVisits && filteredVisits.length > 0) {
        targetVisits = filteredVisits;
      } else if (todayVisits.length > 0) {
        targetVisits = todayVisits;
      } else {
        targetVisits = visits;
      }

      if (!targetVisits || targetVisits.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data',
          text: 'No visits available to download.',
        });
        return;
      }

      const doc = new jsPDF('l', 'mm', 'a4');

      const employeeName = (targetVisits.length && (targetVisits[0].userName || targetVisits[0].name))
        ? (targetVisits[0].userName || targetVisits[0].name)
        : (localStorage.getItem('userName') || 'Employee');

      const isTodayOnly = filterTodayOnly || (targetVisits.length > 0 && targetVisits.every(v => isToday(v.createdAt || v.createdDate)));

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(isTodayOnly ? 'STORE VISIT REPORT - TODAY' : 'STORE VISIT REPORT', 148, 18, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Employee: ${employeeName}`, 14, 32);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);
      doc.text(`Total Visits: ${targetVisits.length}`, 14, 48);

      // Table data
      const tableRows = targetVisits.map((v, index) => {
        let visitTime = '-';
        const rawDate = v.createdAt || v.createdDate;
        if (rawDate) {
          try {
            const dt = new Date(rawDate);
            if (!isNaN(dt.getTime())) {
              visitTime = `${dt.toLocaleDateString()}\n${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } else {
              visitTime = String(rawDate);
            }
          } catch {
            visitTime = String(rawDate);
          }
        }
        return [
          index + 1,
          v.categoryName || v.category || '-',
          v.name || v.visitName || '-',
          v.contactNumber || v.contact || '-',
          v.location || '-',
          v.description || '-',
          visitTime,
        ];
      });

      const tableConfig = {
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
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          cellPadding: 3
        },
        bodyStyles: {
          fontSize: 10,
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
          0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 35, fontStyle: 'bold' },
          2: { cellWidth: 38, fontStyle: 'bold' },
          3: { cellWidth: 28, halign: 'center', fontStyle: 'bold' },
          4: { cellWidth: 48 },
          5: { cellWidth: 68 },
          6: { cellWidth: 36, halign: 'center', fontStyle: 'bold' }
        },
        styles: {
          overflow: 'linebreak',
          minCellHeight: 8,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          valign: 'middle'
        },
        margin: { left: 14, right: 14 },
        tableWidth: 'auto',
        halign: 'center'
      };

      if (typeof doc.autoTable === 'function') {
        doc.autoTable(tableConfig);
      } else if (typeof autoTable === 'function') {
        autoTable(doc, tableConfig);
      } else if (autoTable && typeof autoTable.default === 'function') {
        autoTable.default(doc, tableConfig);
      }

      // 100% Guaranteed Visual Fallback: If autoTable plugin didn't paint, draw the table manually
      if (!doc.lastAutoTable) {
        let y = 60;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(224, 231, 255);
        doc.rect(14, y, 269, 8, 'F');
        doc.text('No.', 16, y + 6);
        doc.text('Category', 30, y + 6);
        doc.text('Visit Name', 70, y + 6);
        doc.text('Contact', 115, y + 6);
        doc.text('Location', 145, y + 6);
        doc.text('Description', 195, y + 6);
        doc.text('Visited At', 255, y + 6);
        y += 10;
        doc.setFont('helvetica', 'normal');
        tableRows.forEach((row, i) => {
          if (y > 185) {
            doc.addPage();
            y = 20;
          }
          if (i % 2 === 1) {
            doc.setFillColor(245, 245, 245);
            doc.rect(14, y - 4, 269, 8, 'F');
          }
          doc.text(String(row[0] || ''), 16, y + 2);
          doc.text(String(row[1] || '').substring(0, 18), 30, y + 2);
          doc.text(String(row[2] || '').substring(0, 20), 70, y + 2);
          doc.text(String(row[3] || '').substring(0, 14), 115, y + 2);
          doc.text(String(row[4] || '').substring(0, 22), 145, y + 2);
          doc.text(String(row[5] || '').substring(0, 26), 195, y + 2);
          doc.text(String(row[6] || '').substring(0, 12), 255, y + 2);
          y += 9;
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

      const safeEmployeeName = String(employeeName).replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`Visit_Report_${safeEmployeeName}_${today}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'Downloaded',
        text: `Report downloaded successfully!`,
        timer: 2000,
      });
    } catch (error) {
      console.error('Failed to download report:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message ? `Failed to download report: ${error.message}` : 'Failed to download report.',
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
            {filterTodayOnly ? "Download Today's Report" : "Download Report"}
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
