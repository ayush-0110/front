import React from 'react';
import Table from './components/table';
import DeleteModal from './components/deleteModal';
import './App.css';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClientProvider,
  QueryClient,
} from 'react-query';
import UserModal from './components/userModal';

type User = {
  id?: number;
  name: string;
  email: string;
  role: string;
};

const fetchUsers = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  // console.log(res);
  return res.json();
};

const createUser = async (user: User) => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {'Content-Type': 'application/json'},
  });

  if (!res.ok) {
    console.log('error');
    throw new Error('Error when creating user');
  }
  // console.log(res);
  return res.json();
};

const updateUser = async (user: User) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${user.id}`,
    {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {'Content-Type': 'application/json'},
    }
  );

  if (!res.ok) {
    console.log('error');
    throw new Error('Error when updating user');
  }
  // console.log(res);
  return res.json();
};

const deleteUser = async (userId: number) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    console.log('error');
    throw new Error('Error when deleting user');
  }
  // console.log(res);
  return res.json();
};
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersApp />
    </QueryClientProvider>
  );
}

function UsersApp() {
  const queryClient = useQueryClient();
  const {data: users} = useQuery('users', fetchUsers);

  const createMutation = useMutation(createUser, {
    onMutate: async newUser => {
      await queryClient.cancelQueries('users');

      const previousUsers = queryClient.getQueryData<User[]>('users');
      queryClient.setQueryData<User[]>('users', old => [
        ...(old || []),
        newUser,
      ]);
      return {previousUsers};
    },
    onError: (err, newUser, context) => {
      queryClient.setQueryData<User[]>('users', context?.previousUsers || []);
    },

    onSuccess: (data, newUser, context) => {
      queryClient.setQueryData<User[]>('users', old =>
        (old || []).map(user => (user.id === newUser.id ? newUser : user))
      );
    },
  });

  const updateMutation = useMutation(updateUser, {
    onMutate: async updatedUser => {
      await queryClient.cancelQueries('users');

      const previousUsers = queryClient.getQueryData<User[]>('users');

      queryClient.setQueryData<User[]>('users', old =>
        (old || []).map(user =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      return {previousUsers};
    },
    onError: (err, updatedUser, context) => {
      queryClient.setQueryData<User[]>('users', context?.previousUsers || []);
    },
    onSuccess: (data, updatedUser, context) => {
      queryClient.setQueryData<User[]>('users', old =>
        (old || []).map(user =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    },
  });

  const deleteMutation = useMutation(deleteUser, {
    onMutate: async deletedUserId => {
      await queryClient.cancelQueries('users');

      const previousUsers = queryClient.getQueryData<User[]>('users');

      queryClient.setQueryData<User[]>('users', old =>
        (old || []).filter(user => user.id !== deletedUserId)
      );
      return {previousUsers};
    },
    onError: (err, deletedUserId, context) => {
      queryClient.setQueryData<User[]>('users', context?.previousUsers || []);
    },
    onSuccess: (data, deletedUserId, context) => {
      console.log('deleted');
      queryClient.setQueryData<User[]>('users', old =>
        (old || []).filter(user => user.id !== deletedUserId)
      );
      setDeleteModalIsOpen(false);
    },
  });
  const [deleteModalIsOpen, setDeleteModalIsOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | undefined>(
    undefined
  );

  const openModal = (user?: User) => {
    setEditingUser(user);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setEditingUser(undefined);
    setModalIsOpen(false);
  };

  const onSubmit = (data: User) => {
    if (editingUser) {
      updateMutation.mutate({...data, id: editingUser.id});
    } else {
      createMutation.mutate(data);
    }
    closeModal();
  };

  const enrichedUsers =
    users?.map((user, index) => ({
      ...user,
      status: (index + 1) % 3 === 0 ? 'Inactive' : 'Active',
      lastLogin: new Date().toISOString(),
      role: user.role,
    })) || [];

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Last Login',
        accessor: 'lastLogin',
      },
    ],
    []
  );

  const handleDeleteUser = user => {
    if (user.id !== undefined) {
      setUserToDelete(user);
      setDeleteModalIsOpen(true);
    } else {
      console.error('Attempted to delete a user with no ID.');
    }
  };
  // const handleDeleteClick = (user: User) => {

  // };

  return (
    <div className="App flex flex-col items-center">
      <div className="w-full flex justify-between items-center bg-gray-200 p-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Users</h1>
          <span className="ml-2 bg-blue-500 text-white text-sm font-bold py-1 px-2 rounded-full">
            {enrichedUsers.length}
          </span>
        </div>
        <div>
          <button className="mr-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Download CSV
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => openModal()}
          >
            Create User
          </button>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <Table
          columns={columns}
          data={enrichedUsers}
          onDelete={handleDeleteUser}
          onEdit={user => openModal(user)}
        />
      </main>
      <UserModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onSubmit={onSubmit}
        user={editingUser}
      />
      {userToDelete !== undefined ? (
        <DeleteModal
          isOpen={deleteModalIsOpen}
          onRequestClose={() => setDeleteModalIsOpen(false)}
          onDeleteConfirm={() => {
            if (userToDelete && userToDelete.id !== undefined) {
              deleteMutation.mutate(userToDelete.id);
            }
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
