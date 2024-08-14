import AppSidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-grow p-6">
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Bienvenue sur le tableau de bord.</p>
        {/* Ajoute ici les éléments spécifiques au tableau de bord */}
      </div>
    </div>
  );
};

export default Dashboard;
