import React from "react";
import { Modal, Button, Spin } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

interface SessionModalProps {
  visible: boolean;
  loading: boolean;
  onContinue: () => void;
  onLogout: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  visible,
  loading,
  onContinue,
  onLogout,
}) => {
  return (
    <Modal
      open={visible}
      closable={false}
      maskClosable={false}
      footer={null}
      centered
      width={400}
    >
      <div className="flex flex-col items-center text-center py-4 gap-4">
        <ClockCircleOutlined className="text-5xl text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Session Expired</h2>
        <p className="text-gray-500">
          You've been away for a while. Do you want to continue your session or
          log out?
        </p>
        <div className="flex gap-4 w-full justify-center mt-2">
          <Button
            type="primary"
            className="bg-purple-600 hover:bg-purple-700 border-0 h-10 px-6"
            onClick={onContinue}
            disabled={loading}
          >
            {loading ? <Spin size="small" /> : "Continue Session"}
          </Button>
          <Button
            danger
            className="h-10 px-6"
            onClick={onLogout}
            disabled={loading}
          >
            Logout
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionModal;