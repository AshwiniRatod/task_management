import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ search, setSearch, notifications, setNotifications }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Mark notification as read
  const handleNotificationClick = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="app-header">
      {/* Logo */}
      <div className="logo">
        <span>TaskTab</span>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="header-search"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Actions */}
      <div className="header-actions" ref={dropdownRef}>
        {/* Notification Bell */}
        <div
          className="notification-bell"
          onClick={() => setShowNotifications((p) => !p)}
        >
          🔔
          {notifications.length > 0 && (
            <span className="badge">{notifications.length}</span>
          )}
        </div>

        {/* Logout Button */}
        <button className="logout-btn" onClick={logout}>
          ⎋ Logout
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="notification-dropdown">
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="notification-item"
                  onClick={() => handleNotificationClick(n.id)}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{n.title}</strong>
                  <span>{new Date(n.dueDate).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
