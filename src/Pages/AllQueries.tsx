import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Modal } from "antd";
import Sider from "./Sider";

const { Content } = Layout;

interface Query {
  id: string;
  userId: string;
  query: string;
  queryStatus: string;
  email: string;
  mobileNumber: string;
  comments: string;
  resolvedBy: string | null;
  resolvedOn: string | null;
  createdAt: string;
  randomTicketId: string;
  name: string;
  projectType: string;
  askOxyOfers: string | null;
  queryCount: number;
}

const AllQueries: React.FC = () => {
  const [queryStatus, setQueryStatus] = useState<string>();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken"); // Get access token from localStorage

      if (!accessToken) {
        console.error("Access token is missing");
        return;
      }

      const requestPayload = {
        askOxyOfers: "FREEAI",
        projectType: "ASKOXY",
        queryStatus: queryStatus,
      };

      const response = await axios.post(
        "https://meta.oxyloans.com/api/write-to-us/student/getAllQueries",
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass access token in the Authorization header
          },
        }
      );
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [queryStatus]);

  const handlePendingClick = (query: Query) => {
    setSelectedQuery(query);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedQuery(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sider />
      <div className="flex-1">
        <Content className="p-12">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Query Management
          </h1>

          <div className="mb-4 max-w-md mx-auto">
            <label
              htmlFor="queryStatus"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Query Status:
            </label>
            <select
              id="queryStatus"
              value={queryStatus}
              onChange={(e) => setQueryStatus(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center text-blue-500">Loading...</div>
          ) : queries.length > 0 ? (
            <div className="overflow-x-auto w-full flex justify-center">
              <div className="w-full max-w-8xl px-4">
                {" "}
                {/* Adjusted max-width to 8xl */}
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border">
                        SL.NO
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border">
                        UserInfo
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border">
                        UserQuery
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border">
                        Admin & User Replies
                      </th>
                      {/* <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border">Upload file</th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {queries.map((query, index) => (
                      <tr key={query.id}>
                        <td className="px-4 py-2 text-sm text-gray-700 border">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 border">
                          <div>
                            <strong>Name:</strong> {query.name}
                          </div>
                          <div>
                            <strong>Email:</strong> {query.email}
                          </div>
                          <div>
                            <strong>Mobile Number:</strong> {query.mobileNumber}
                          </div>
                          <div>
                            <strong>Ticket Id:</strong> {query.randomTicketId}
                          </div>
                          <div>
                            <strong>Created At:</strong> {query.createdAt}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 border">
                          {query.query}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 border"></td>
                        {/* <td className="px-4 py-2 text-sm text-gray-700 border">
                        <Button onClick={() => handlePendingClick(query)} type="primary">
                          Pending
                        </Button>
                      </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No queries found.</div>
          )}
        </Content>
      </div>

      <Modal
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600} // Adjust modal width if needed
      >
        {selectedQuery && (
          <div>
            <h3 className="text-lg font-bold mb-4">Review the Document</h3>

            {/* Upload Document */}
            <div className="flex items-center mb-4">
              <label
                htmlFor="upload"
                className="mr-2 text-sm font-semibold text-gray-700"
              >
                Upload Document:
              </label>
              <input
                id="upload"
                type="file"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Query and Comments */}
            <div className="mb-4">
              <div>
                <strong>Comments:</strong>
                <textarea
                  className="mt-2 w-full max-w-full h-40 border border-gray-300 p-2"
                  placeholder="Add your comments here"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <Button type="default" onClick={handleModalClose}>
                Close
              </Button>
              <div className="flex space-x-2">
                <Button
                  type="primary"
                  onClick={() => console.log("Mark as Pending")}
                >
                  Mark as Pending
                </Button>
                <Button
                  type="primary"
                  style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }} // Blue color for Approve button
                  onClick={() => console.log("Approve")}
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllQueries;
