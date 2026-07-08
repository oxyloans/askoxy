import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Table,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  PageHeader,
  PageCard,
  EmptyState,
  LoadingState,
  StatChip,
  StatRow,
  OutlineSuccessButton,
  StatusTag,
  InfoBanner,
  BC_FORM,
  BC_INPUT,
  BC_SELECT,
  BC_TABLE,
} from "./businessCardUi";
import { successButtonStyle } from "./businessCardTheme";
import {
  CeoDetailsRequest,
  CeoDetailsResponse,
  CEO_EVENT_TYPE_OPTIONS,
  fetchCeoDetailsByUserId,
  formatEventTypeLabel,
  getLoggedInUserId,
  isBusinessEventType,
  saveCeoDetails,
  mapCeoRecordToForm,
  buildCeoDetailsSavePayload,
  filterOwnedCeoRecords,
  sortCeoRecordsByActive,
  pickActiveCeoRecord,
} from "./ceoBusinessCardApi";

const { TextArea } = Input;
const { useBreakpoint } = Grid;

const toFormState = (row: CeoDetailsResponse): CeoDetailsRequest => mapCeoRecordToForm(row);

const CeoDetailsListPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const loggedInUserId = getLoggedInUserId();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<CeoDetailsResponse[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editForm, setEditForm] = useState<CeoDetailsRequest | null>(null);
  const isBusinessEvent = isBusinessEventType(editForm?.eventType);

  const activeRecord = useMemo(
    () => pickActiveCeoRecord(rows, loggedInUserId),
    [rows, loggedInUserId]
  );

  const loadCeoList = useCallback(async () => {
    if (!loggedInUserId) {
      message.warning("Please login again to view user details.");
      return;
    }

    setLoading(true);
    setLoaded(true);
    try {
      const data = await fetchCeoDetailsByUserId(loggedInUserId);
      const owned = filterOwnedCeoRecords(
        data.filter((record) => String(record.ceoId || "") === loggedInUserId),
        loggedInUserId
      );
      setRows(sortCeoRecordsByActive(owned));
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    loadCeoList();
  }, [loadCeoList]);

  const updateEditField = (
    key: keyof CeoDetailsRequest,
    value: string | boolean
  ) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      if (key === "eventType") {
        if (isBusinessEventType(value as string)) {
          return next;
        }
        return {
          ...next,
          companyName: "",
          designation: "",
          email: "",
          linkedin: "",
          emailSubjectName: "",
        };
      }
      return next;
    });
  };

  const handleUpdate = async () => {
    if (!editForm?.id) {
      message.warning("Record ID is missing.");
      return;
    }
    if (!loggedInUserId) {
      message.warning("Please login again to update user details.");
      return;
    }

    setSaving(true);
    try {
      const wasActivating = editForm.active === true;
      await saveCeoDetails(buildCeoDetailsSavePayload(editForm));
      message.success(
        wasActivating
          ? "Record updated and set as active. Other events are now inactive."
          : "User details updated successfully."
      );
      setEditForm(null);
      await loadCeoList();
    } catch (error) {
      console.error(error);
      message.error("Failed to update user details.");
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<CeoDetailsResponse> = [
    { title: "Name", dataIndex: "ceoName", key: "ceoName", fixed: "left", width: 140, render: (v) => v || "-" },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      width: 100,
      render: (active) => <StatusTag active={active} />,
    },
    {
      title: "eventType",
      dataIndex: "eventType",
      key: "eventType",
      width: 120,
      render: (v) => formatEventTypeLabel(v),
    },
    {
      title: "eventName",
      dataIndex: "eventName",
      key: "eventName",
      width: 140,
      ellipsis: true,
      render: (v) => v || "-",
    },
    { title: "Company", dataIndex: "companyName", key: "companyName", width: 140, ellipsis: true, render: (v) => v || "-" },
    { title: "Designation", dataIndex: "designation", key: "designation", width: 140, ellipsis: true, render: (v) => v || "-" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile", width: 120, render: (v) => v || "-" },
    { title: "WhatsApp", dataIndex: "whatsapp", key: "whatsapp", width: 120, render: (v) => v || "-" },
    { title: "Email", dataIndex: "email", key: "email", width: 160, ellipsis: true, render: (v) => v || "-" },
    { title: "LinkedIn", dataIndex: "linkedin", key: "linkedin", width: 160, ellipsis: true, render: (v) => v || "-" },
    { title: "Location", dataIndex: "location", key: "location", width: 140, ellipsis: true, render: (v) => v || "-" },
    {
      title: "Email Subject",
      dataIndex: "emailSubjectName",
      key: "emailSubjectName",
      width: 160,
      ellipsis: true,
      render: (v, row) => (isBusinessEventType(row.eventType) ? v || "-" : "-"),
    },
    { title: "Content", dataIndex: "content", key: "content", width: 200, ellipsis: true, render: (v) => v || "-" },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 90,
      render: (_, row) => (
        <Button type="link" onClick={() => setEditForm(toFormState(row))}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <BusinessCardLayout>
      <PageHeader
        title="User Details List"
        subtitle="View all saved user profiles, update details, and manage active status for each record."
        actions={
          <OutlineSuccessButton onClick={loadCeoList} loading={loading} disabled={!loggedInUserId}>
            Refresh
          </OutlineSuccessButton>
        }
      />

      <StatRow>
        <StatChip label="Total profiles" value={rows.length} />
        <StatChip label="Active profiles" value={rows.filter((r) => r.active === true).length} />
        <StatChip
          label="Current active"
          value={activeRecord ? formatEventTypeLabel(activeRecord.eventType) : "None"}
        />
      </StatRow>

      <PageCard
        title="User records"
        description="Only one event can be active. Set Active in Edit to switch; others become inactive automatically."
      >
        {loading ? (
          <LoadingState message="Loading user profiles..." />
        ) : !loaded ? (
          <EmptyState
            title="Loading profiles"
            description="Fetching user details using your login account."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No records found"
            description="No user details exist for your account yet. Add one from the User Details page."
          />
        ) : (
          <Table
            rowKey={(row) => row.id || row.ceoName || "row"}
            columns={columns}
            dataSource={rows}
            size={isMobile ? "small" : "middle"}
            pagination={{ pageSize: 10, showSizeChanger: !isMobile, responsive: true }}
            scroll={{ x: 1500 }}
            className={BC_TABLE}
            rowClassName={(record) =>
              record.active === true ? "[&>td]:!bg-emerald-50/70" : ""
            }
          />
        )}
      </PageCard>

      <Modal
        title="Update user record"
        open={!!editForm}
        onCancel={() => !saving && setEditForm(null)}
        onOk={handleUpdate}
        confirmLoading={saving}
        okText="Update record"
        okButtonProps={{ style: successButtonStyle }}
        cancelButtonProps={{ className: "!text-[13px]" }}
        width={isMobile ? "100%" : 640}
        className={`[&_.ant-modal-content]:!rounded-lg ${BC_FORM}`}
        style={{ maxWidth: "calc(100vw - 32px)", top: isMobile ? 16 : undefined }}
        destroyOnClose
      >
        {editForm && (
          <Form layout="vertical" requiredMark={false} className={BC_FORM}>
            {editForm.active === true && (
              <InfoBanner variant="info">
                Setting this record as <strong>Active</strong> will deactivate all other events for
                your account.
              </InfoBanner>
            )}
            <Row gutter={[12, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Status">
                  <Switch
                    checked={editForm.active === true}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    onChange={(checked) => updateEditField("active", checked)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Name">
                  <Input
                    className={BC_INPUT}
                    value={editForm.ceoName || ""}
                    onChange={(e) => updateEditField("ceoName", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="eventType">
                  <Select
                    className={BC_SELECT}
                    value={editForm.eventType || undefined}
                    onChange={(value) => updateEditField("eventType", value)}
                    placeholder="Select eventType"
                    options={CEO_EVENT_TYPE_OPTIONS.map((o) => ({
                      label: o.label,
                      value: o.value,
                    }))}
                  />
                </Form.Item>
              </Col>
              {isBusinessEvent ? (
                <>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Company Name">
                      <Input
                        className={BC_INPUT}
                        value={editForm.companyName || ""}
                        onChange={(e) => updateEditField("companyName", e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Designation">
                      <Input
                        className={BC_INPUT}
                        value={editForm.designation || ""}
                        onChange={(e) => updateEditField("designation", e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="eventName">
                      <Input
                        className={BC_INPUT}
                        value={editForm.eventName || ""}
                        onChange={(e) => updateEditField("eventName", e.target.value)}
                        placeholder="Enter eventName"
                      />
                    </Form.Item>
                  </Col>
                </>
              ) : (
                <Col xs={24}>
                  <Form.Item label="eventName">
                    <Input
                      className={BC_INPUT}
                      value={editForm.eventName || ""}
                      onChange={(e) => updateEditField("eventName", e.target.value)}
                      placeholder="Enter eventName"
                    />
                  </Form.Item>
                </Col>
              )}
              <Col xs={24} sm={12}>
                <Form.Item label="Mobile">
                  <Input
                    className={BC_INPUT}
                    value={editForm.mobile || ""}
                    onChange={(e) => updateEditField("mobile", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="WhatsApp">
                  <Input
                    className={BC_INPUT}
                    value={editForm.whatsapp || ""}
                    onChange={(e) => updateEditField("whatsapp", e.target.value)}
                  />
                </Form.Item>
              </Col>
              {isBusinessEvent && (
                <>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Email">
                      <Input
                        className={BC_INPUT}
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => updateEditField("email", e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="LinkedIn">
                      <Input
                        className={BC_INPUT}
                        value={editForm.linkedin || ""}
                        onChange={(e) => updateEditField("linkedin", e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item label="Email Subject">
                      <Input
                        className={BC_INPUT}
                        value={editForm.emailSubjectName || ""}
                        onChange={(e) => updateEditField("emailSubjectName", e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col xs={24}>
                <Form.Item label="Location">
                  <Input
                    className={BC_INPUT}
                    value={editForm.location || ""}
                    onChange={(e) => updateEditField("location", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Content / Email Body">
                  <TextArea
                    className="!rounded-md !text-[13px]"
                    value={editForm.content || ""}
                    onChange={(e) => updateEditField("content", e.target.value)}
                    rows={4}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </BusinessCardLayout>
  );
};

export default CeoDetailsListPage;
