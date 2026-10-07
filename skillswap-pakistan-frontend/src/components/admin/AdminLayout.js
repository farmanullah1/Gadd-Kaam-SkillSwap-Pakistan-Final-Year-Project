// src/components/admin/AdminLayout.js
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Gadd Kaam — Admin</h2>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" className={({isActive}) => isActive ? 'active' : ''} end>Overview</NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? 'active' : ''}>Manage Users</NavLink>
          <NavLink to="/admin/skills" className={({isActive}) => isActive ? 'active' : ''}>Manage Skills</NavLink>
          <NavLink to="/admin/reports" className={({isActive}) => isActive ? 'active' : ''}>Manage Reports</NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <button className="btn btn-logout" onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h3>Admin Console</h3>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-user">Signed in as: {JSON.parse(localStorage.getItem('user') || 'null')?.username || '—'}</span>
          </div>
        </header>

        <section className="admin-main">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
