import React, { useState } from "react";
import {
  Modal,
  Upload,
  Button,
  message,
  UploadFile,
  Input,
  Popconfirm,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";

interface WalletUploadModalProps {
  walletModalVisible: boolean;
  handleCloseModal: () => void;
}

const WalletUploadModal: React.FC<WalletUploadModalProps> = ({
  walletModalVisible,
  handleCloseModal,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadAmount, setLoadAmount] = useState<number>(10);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Please upload a file before submitting.");
      return;
    }

    if (!loadAmount || loadAmount <= 0) {
      message.warning("Please enter a valid load amount.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", fileList[0] as any);

    try {
      await axios.post(
        `${BASE_URL}/order-service/walletLoadingMultipleUsers?loadAmount=${loadAmount}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Users loaded successfully!");
      setFileList([]);
      setLoadAmount(10);
      handleCloseModal();
    } catch (error) {
      console.error(error);
      message.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/order-service/removeOffers`);

      if (response.status === 200) {
        message.success("Wallet amounts removed successfully.");
      } else {
        message.error("Failed to remove wallet amounts.");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to remove wallet amounts.");
    }
  };

  const beforeUpload = (file: UploadFile) => {
    const isXLSX =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isXLSX) {
      message.error("Only .xlsx files are allowed.");
    }
    return isXLSX || Upload.LIST_IGNORE;
  };

  return (
    <Modal
      title="Bulk User Wallet Loading"
      open={walletModalVisible}
      onCancel={() => {
        setFileList([]);
        setLoadAmount(10);
        handleCloseModal();
      }}
      footer={[
        <div className="flex justify-between w-full" key="footer">
          {/* Left side buttons */}
          <Popconfirm
            title="Are you sure you want to remove wallet amount?"
            onConfirm={handleRemove}
            okText="Yes"
            cancelText="No"
          >
            <Button key="remove" danger icon={<DeleteOutlined />}>
              Remove
            </Button>
          </Popconfirm>

          {/* Right side buttons */}
          <div className="flex gap-2">
            <Button
              key="cancel"
              onClick={() => {
                setFileList([]);
                setLoadAmount(10);
                handleCloseModal();
              }}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleUpload}
            >
              Submit
            </Button>
          </div>
        </div>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Load Amount
          </label>
          <Input
            type="number"
            min={1}
            value={loadAmount}
            onChange={(e) => setLoadAmount(Number(e.target.value))}
            placeholder="Enter amount to load"
            className="w-full"
          />
        </div>

        <Upload
          beforeUpload={beforeUpload}
          onRemove={() => setFileList([])}
          customRequest={({ file, onSuccess }) => {
            setFileList([file as UploadFile]);
            onSuccess?.("ok");
          }}
          fileList={fileList}
          accept=".xlsx"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Click to Upload .xlsx</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default WalletUploadModal;
