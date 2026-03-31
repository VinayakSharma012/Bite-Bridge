import React, { useEffect, useMemo, useState } from 'react';
import { Download, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/pages/admin/AdminUsers.css';

const roleMap = {
  USER: 'user',
  RESTAURANT_OWNER: 'owner',
  DELIVERY_PARTNER: 'delivery',
  ADMIN: 'admin',
};

function initials(name) {
  return String(name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join('');
}

function ManageUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data || []);
      } catch {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      load();
    }
  }, [navigate, user]);

  const filtered = useMemo(
    () =>
      users.filter((item) => {
        const value = search.trim().toLowerCase();
        if (!value) return true;
        return (
          String(item.name || '').toLowerCase().includes(value) ||
          String(item.email || '').toLowerCase().includes(value) ||
          String(item.phone || '').toLowerCase().includes(value)
        );
      }),
    [search, users]
  );

  const allVisibleSelected = filtered.length > 0 && filtered.every((item) => selectedIds.includes(item.id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.some((item) => item.id === id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...filtered.map((item) => item.id)])));
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const updateRole = async (id, role) => {
    try {
      await userService.updateUserRole(id, role);
      setUsers((prev) => prev.map((item) => (item.id === id ? { ...item, role } : item)));
    } catch {
      setError('Failed to update role.');
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedIds.map((id) => userService.deleteUser(id)));
      setUsers((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    } catch {
      setError('Failed to delete selected users.');
    }
  };

  const deleteOne = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch {
      setError('Failed to delete user.');
    }
  };

  const exportCsv = () => {
    const header = ['Name', 'Email', 'Phone', 'Role'];
    const rows = filtered.map((item) => [item.name, item.email, item.phone, item.role]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell || '')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bitebridge-users.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <AdminLayout
      title="Manage Users"
      subtitle="Control roles, monitor users and perform bulk actions."
      headerAction={
        <button type="button" className="export-gradient-outline" onClick={exportCsv}>
          <Download size={16} /> Export CSV
        </button>
      }
    >
      {error && <div className="admin-alert-error">{error}</div>}

      {selectedIds.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedIds.length} selected</span>
          <button type="button" className="danger" onClick={deleteSelected}>Delete selected</button>
          <button type="button" onClick={() => setSelectedIds([])}>Clear</button>
        </div>
      )}

      <section className="users-toolbar">
        <label className="field-with-icon">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone" />
        </label>
      </section>

      <section className="users-table-card">
        {loading ? (
          <div className="admin-loading-card">Loading users...</div>
        ) : (
          <div className="users-table-wrap">
            <table className="users-admin-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} />
                  </th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-state">No users found.</td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>
                      <td>
                        <div className="user-cell">
                          <span className="avatar-initials">{initials(item.name)}</span>
                          <span>{item.name || 'Unknown User'}</span>
                        </div>
                      </td>
                      <td>{item.email || '—'}</td>
                      <td>{item.phone || '—'}</td>
                      <td>
                        <div className="role-cell">
                          <span className={`role-badge role-${roleMap[item.role] || 'user'}`}>
                            {String(item.role || 'USER').replace(/_/g, ' ')}
                          </span>
                          <select value={item.role} onChange={(e) => updateRole(item.id, e.target.value)}>
                            <option value="USER">USER</option>
                            <option value="RESTAURANT_OWNER">OWNER</option>
                            <option value="DELIVERY_PARTNER">DELIVERY</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <button type="button" className="icon-action danger" onClick={() => deleteOne(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default ManageUsers;
