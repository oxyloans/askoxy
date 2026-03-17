import React from "react";
import { Modal, Button } from "antd";
import { LockOutlined, WarningOutlined } from "@ant-design/icons";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  deleteType: "soft" | "permanent" | null;
  onClose: () => void;
  onSelectType: (type: "soft" | "permanent") => void;
  onConfirmSoft: () => void;
  onConfirmPermanent: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  deleteType,
  onClose,
  onSelectType,
  onConfirmSoft,
  onConfirmPermanent,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      destroyOnClose
      maskClosable={false}
      className="delete-confirm-modal"
    >
      {!deleteType ? (
        <>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Delete Agent
          </h3>
          <p className="text-purple-700 mb-5">
            How would you like to delete this agent?
          </p>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => onSelectType("soft")}
              className="w-full p-4 border-2 border-amber-200 rounded-lg bg-amber-50 hover:bg-amber-100 transition text-left"
            >
              <div className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                <LockOutlined className="text-xl" />
                Soft Delete (Recommended)
              </div>
              <p className="text-sm text-amber-700">
                Removes agent from display but keeps all data safely stored. You can restore it later if needed.
              </p>
            </button>

            <button
              onClick={() => onSelectType("permanent")}
              className="w-full p-4 border-2 border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition text-left"
            >
              <div className="font-semibold text-red-900 mb-1 flex items-center gap-2">
                <WarningOutlined className="text-xl" />
                Permanent Delete
              </div>
              <p className="text-sm text-red-700">
                Completely removes agent and all its data permanently. This action cannot be undone.
              </p>
            </button>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Cancel
            </Button>
          </div>
        </>
      ) : deleteType === "soft" ? (
        <>
          <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <LockOutlined className="text-2xl" />
            Confirm Soft Delete
          </h3>
          <p className="text-amber-800 mb-4">
            Are you sure you want to soft delete this agent?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
            <p className="text-sm text-amber-900 font-medium mb-2">What happens:</p>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Agent will be hidden from your display</li>
              <li>All data remains safely stored</li>
              <li>You can restore this agent anytime</li>
              <li>No data will be lost</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button onClick={() => onSelectType(null as any)}>
              Back
            </Button>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={onConfirmSoft}
              style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}
            >
              Yes, Soft Delete
            </Button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
            <WarningOutlined className="text-2xl" />
            Confirm Permanent Delete
          </h3>
          <p className="text-red-800 mb-4 font-semibold">
            Are you absolutely sure you want to permanently delete this agent?
          </p>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-5">
            <p className="text-sm text-red-900 font-bold mb-2">
              <WarningOutlined /> WARNING - This action is irreversible:
            </p>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              <li>Agent will be completely removed permanently</li>
              <li>All conversations and history will be deleted</li>
              <li>All uploaded files will be removed</li>
              <li>This action CANNOT be undone</li>
              <li>You will NOT be able to restore this agent</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button onClick={() => onSelectType(null as any)}>
              Back
            </Button>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={onConfirmPermanent}
            >
              Yes, Delete Permanently
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DeleteConfirmModal;
