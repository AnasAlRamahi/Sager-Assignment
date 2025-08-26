interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <div className="layout-container">{children}</div>;
}

export default DashboardLayout;