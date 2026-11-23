import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Toast } from "../utils/toast";

export default function AdminUsers() {
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    fetch(`${process.env.REACT_APP_API_URL}/api/users?limit=1000`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `Error ${res.status}`);
        }
        const list = Array.isArray(data.data?.users)
          ? data.data.users
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];
        setUsers(list);
      })
      .catch((err) => {
        setErrorMsg(err.message || "Failed to load users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!res.ok) throw new Error("Failed to update role");

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );

      Toast.fire({
        icon: "success",
        title: `Role updated to ${newRole}`,
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Could not update user role",
      });
    }
  };

  const handleDeleteUser = (targetUser) => {
    Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${targetUser.firstName} ${targetUser.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/api/users/${targetUser._id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!res.ok) throw new Error("Failed to delete user");

          setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
          Swal.fire("Deleted!", "User account has been removed.", "success");
        } catch (error) {
          Swal.fire("Error!", "Could not delete user.", "error");
        }
      }
    });
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName || ""} ${u.lastName || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-danger-subtle text-danger";
      case "MANAGER":
        return "bg-warning-subtle text-warning-emphasis";
      default:
        return "bg-primary-subtle text-primary";
    }
  };

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="container py-5">
      {/* رأس الصفحة */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
            ADMIN PANEL
          </span>
          <h2 className="fw-bold mb-1">
            Users Management ({filteredUsers.length})
          </h2>
          <p className="text-muted mb-0">
            View registered accounts and manage user permissions
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* شريط البحث */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <input
            type="text"
            className="form-control rounded-pill px-4 bg-light border-0"
            placeholder="🔍 Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading users...</p>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-5 my-4 px-3">
              <h5 className="fw-bold text-danger mb-2">Failed to load users</h5>
              <p className="text-muted small mb-0">{errorMsg}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5 my-4">
              <h5 className="fw-bold text-muted">No users found</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 py-3">User</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Role</th>
                    <th className="pe-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isSelf = u._id === currentUser?.id;
                    return (
                      <tr key={u._id}>
                        {/* الصورة والاسم */}
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {u.avatar ? (
                              <img
                                src={`${process.env.REACT_APP_API_URL}/uploads/${u.avatar}`}
                                alt={u.firstName}
                                className="rounded-circle border"
                                style={{
                                  width: "44px",
                                  height: "44px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
                                style={{ width: "44px", height: "44px" }}
                              >
                                {u.firstName?.[0]?.toUpperCase() || "U"}
                              </div>
                            )}

                            <div>
                              <div className="fw-bold text-dark">
                                {u.firstName} {u.lastName}{" "}
                                {isSelf && (
                                  <span className="badge bg-secondary-subtle text-secondary ms-1">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* الإيميل */}
                        <td className="text-muted">{u.email}</td>

                        {/* تغيير الصلاحية */}
                        <td>
                          <select
                            className={`form-select form-select-sm d-inline-block w-auto fw-semibold rounded-pill border-0 px-3 ${getRoleBadge(
                              u.role,
                            )}`}
                            value={u.role}
                            disabled={isSelf || !isAdmin}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                          >
                            <option value="USER">USER</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>

                        {/* الحذف */}
                        <td className="pe-4 text-end">
                          {isAdmin ? (
                            <button
                              className="btn btn-sm btn-outline-danger px-3"
                              disabled={isSelf}
                              onClick={() => handleDeleteUser(u)}
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="badge bg-light text-muted border">
                              View Only
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
