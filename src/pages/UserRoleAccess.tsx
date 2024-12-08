// src/pages/UserRoleAccess.tsx  
import React, { useEffect, useState } from 'react';  
import { toast } from 'react-toastify';  
import * as api from '../api';  

export const UserRoleAccess: React.FC = () => {  
  const [users, setUsers] = useState([]);  
  const [selectedUser, setSelectedUser] = useState<any>(null);  
  const [showModal, setShowModal] = useState(false);  
  const [newRole, setNewRole] = useState<string>('');  

  useEffect(() => {  
    fetchUsers();  
  }, []);  

  const fetchUsers = async () => {  
    try {  
      const response = await api.getAllUsers();  
      setUsers(response.data);  
    } catch (error) {  
      toast.error('Failed to fetch users');  
    }  
  };  

  const handleUpdateRole = async () => {  
    if (!newRole) {  
      toast.error('Please select a role');  
      return;  
    }  

    try {  
      await api.updateUserRoles(selectedUser.id, [newRole]);  
      toast.success('User role updated successfully');  
      fetchUsers();  
      setShowModal(false);  
    } catch (error) {  
      toast.error('Failed to update user role');  
    }  
  };  

  return (  
    <div className="max-w-7xl mx-auto px-4 py-8">  
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Role Access</h1>  
      <table className="min-w-full bg-white">  
        <thead>  
          <tr>  
            <th className="py-2 px-4">Username</th>  
            <th className="py-2 px-4">Email</th>  
            <th className="py-2 px-4">Roles</th>  
            <th className="py-2 px-4">Actions</th>  
          </tr>  
        </thead>  
        <tbody>  
          {users.map((user: any) => (  
            <tr key={user.id}>  
              <td className="py-2 px-4">{user.username}</td>  
              <td className="py-2 px-4">{user.email}</td>  
              <td className="py-2 px-4">{user.roles.join(', ')}</td>  
              <td className="py-2 px-4">  
                <button  
                  onClick={() => {  
                    setSelectedUser(user);  
                    setNewRole(user.roles[0]); // Default to the first role  
                    setShowModal(true);  
                  }}  
                  className="bg-blue-500 text-white px-4 py-2 rounded"  
                >  
                  Edit Role  
                </button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  

      {showModal && selectedUser && (  
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">  
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">  
            <h2 className="text-xl font-bold mb-4">Edit Role for {selectedUser.username}</h2>  
            <div className="space-y-4">  
              {['super_admin', 'admin', 'logistics', 'challan', 'installation', 'invoice'].map((role) => (  
                <div key={role} className="flex items-center">  
                  <input  
                    type="radio"  
                    id={role}  
                    name="role"  
                    value={role}  
                    checked={newRole === role}  
                    onChange={() => setNewRole(role)}  
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"  
                  />  
                  <label htmlFor={role} className="ml-2 text-sm text-gray-700">  
                    {role}  
                  </label>  
                </div>  
              ))}  
            </div>  
            <div className="mt-6 flex justify-end">  
              <button  
                onClick={() => setShowModal(false)}  
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"  
              >  
                Cancel  
              </button>  
              <button  
                onClick={handleUpdateRole}  
                className="bg-blue-500 text-white px-4 py-2 rounded"  
              >  
                Save  
              </button>  
            </div>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
};  