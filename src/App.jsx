import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate
} from "react-router-dom";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Forms from "./pages/admin/Forms";
import Staff from "./pages/admin/Staff";
import Reports from "./pages/admin/Reports";
import Assignment from "./pages/admin/Assignment";
import Reminders from "./pages/admin/Reminders";

import InstructorLayout from "./layout/InstructorLayout";
import DashboardInstructor from "./pages/instructor/Dashboard"
import FormsInstructor from "./pages/instructor/Forms"
import ProgressInstructor from "./pages/instructor/Progress"

import CoordinatorLayout from "./layout/CoordinatorLayout";
import DashboardCoordinator from "./pages/coordinator/Dashboard"
import MyInstructorsCoordinator from "./pages/coordinator/Instructors"
import ImprovementsCoordinator from "./pages/coordinator/Improvements"
import Logout from "./pages/auth/Logout";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";

import RequireRole from "./components/RequireRole";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />




        {/* Admin routes */}
        <Route path="/admin" element={
        <RequireRole role="admin">
          <AdminLayout />
        </RequireRole>}>
          <Route index element={<Dashboard />} />
          <Route path="forms" element={<Forms />} />
          {/* <Route path="staff" element={<Staff />} /> */}
          <Route path="assignment" element={<Assignment />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reminders" element={<Reminders />} />
        </Route>

        <Route path="/instructor" element={
          <RequireRole role="instructor">
           <InstructorLayout />
          </RequireRole>}>
          <Route index element={<DashboardInstructor />} />
          <Route path="forms" element={<FormsInstructor />} />
          <Route path="progress" element={<ProgressInstructor />} />
        </Route>

        <Route path="/coordinator" element={
          <RequireRole role="coordinator">
           <CoordinatorLayout />
          </RequireRole>}>
          <Route index element={<DashboardCoordinator />} />
          <Route path="my-instructors" element={<MyInstructorsCoordinator />} />
          <Route path="improvements" element={<ImprovementsCoordinator />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />


      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
