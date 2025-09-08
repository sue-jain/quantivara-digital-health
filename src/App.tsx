
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Technology from "./pages/Technology";
import Solutions from "./pages/Solutions";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DocumentProcessorPage from "./pages/DocumentProcessorPage";
import PatientUploadPage from "./pages/PatientUploadPage";
import ABHALookup from "./pages/ABHALookup";
import PatientLookup from "./pages/PatientLookup";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import DemoHub from "./pages/DemoHub";
import VoicePatientLookupDemo from "./pages/VoicePatientLookupDemo";
import TestAuth from "./pages/TestAuth";
import SimpleTest from "./pages/SimpleTest";
import LoginTest from "./pages/LoginTest";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import PatientProfile from "./pages/PatientProfile";
import DoctorHome from "./pages/DoctorHome";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfilePage from "./pages/DoctorProfile";
import DoctorPatients from "./pages/DoctorPatients";
import LoginSelection from "./pages/LoginSelection";
import RequireRole from "@/components/auth/RequireRole";
import PatientShell from "@/components/layout/PatientShell";
import PatientCareTeamPage from "./pages/PatientCareTeamPage";
import PatientHome from "./pages/PatientHome";
import PatientDocumentsPage from "./pages/PatientDocumentsPage";
import PatientLabTestsPage from "./pages/PatientLabTestsPage";
import PatientVisitsPage from "./pages/PatientVisitsPage";
import LabDashboard from "./pages/LabDashboard";
import DoctorShell from "@/components/layout/DoctorShell";
import LabShell from "@/components/layout/LabShell";
import LabPatients from "./pages/LabPatients";
import InviteOnboarding from "./pages/InviteOnboarding";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/processor" element={<PatientUploadPage />} />
              <Route path="/demo" element={<DemoHub />} />
              <Route path="/demo/abha-lookup" element={<ABHALookup />} />
              <Route path="/demo/patient-lookup" element={<PatientLookup />} />
              <Route path="/demo/analytics" element={<AnalyticsDashboard />} />
              <Route path="/lab" element={<LabShell />}>
                <Route index element={<LabDashboard />} />
                <Route path="patients" element={<LabPatients />} />
              </Route>
              <Route path="/demo/voice-lookup" element={<VoicePatientLookupDemo />} />
              <Route path="/test-auth" element={<TestAuth />} />
              <Route path="/simple-test" element={<SimpleTest />} />
              <Route path="/login-test" element={<LoginTest />} />
              <Route path="/login" element={<LoginSelection />} />
              <Route path="/invite" element={<InviteOnboarding />} />
              <Route path="/invite/:code" element={<InviteOnboarding />} />
              <Route path="/user" element={<RequireRole role="patient"><PatientShell /></RequireRole>}>
                <Route index element={<PatientHome />} />
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="documents" element={<PatientDocumentsPage />} />
                <Route path="lab-tests" element={<PatientLabTestsPage />} />
                <Route path="visits" element={<PatientVisitsPage />} />
                <Route path="care-team" element={<PatientCareTeamPage />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="settings" element={<PatientProfile />} />
              </Route>
              <Route path="/doctor" element={<RequireRole role="doctor"><DoctorShell /></RequireRole>}>
                <Route index element={<DoctorHome />} />
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="patients" element={<DoctorPatients />} />
                <Route path="patient-lookup" element={<DoctorPatients />} />
                <Route path="profile" element={<DoctorProfilePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
