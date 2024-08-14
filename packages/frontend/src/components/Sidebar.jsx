import { Link } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiHome, HiCog, HiLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const AppSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    // Supprime le token JWT du localStorage
    localStorage.removeItem("token");

    // Redirige vers la page de connexion
    navigate("/login");
  };

  return (
    <div className="flex">
      <Sidebar className="fixed left-0 top-0 h-full w-64 shadow-md">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item as={Link} to="/dashboard" icon={HiHome}>
              Dashboard
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
      <div className="ml-64 w-full">{/* Main content will go here */}</div>
    </div>
  );
};

export default AppSidebar;
