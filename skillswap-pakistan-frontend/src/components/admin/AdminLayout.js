// src/components/admin/AdminLayout.js
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import { LayoutDashboard, Users, Briefcase, Flag, LogOut } from 'lucide-react';

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
          <h2>Gadd Kaam</h2>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" className={({isActive}) => isActive ? 'active' : ''} end>
             <LayoutDashboard size={22} /> <span>Overview</span>
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? 'active' : ''}>
             <Users size={22} /> <span>Manage Users</span>
          </NavLink>
          <NavLink to="/admin/skills" className={({isActive}) => isActive ? 'active' : ''}>
             <Briefcase size={22} /> <span>Manage Skills</span>
          </NavLink>
          <NavLink to="/admin/reports" className={({isActive}) => isActive ? 'active' : ''}>
             <Flag size={22} /> <span>Manage Reports</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={20} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h3>Admin Dashboard</h3>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-user-badge">
                <UserIcon size={16} />
                {JSON.parse(localStorage.getItem('user') || '{}')?.username || 'Admin'}
            </div>
          </div>
        </header>

        <section className="admin-main">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

// Simple User Icon component for the badge if not imported
const UserIcon = ({size}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default AdminLayout;