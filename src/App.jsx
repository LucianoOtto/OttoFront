import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import NotFound from "./pages/Error";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSections from "./pages/admin/AdminSections";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="productos" element={<AdminProducts />} />
          <Route path="categorias" element={<AdminCategories />} />
          <Route path="secciones" element={<AdminSections />} />
        </Route>
      </Routes>

      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}
