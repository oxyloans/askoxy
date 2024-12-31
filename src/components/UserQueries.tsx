import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  Image,
  notification,
  Spin,
  Table,
} from "antd";

import { UserSwitchOutlined } from "@ant-design/icons";

const { Option } = Select;

const AllQueriesforAdmin: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [errormsg, setErrormsg] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [comments, setComments] = useState<string>("");
  const [comments_error, setComments_error] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [approveLoader, setApproveLoader] = useState<boolean>(false);
  const [showModal1, setShowModal1] = useState<boolean>(false);
  const [details, setDetails] = useState<any>("");
  const [statusValue, setStatusValue] = useState<string>("PENDING");
  const [pendingQueries, setPendingQueries] = useState<any[]>([]);
  const [documentId, setDocumentId] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleSelectedOption = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setData([]);
    setStatusValue(event.target.value);
  };

  const accesToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  function queriesdisplaygetcall() {
    let data = {
      queryStatus: statusValue,
    };
    setLoader(true);
    axios
      .post(
        `https://meta.oxyloans.com/api/erice-service/writetous/getQueries`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accesToken}`,
          },
        }
      )
      .then((response) => {
        setLoader(false);
        setData(response.data);
      })
      .catch((error) => {
        setLoader(false);
        notification.error({
          message: "Error",
          description: error.response?.data?.error || "An error occurred", // Correctly accessing error properties
        });
      });
  }

  useEffect(() => {
    queriesdisplaygetcall();
  }, [statusValue]);

  const approvefunc = (value: string) => {
    if (comments === "" || comments === null) {
      setComments_error(true);
      return;
    }

    const data = {
      adminDocumentId: documentId || "",
      comments: comments,
      email: details.email,
      id: details.id,
      mobileNumber: details.mobileNumber,
      projectType: "ASKOXY",
      query: details.query,
      queryStatus: value,
      resolvedBy: "admin",
      resolvedOn: "",
      status: "",
      userDocumentId: "",
      userId: details.userId,
    };

    setApproveLoader(true);
    axios
      .post(
        `https://meta.oxyloans.com/api/erice-service/writetous/saveData`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accesToken}`,
          },
        }
      )
      .then(() => {
        setApproveLoader(false);
        setShowModal1(false);
        queriesdisplaygetcall();
        setComments("");
        setDocumentId("");
        notification.success({
          message: "Success",
          description: "You have successfully approved the query!",
        });
      })
      .catch((error) => {
        setApproveLoader(false);
        setShowModal1(false);
        notification.error({
          message: "Error",
          description: error.response?.data.error || "An error occurred",
        });
      });
  };

  const handleOpenModal = (item: any) => {
    setDetails(item);
    setImageUrl(item.userQueryDocumentStatus?.filePath || null);
    setShowModal1(true);
  };

  const handlePdfOpen = (url: string) => {
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`;
    window.open(viewerUrl, "_blank");
  };

  const handleCloseModal = () => {
    setShowModal1(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      notification.warning({
        message: "No File Selected",
        description: "Please select a file to upload.",
      });
      return;
    }

    setUploadStatus("loading");
    setFileName(file.name);

    // Prepare form data
    const formData = new FormData();
    formData.append("multiPart", file);
    formData.append("fileType", "kyc");

    // API call
    axios
      .post(
        `https://meta.oxyloans.com/api/erice-service/writetous/uploadQueryScreenShot?userId=${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accesToken}`, // Fix: Use correct header name for token
          },
        }
      )
      .then((response) => {
        setDocumentId(response.data.id);
        notification.success({
          message: "Success",
          description: "You have successfully uploaded the document.",
        });
        setUploadStatus("uploaded");
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.response?.data.error || "An error occurred during upload.",
        });
        setUploadStatus("failed");
      });
  };

  const handleImageOrPdf = (url: string) => {
    if (url.endsWith(".pdf")) {
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
        url
      )}&embedded=true`;
      window.open(viewerUrl, "_blank");
    } else if (
      [".png", ".jpg", ".jpeg"].some((ext) => url.toLowerCase().endsWith(ext))
    ) {
      const imgWindow = window.open(url, "_blank");
      if (imgWindow) {
        imgWindow.document.write(
          '<img src="' + url + '" style="width:100%; height:auto;" />'
        );
      }
    }
  };

  return (
    <div>
    
        <div className="page-header">
          <Row>
            <Col span={24}>
              <h2 className="text-xl font-bold">Queries Raised by Users</h2>
              <br />
            </Col>
          </Row>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={6}>
                    <Select
                      className="form-control"
                      value={statusValue}
                      onChange={(value: string) => setStatusValue(value)}
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="CANCELLED">CANCELLED</Select.Option>
                      <Select.Option value="COMPLETED">COMPLETED</Select.Option>
                      <Select.Option value="PENDING">PENDING</Select.Option>
                    </Select>
                  </Col>
                </Row>

                <Table
                  className="mt-4"
                  loading={loader}
                  dataSource={data}
                  rowKey="id"
                  pagination={false}
                  bordered
                  scroll={{ x: "100%" }}
                >
                  <Table.Column
                    title="S.no"
                    dataIndex="id"
                    render={(text, record, index) => index + 1}
                  />
                  <Table.Column
                    title="User Info"
                    render={(item: any) => (
                      <div>
                        <strong>Name:</strong> {item.name} <br />
                        <strong>Mobile Number:</strong> {item.mobileNumber}{" "}
                        <br />
                        <strong>Ticket Id:</strong> {item.randomTicketId} <br />
                        <strong>Created on:</strong>{" "}
                        {item.createdAt?.substring(0, 10)}
                      </div>
                    )}
                  />
                  <Table.Column title="User Query" dataIndex="query" />
                  {statusValue === "CANCELLED" && (
                    <Table.Column
                      title="User Cancelled Reason"
                      dataIndex="comments"
                    />
                  )}
                  {statusValue === "COMPLETED" && (
                    <Table.Column
                      title="Admin Comments"
                      render={(item: any) => (
                        <div>
                          {item.comments}
                          <br />
                          <strong>Resolved On:</strong>{" "}
                          {item?.resolvedOn?.substring(0, 10)}
                        </div>
                      )}
                    />
                  )}
                  <Table.Column
                    title="Admin & User Replies"
                    render={(item: any) =>
                      item.userPendingQueries.length > 0
                        ? item.userPendingQueries.map((pendingData:any, index:any) => (
                            <div key={index}>
                              <strong
                                style={{
                                  color:
                                    pendingData.resolvedBy === "admin"
                                      ? "green"
                                      : "blue",
                                }}
                              >
                                {pendingData.resolvedBy}
                              </strong>
                              : {pendingData.comments} <br />
                            </div>
                          ))
                        : "No replies"
                    }
                  />
                  <Table.Column
                    title="Action"
                    render={(item: any) => (
                      <Button
                        type="primary"
                        onClick={() => handleOpenModal(item)}
                      >
                        View Details
                      </Button>
                    )}
                  />
                </Table>
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="Query Details"
          visible={showModal1}
          onCancel={handleCloseModal}
          footer={null}
        >
          <div>
            <strong>Query:</strong> {details.query}
            <br />
            <strong>Comment:</strong> {details.comments}
            <br />
            <strong>Ticket ID:</strong> {details.randomTicketId}
            <br />
            {details?.userQueryDocumentStatus?.filePath && (
              <div>
                <strong>Document:</strong>
                <Button
                  onClick={() =>
                    handleImageOrPdf(details.userQueryDocumentStatus.filePath)
                  }
                >
                  View Document
                </Button>
              </div>
            )}
            <Form>
              <Form.Item>
                <Input.TextArea
                  placeholder="Add Comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                />
                {comments_error && (
                  <div style={{ color: "red" }}>Please add a comment.</div>
                )}
              </Form.Item>
              <Button
                type="primary"
                onClick={() => approvefunc("COMPLETED")}
                loading={approveLoader}
              >
                Approve
              </Button>
              <Button
                style={{ marginLeft: "8px" }}
                onClick={() => approvefunc("CANCELLED")}
                loading={approveLoader}
              >
                Reject
              </Button>
            </Form>
          </div>
        </Modal>
     
    </div>
  );
};

export default AllQueriesforAdmin;
