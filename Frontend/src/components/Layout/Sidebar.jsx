import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DEMO_MODE } from "../../data/mockData";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [nlOpen, setNlOpen] = useState(true);
  const [blOpen, setBlOpen] = useState(true);

  const NAV = [
    { label: "Dashboard", icon: "⊞", path: "/dashboard" },
    { label: "All Cases", icon: "📁", path: "/cases" },
    {
      label: "Non-Litigation",
      icon: "🏛️",
      path: null,
      children: [
        {
          label: "Business Legal",
          icon: "📂",
          path: null,
          isGroup: true,
          children: [
            {
              label: "TSR Initiation",
              path: "/non-litigation/business-legal/tsr-initiation",
              icon: "📋",
            },
            {
              label: "TSR Drafting",
              path: "/non-litigation/business-legal/tsr-drafting",
              icon: "✍️",
            },
          ],
        },
      ],
    },

  ];

  const logout = () => {
    if (DEMO_MODE) {
      alert("🔒 Login/logout disabled in Demo Mode.");
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        width: collapsed ? 70 : 270,
        background: "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        overflow: "hidden",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 30px rgba(0,0,0,0.6)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 1,
              }}
            >
              NLK
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 10,
                letterSpacing: 3,
                marginTop: 2,
              }}
            >
              ASSOCIATES
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "none",
            color: "#fff",
            width: 32,
            height: 32,
            borderRadius: 8,
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "14px 10px",
          overflowY: "auto",
        }}
      >
        {NAV.map((item) => {
          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setNlOpen(!nlOpen)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "space-between",
                    padding: "14px 14px",
                    color: "#bdbdbd",
                    fontSize: 13,
                    borderRadius: 12,
                    marginBottom: 6,
                    transition: "0.25s ease",
                  }}
                >
                  {!collapsed && (
                    <>
                      <span
                        style={{
                          fontWeight: 500,
                          letterSpacing: 0.4,
                        }}
                      >
                        {item.label}
                      </span>

                      <span>{nlOpen ? "−" : "+"}</span>
                    </>
                  )}
                </button>

                {nlOpen &&
                  !collapsed &&
                  item.children.map((child) => {
                    if (child.isGroup) {
                      return (
                        <div key={child.label}>
                          <button
                            onClick={() => setBlOpen(!blOpen)}
                            style={{
                              width: "100%",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.04)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              padding: "12px 16px",
                              borderRadius: 12,
                              color: "#d1d1d1",
                              fontSize: 12,
                              marginBottom: 6,
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                textAlign: "left",
                                fontWeight: 600,
                                letterSpacing: 0.5,
                              }}
                            >
                              {child.label}
                            </span>

                            <span>{blOpen ? "−" : "+"}</span>
                          </button>

                          {blOpen &&
                            child.children.map((sub) => (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "12px 16px",
                                  marginBottom: 6,
                                  marginLeft: 12,
                                  borderRadius: 12,
                                  color: isActive(sub.path)
                                    ? "#fff"
                                    : "rgba(255,255,255,0.55)",
                                  textDecoration: "none",
                                  fontSize: 12,
                                  background: isActive(sub.path)
                                    ? "rgba(255,255,255,0.08)"
                                    : "transparent",
                                  border: isActive(sub.path)
                                    ? "1px solid rgba(255,255,255,0.08)"
                                    : "1px solid transparent",
                                  transition: "0.25s ease",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                {sub.label}
                              </Link>
                            ))}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 16px",
                          marginBottom: 6,
                          borderRadius: 12,
                          color: isActive(child.path)
                            ? "#fff"
                            : "rgba(255,255,255,0.55)",
                          textDecoration: "none",
                          fontSize: 13,
                          background: isActive(child.path)
                            ? "rgba(255,255,255,0.08)"
                            : "transparent",
                          transition: "0.25s ease",
                        }}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: "14px 16px",
                marginBottom: 8,
                borderRadius: 14,
                color: isActive(item.path) ? "#fff" : "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                background: isActive(item.path)
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
                border: isActive(item.path)
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid transparent",
                transition: "all 0.25s ease",
                backdropFilter: "blur(12px)",
              }}
            >
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {!collapsed && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {role || "staff"}
          </div>
        )}

        <button
          onClick={logout}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
            padding: "12px",
            borderRadius: 12,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            transition: "0.25s ease",
          }}
        >
          {collapsed ? "⤴" : "Logout"}
        </button>
      </div>
    </div>
  );
}
