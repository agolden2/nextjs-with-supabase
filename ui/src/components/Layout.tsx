import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.js";
import { CompanyProvider } from "../context/CompanyContext.js";
import { LiveUpdatesProvider } from "../context/LiveUpdatesContext.js";

export default function Layout() {
  return (
    <CompanyProvider>
      <LiveUpdatesProvider>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            background: "var(--color-bg)",
          }}
        >
          <Sidebar />
          <main
            style={{
              flex: 1,
              overflow: "auto",
              minWidth: 0,
            }}
          >
            <Outlet />
          </main>
        </div>
      </LiveUpdatesProvider>
    </CompanyProvider>
  );
}
