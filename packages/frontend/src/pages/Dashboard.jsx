import { Sidebar } from "flowbite-react";
import { HiHome, HiUser, HiCog, HiLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    // Supprime le token JWT du localStorage
    localStorage.removeItem("token");

    // Redirige vers la page de connexion
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar className="h-full w-64 bg-white shadow-md">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item as={Link} to="/dashboard" icon={HiHome}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/profile" icon={HiUser}>
              Profile
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/settings" icon={HiCog}>
              Settings
            </Sidebar.Item>
            <Sidebar.Item
              as={Link}
              to="#"
              icon={HiLogout}
              onClick={handleLogout}
            >
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Welcome to your dashboard. This is where you can see an overview of
          your application.
        </p>
        {/* Ajoutez ici le contenu spécifique à votre dashboard */}
      </div>
    </div>
  );
};

export default Dashboard;
