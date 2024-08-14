import AppSidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { TextInput, Button, Label, Toast, Modal } from "flowbite-react";
import { HiTrash, HiCheck, HiExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corriger l'import de jwtDecode
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Ajout du champ email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [showToast, setShowToast] = useState(false); // Gérer l'état du toast
  const [toastMessage, setToastMessage] = useState(""); // Gérer l'état du toast
  const [toastType, setToastType] = useState("success"); // Gérer le type de toast
  const [showModal, setShowModal] = useState(false); // Gérer l'état du modal
  const [deletePassword, setDeletePassword] = useState(""); // Pour stocker le mot de passe pour la suppression
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);

      // Récupérer les informations utilisateur depuis le backend
      fetch(`${backendUrl}/api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsername(data.username || "");
          setEmail(data.email || ""); // Mettre à jour le champ email
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setToastMessage("Passwords do not match");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Supposons que tu envoies une requête pour mettre à jour les informations utilisateur
    const response = await fetch(`${backendUrl}/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        id: userId,
        username: username,
        email: email, // Inclure l'email dans la requête
        password: password,
      }),
    });

    if (response.ok) {
      setToastMessage("User updated successfully!");
      setToastType("success");
      setShowToast(true);
    } else {
      setToastMessage("Failed to update user");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleDeleteUser = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${backendUrl}/api/auth/validate-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: deletePassword,
      }),
    });

    if (!response.ok) {
      setToastMessage("Invalid password. Cannot delete user.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const deleteResponse = await fetch(`${backendUrl}/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (deleteResponse.ok) {
      localStorage.removeItem("token");
      navigate("/register");
    } else {
      setToastMessage("Failed to delete user");
      setToastType("error");
      setShowToast(true);
    }
  };

  const openDeleteModal = () => setShowModal(true);
  const closeDeleteModal = () => setShowModal(false);

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-grow p-6">
        <h1 className="mb-4 text-3xl font-bold">Settings</h1>

        <div className="rounded-lg border-2 border-solid border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-semibold">Update user</h2>

          <form onSubmit={handleUpdateUser}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="username" value="Username" />
                <TextInput
                  id="username"
                  type="text"
                  placeholder={username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  placeholder={email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" value="Confirm password" />
                <TextInput
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Update user
              </Button>
            </div>
          </form>
        </div>

        {/* Section pour supprimer le compte */}
        <div className="mt-10 rounded-lg border-2 border-solid border-red-200 p-6">
          <h2 className="mb-4 text-xl font-semibold text-red-600">
            Delete Account
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            color="failure"
            onClick={openDeleteModal}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <HiTrash className="mr-1 h-5 w-5" />
            Delete Account
          </Button>
        </div>

        {/* Modal de confirmation de suppression */}
        {showModal && (
          <Modal
            show={showModal}
            size="md"
            popup={true}
            onClose={closeDeleteModal}
            className="bg-gray-900/80"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </h3>
                <div className="mb-5">
                  <Label
                    htmlFor="delete-password"
                    value="Enter your password"
                  />
                  <TextInput
                    id="delete-password"
                    type="password"
                    placeholder="••••••••"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDeleteUser}
                  >
                    Yes, I&apos;m sure
                  </Button>
                  <Button
                    color="gray"
                    className="border-solid-2 border-gray-400 hover:bg-gray-400 hover:text-white"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-4 right-4">
            <Toast>
              <div
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  toastType === "success"
                    ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
                    : "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
                }`}
              >
                {toastType === "success" ? (
                  <HiCheck className="h-5 w-5" />
                ) : (
                  <HiExclamationCircle className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3 text-sm font-normal">{toastMessage}</div>
              <Button
                size="xs"
                color="transparent"
                onClick={() => setShowToast(false)}
                aria-label="Close"
              >
                <HiExclamationCircle className="h-5 w-5" />
              </Button>
            </Toast>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
