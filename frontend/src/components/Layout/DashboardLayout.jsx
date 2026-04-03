import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{
                flex: 1,
                marginLeft: '250px',
                minHeight: '100vh',
                position: 'relative'
            }}>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
