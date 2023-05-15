import React from 'react';

type DeleteModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onDeleteConfirm: () => void;
};

function DeleteModal({
  isOpen,
  onRequestClose,
  onDeleteConfirm,
}: DeleteModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onDeleteConfirm}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={onRequestClose}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
