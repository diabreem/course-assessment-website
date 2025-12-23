import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Sidebar from "./components/admin/Sidebar";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Forms from "./pages/admin/Forms";
import Staff from "./pages/admin/Staff";
import Reports from "./pages/admin/Reports";
import Reminders from "./pages/admin/Reminders";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AdminLayout/>}>
        <Route index element={<Dashboard />} />
        <Route path = "/forms" element={<Forms/>}/>
        <Route path = "/staff" element={<Staff/>}/>
        <Route path = "/reports" element={<Reports/>}/>
        <Route path = "/reminders" element={<Reminders/>}/>

        

      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
