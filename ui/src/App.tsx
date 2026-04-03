import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.js";
import Dashboard from "./pages/Dashboard.js";
import Issues from "./pages/Issues.js";
import IssueDetail from "./pages/IssueDetail.js";
import Agents from "./pages/Agents.js";
import AgentDetail from "./pages/AgentDetail.js";
import OrgChart from "./pages/OrgChart.js";
import Projects from "./pages/Projects.js";
import Goals from "./pages/Goals.js";
import Approvals from "./pages/Approvals.js";
import Costs from "./pages/Costs.js";
import Activity from "./pages/Activity.js";
import Settings from "./pages/Settings.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/issues" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="issues" element={<Issues />} />
        <Route path="issues/:id" element={<IssueDetail />} />
        <Route path="agents" element={<Agents />} />
        <Route path="agents/:id" element={<AgentDetail />} />
        <Route path="org" element={<OrgChart />} />
        <Route path="projects" element={<Projects />} />
        <Route path="goals" element={<Goals />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="costs" element={<Costs />} />
        <Route path="activity" element={<Activity />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
