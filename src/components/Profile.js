import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { logout, updateUserProfile } from "../rtk/slices/auth-slice";
import { Toast } from "../utils/toast";

export default function Profile() {
  const { token, user, loading } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!token) return <Navigate to="/login" replace />;

  const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      Toast.fire({ icon: "success", title: "Profile updated successfully!" });
      setIsEditing(false);
      setAvatarFile(null);
    } catch (err) {
      Toast.fire({ icon: "error", title: err || "Update failed" });
    }
  };

  const currentAvatarUrl =
    preview ||
    (user?.avatar
      ? `${process.env.REACT_APP_API_URL}/uploads/${user.avatar}`
      : null);

  const initialLetter =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            {/* الغلاف العلوي */}
            <div
              style={{
                height: "110px",
                background: "linear-gradient(135deg, #0d6efd 0%, #3b82f6 100%)",
              }}
            ></div>

            <div
              className="card-body p-4 text-center position-relative"
              style={{ marginTop: "-55px", zIndex: 2 }}
            >
              {/* الصورة الشخصية */}
              {currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt={user?.firstName}
                  className="rounded-circle border border-4 border-white shadow bg-white object-fit-cover mb-3"
                  style={{ width: "105px", height: "105px" }}
                />
              ) : (
                <div
                  className="rounded-circle border border-4 border-white shadow bg-primary text-white d-inline-flex align-items-center justify-content-center fs-1 fw-bold mb-3"
                  style={{ width: "105px", height: "105px" }}
                >
                  {initialLetter}
                </div>
              )}

              {!isEditing ? (
                <>
                  <h4 className="fw-bold mb-1">
                    {user?.firstName} {user?.lastName}
                  </h4>
                  <p className="text-muted small mb-2">{user?.email}</p>

                  <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-semibold">
                      {user?.role || "USER"}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-0"
                      onClick={() => {
                        setFirstName(user?.firstName || "");
                        setLastName(user?.lastName || "");
                        setPreview(null);
                        setIsEditing(true);
                      }}
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>

                  {/* روابط سريعة */}
                  <div className="row g-2 text-start mb-4">
                    <div className="col-6">
                      <Link
                        to="/my-orders"
                        className="btn btn-light border w-100 rounded-3 py-2 fw-semibold small"
                      >
                        📦 My Orders
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link
                        to="/wishlist"
                        className="btn btn-light border w-100 rounded-3 py-2 fw-semibold small"
                      >
                        ❤️ Wishlist ({wishlist.length})
                      </Link>
                    </div>
                    {isAdminOrManager && (
                      <div className="col-12">
                        <Link
                          to="/admin"
                          className="btn btn-outline-primary w-100 rounded-3 py-2 fw-semibold small"
                        >
                          🎛️ Go to Admin Dashboard
                        </Link>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-outline-danger rounded-pill px-4 fw-semibold btn-sm"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </button>
                </>
              ) : (
                /* فورم تعديل البيانات */
                <form onSubmit={handleSave} className="text-start mt-2">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">
                      Change Avatar
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill fw-semibold flex-grow-1"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => {
                        setIsEditing(false);
                        setPreview(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
