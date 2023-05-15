import React from 'react';
import {useForm} from 'react-hook-form';
import Modal from 'react-modal';

Modal.setAppElement('#root');

type User = {
  id?: number;
  name: string;
  email: string;
  role: string;
};

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (data: User) => void;
  user?: User;
};

function UserModal({isOpen, onRequestClose, onSubmit, user}: Props) {
  const {register, handleSubmit, reset} = useForm<User>();
  React.useEffect(() => {
    reset(user);
  }, [user, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center mt-6 mx-auto w-11/12 lg:w-1/2"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">{user ? 'Edit' : 'Create'} User</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Role</span>
            <input
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {user ? 'Update' : 'Create'}
            </button>{' '}
            <button
              onClick={onRequestClose}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default UserModal;
