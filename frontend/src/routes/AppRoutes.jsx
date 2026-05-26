import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Branches from "../pages/Branches/Branches";
import BranchDetails from "../pages/Branches/BranchDetails";
import Dashboard from "../pages/Dashboard/Dashboard";
import SavedNotes from "../pages/Dashboard/SavedNotes";
import Downloads from "../pages/Dashboard/Downloads";
import Profile from "../pages/Dashboard/Profile";
import SearchResults from "../pages/Resources/SearchResults";
import ResourceDetails from "../pages/Resources/ResourceDetails";
import ResourceList from "../pages/Resources/ResourceList";
import PdfViewer from "../pages/Viewer/PdfViewer";
import PYQAnalyzer from "../pages/AI/PYQAnalyzer";
import AIChat from "../pages/AI/AIChat";
import SummaryGenerator from "../pages/AI/SummaryGenerator";
import { ROUTES } from "../utils/constants";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.BRANCHES} element={<Branches />} />
          <Route
            path="/branches/:universitySlug/:branchSlug"
            element={<BranchDetails />}
          />
          <Route path={ROUTES.RESOURCES} element={<ResourceList />} />
          <Route path={ROUTES.SEARCH} element={<SearchResults />} />
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.RESOURCE_DETAILS} element={<ResourceDetails />} />
            <Route path={ROUTES.PDF_VIEWER} element={<PdfViewer />} />
          </Route>
        </Route>

        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.SAVED_NOTES} element={<SavedNotes />} />
            <Route path={ROUTES.DOWNLOADS} element={<Downloads />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.AI_SUMMARY} element={<SummaryGenerator />} />
            <Route path={ROUTES.AI_CHAT} element={<AIChat />} />
            <Route path={ROUTES.PYQ_ANALYZER} element={<PYQAnalyzer />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
