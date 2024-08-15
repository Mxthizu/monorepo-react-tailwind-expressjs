import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Toast } from "flowbite-react";
import { HiCheck, HiExclamation } from "react-icons/hi";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success or error
  const { token } = useParams(); // Récupère le token de l'URL
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      // Si aucun token n'est fourni, rediriger vers la page de connexion
      navigate("/login");
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToastType("error");
      setToastMessage("Passwords do not match");
      setShowToast(true);
      return;
    }

    const response = await fetch(
      `${backendUrl}/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      },
    );

    if (response.ok) {
      setToastType("success");
      setToastMessage("Password reset successfully");
      setShowToast(true);
      navigate("/login");
    } else {
      setToastType("error");
      setToastMessage("Failed to reset password");
      setShowToast(true);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white p-6 shadow sm:max-w-md sm:p-8 md:mt-0 dark:border dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Change Password
          </h2>
          <form
            className="mt-4 space-y-4 md:space-y-5 lg:mt-5"
            onSubmit={handleResetPassword}
          >
            <div>
              <Label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </Label>
              <TextInput
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </Label>
              <TextInput
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                required={true}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" color="blue" className="w-full">
              Reset password
            </Button>
          </form>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4">
          <Toast
            onClose={() => setShowToast(false)}
            className={`${
              toastType === "success"
                ? "bg-green-100 text-green-500"
                : "bg-red-100 text-red-500"
            }`}
          >
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              {toastType === "success" ? (
                <HiCheck className="h-5 w-5" />
              ) : (
                <HiExclamation className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">{toastMessage}</div>
          </Toast>
        </div>
      )}
    </section>
  );
};

export default ResetPassword;
