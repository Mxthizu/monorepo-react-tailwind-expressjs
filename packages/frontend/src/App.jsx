import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="h-screen w-screen">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Ajouter la route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          {/* Ajoute d'autres routes protégées de la même manière */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
