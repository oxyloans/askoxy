import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Table, Image, Button, Input, Modal, Tag, Form, Upload, Space } from 'antd';
import {
  CheckCircleOutlined,
  AppstoreOutlined,
  SearchOutlined,
  DownloadOutlined,
  EditOutlined,
  EnvironmentOutlined,
  UploadOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { useOxyNavigate } from '../../utils/navigation';
import { getCurrentUser } from '../../utils/user';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  validateVisitForm,
  showValidationErrorsPopup,
  showBackendErrorPopup,
  showInvalidImagePopup,
  parseVisitDate,
  formatVisitDateTime,
  isToday,
  handleContactNumberChange,
} from '../../utils/visitValidation';
import jsPDF from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
import BASE_URL from '../../core/config/Config';

const API_BASE = `${BASE_URL}/ai-service`;

export default function UserDashboard() {
  const { navigate } = useOxyNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ categories: 0, visits: 0, todayVisits: 0 });
  const [userVisits, setUserVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');

  // Report Preview states
  const [reportPreviewModalVisible, setReportPreviewModalVisible] = useState(false);
  const [reportPreviewVisits, setReportPreviewVisits] = useState([]);
  const [reportPreviewEmployee, setReportPreviewEmployee] = useState('');
  const [reportPreviewDate, setReportPreviewDate] = useState('');
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Edit Visit states
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

  // Step 1: Open Report Preview before downloading
  const handleOpenReportPreview = async () => {
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

      if ((!visits || visits.length === 0) && userVisits && userVisits.length > 0) {
        visits = userVisits;
      }

      const now = new Date();
      const todayFormatted = now.toLocaleDateString();

      // Strictly filter for same-date visits only (NO OLD DATA)
      const sameDateVisits = visits.filter(visit => isToday(visit.createdAt || visit.createdDate));

      if (!sameDateVisits || sameDateVisits.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data for Today',
          text: `No visits found for today (${todayFormatted}). The report only includes visits from today (same date).`,
        });
        return;
      }

      const employeeName = (sameDateVisits.length && (sameDateVisits[0].userName || sameDateVisits[0].name))
        ? (sameDateVisits[0].userName || sameDateVisits[0].name)
        : (localStorage.getItem('userName') || 'Employee');

      setReportPreviewVisits(sameDateVisits);
      setReportPreviewEmployee(employeeName);
      setReportPreviewDate(todayFormatted);
      setReportPreviewModalVisible(true);
    } catch (error) {
      console.error('Failed to prepare report preview:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to prepare report preview.',
      });
    }
  };

  // Step 2: Confirm and download the PDF after user clicks "OK" in preview
  const handleConfirmDownloadPdf = async () => {
    setDownloadingReport(true);
    try {
      const sameDateVisits = reportPreviewVisits;
      const employeeName = reportPreviewEmployee;
      const todayFormatted = reportPreviewDate;
      const now = new Date();
      const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // Initialize autoTable plugin safely before generating document
      try {
        if (typeof applyPlugin === 'function') {
          applyPlugin(jsPDF);
        } else if (autoTable && typeof autoTable.applyPlugin === 'function') {
          autoTable.applyPlugin(jsPDF);
        }
      } catch (pluginErr) {
        // Plugin application failed or already applied
      }

      const doc = new jsPDF('l', 'mm', 'a4');

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('STORE VISIT REPORT - TODAY', 148, 18, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Employee: ${employeeName}`, 14, 32);
      doc.text(`Date: ${todayFormatted}`, 14, 40);
      doc.text(`Today's Visits: ${sameDateVisits.length}`, 14, 48);

      // Table data — same date visits only (formatted to client system date and time)
      const tableRows = sameDateVisits.map((v, index) => {
        const rawDate = v.createdAt || v.createdDate;
        const visitTime = formatVisitDateTime(rawDate, true);
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
          const timeParts = String(row[6] || '').split('\n');
          doc.text(timeParts[0] || '', 255, y + 1);
          if (timeParts[1]) {
            doc.setFontSize(8);
            doc.text(timeParts[1], 255, y + 5);
            doc.setFontSize(10);
          }
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
      doc.save(`Today_Report_${safeEmployeeName}_${todayISO}.pdf`);

      setReportPreviewModalVisible(false);

      Swal.fire({
        icon: 'success',
        title: 'Downloaded',
        text: `Today's report downloaded successfully!`,
        timer: 2000,
      });
    } catch (error) {
      console.error('Failed to download report:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message ? `Failed to download report: ${error.message}` : 'Failed to download report.',
      });
    } finally {
      setDownloadingReport(false);
    }
  };

  // Edit Visit validation & submit
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
      fetchStats();
    } catch (error) {
      showBackendErrorPopup(error, 'Update');
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      align: "center",
      render: (_, __, index) => <span>{index + 1}</span>,
      width: 70,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      align: "center",
      render: (text) => <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{text || '-'}</span>,
    },
    {
      title: "Visit Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => <span>{text || '-'}</span>,
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
      render: (text) => <span>{text || '-'}</span>,
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
          {text?.length > 50 ? `${text.substring(0, 50)}...` : (text || '-')}
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
      render: (date) => formatVisitDateTime(date, false),
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
            onClick={handleOpenReportPreview}
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

      {/* Description Modal */}
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

      {/* Report Preview Modal Before Download */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FilePdfOutlined style={{ fontSize: '22px', color: '#10b981' }} />
            <span style={{ 
              background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              Store Visit Report - Preview
            </span>
          </div>
        }
        open={reportPreviewModalVisible}
        onCancel={() => setReportPreviewModalVisible(false)}
        width={950}
        style={{ maxWidth: '96vw', top: 20 }}
        footer={[
          <Button key="cancel" onClick={() => setReportPreviewModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadingReport}
            onClick={handleConfirmDownloadPdf}
            style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
          >
            OK - Download Report
          </Button>
        ]}
      >
        <div style={{ padding: '10px 0' }}>
          {/* Header Summary Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Employee</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{reportPreviewEmployee}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Report Date</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{reportPreviewDate}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Total Today's Visits</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#10b981' }}>{reportPreviewVisits.length} Visits</div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
            Please review the visits for today below. Click <strong>"OK - Download Report"</strong> to download the PDF.
          </p>

          {/* Visits Table Preview */}
          <Table
            dataSource={reportPreviewVisits}
            rowKey={(r, idx) => r.visitId || idx}
            size="small"
            bordered
            pagination={false}
            scroll={{ x: 'max-content', y: 340 }}
            columns={[
              {
                title: 'No.',
                key: 'idx',
                align: 'center',
                width: 55,
                render: (_, __, i) => i + 1,
              },
              {
                title: 'Category',
                dataIndex: 'categoryName',
                key: 'categoryName',
                width: 120,
                render: (text, r) => <strong>{text || r.category || '-'}</strong>,
              },
              {
                title: 'Visit Name',
                dataIndex: 'name',
                key: 'name',
                width: 130,
                render: (text, r) => text || r.visitName || '-',
              },
              {
                title: 'Contact',
                dataIndex: 'contactNumber',
                key: 'contactNumber',
                align: 'center',
                width: 110,
                render: (text, r) => text || r.contact || '-',
              },
              {
                title: 'Location',
                dataIndex: 'location',
                key: 'location',
                width: 120,
                render: (loc) =>
                  loc ? (
                    <a href={loc} target="_blank" rel="noopener noreferrer">
                      View Map
                    </a>
                  ) : (
                    '-'
                  ),
              },
              {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                render: (desc) => (
                  <span style={{ fontSize: '12px' }}>
                    {desc?.length > 40 ? `${desc.substring(0, 40)}...` : (desc || '-')}
                  </span>
                ),
              },
              {
                title: 'Visited At',
                key: 'visitedAt',
                align: 'center',
                width: 140,
                render: (_, r) => {
                  const raw = r.createdAt || r.createdDate;
                  return formatVisitDateTime(raw, false);
                },
              },
            ]}
          />
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
