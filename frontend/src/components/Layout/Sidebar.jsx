import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, LogOut, FileText } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { path: "/profile", label: "Profile", icon: User },
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ];

    return (
        <div className="sidebar" style={{
            width: '250px',
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.4)', // More glass-like for light mode
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid var(--border-color)',
            padding: '2rem 1rem',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'var(--text-primary)'
        }}>
            <div>
                <div style={{ marginBottom: '3rem', paddingLeft: '1rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CampusIQ</h1>
                </div>

                <nav>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    marginBottom: '0.5rem',
                                    borderRadius: '0.5rem',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : 'var(--text-secondary)', // Active usually has colored bg so white text is fine
                                    background: isActive ? 'var(--primary)' : 'transparent',
                                    fontWeight: isActive ? 600 : 400,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <button
                onClick={logout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}
            >
                <LogOut size={20} />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
