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
import Reminders from "./pages/admin/Reminders";

import InstructorLayout from "./layout/InstructorLayout";
import DashboardInstructor from "./pages/instructor/Dashboard"
import FormsInstructor from "./pages/instructor/Forms"
import ProgressInstructor from "./pages/instructor/Progress"

import CoordinatorLayout from "./layout/CoordinatorLayout";
import DashboardCoordinator from "./pages/coordinator/Dashboard"
import MyInstructorsCoordinator from "./pages/coordinator/Instructors"
import ImprovementsCoordinator from "./pages/coordinator/Improvements"



function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Navigate to="/admin" />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="forms" element={<Forms />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reminders" element={<Reminders />} />
        </Route>

        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<DashboardInstructor/>} />
          <Route path="forms" element={<FormsInstructor />} />
          <Route path="progress" element={<ProgressInstructor />} />
        </Route>

        <Route path="/coordinator" element={<CoordinatorLayout />}>
          <Route index element={<DashboardCoordinator/>} />
          <Route path="my-instructors" element={<MyInstructorsCoordinator />} />
          <Route path="improvements" element={<ImprovementsCoordinator />} />
        </Route>
        
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
