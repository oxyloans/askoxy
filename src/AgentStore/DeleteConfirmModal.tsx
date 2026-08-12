import React from "react";
import { Modal, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      destroyOnClose
      maskClosable={false}
      className="delete-confirm-modal"
    >
      <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center gap-2">
        <LockOutlined className="text-2xl" />
        Delete Agent
      </h3>
      <p className="text-gray-700 mb-2">
        Are you sure you want to delete this agent?
      </p>
      <p className="text-sm text-amber-700 mb-6">
        This agent will be removed from your list, but its data stays safely
        stored and can be restored later.
      </p>

      <div className="flex justify-end gap-3">
        <Button onClick={onClose}>No</Button>
        <Button
          type="primary"
          onClick={onConfirmDelete}
          style={{ backgroundColor: "#f59e0b", borderColor: "#f59e0b" }}
        >
          Yes, Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
