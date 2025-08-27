import { DashboardLayout } from "@toolpad/core";
import { Outlet } from "react-router";
import ToolbarActions from "../components/ToolbarActions";

const Layout = () => {
  return (
    <DashboardLayout defaultSidebarCollapsed slots={{
      toolbarActions: ToolbarActions,
    }}>
      <Outlet />
    </DashboardLayout>
  );
}

export default Layout;