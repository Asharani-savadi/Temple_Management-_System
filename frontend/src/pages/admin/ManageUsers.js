import React, { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import './AdminManage.css';

function ManageUsers() {
  const [users] = useState([]);
  // Note: User management would need a separate users table in Supabase
  // For now, this shows empty until you implement user registration

  return (
    <div className="admin-manage-page">
      <AdminNavbar />
      <div className="manage-page-header">
        <h1>Manage Users</h1>
      </div>

      <div className="manage-container">
        <div className="manage-actions">
          <input type="text" placeholder="Search users..." className="search-input" />
          <select className="filter-select">
            <option>All Users</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Bookings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.bookings}</td>
                  <td>
                    <span className={`status-badge ${user.status === 'Active' ? 'confirmed' : 'cancelled'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action btn-view">View</button>
                    <button className="btn-action btn-edit">
                      {user.status === 'Active' ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
