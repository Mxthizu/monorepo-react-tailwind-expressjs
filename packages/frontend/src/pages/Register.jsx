import { useState } from "react";
import { Label, TextInput, Button, Card, Toast } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiCheck, HiExclamationCircle } from "react-icons/hi"; // Importer les icônes
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // "success" ou "error"
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Supposons que tu envoies une requête pour t'inscrire via ton API ici.
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      setToastMessage("Registration successful!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => {
        navigate("/login"); // Redirige vers la page de connexion après l'inscription
      }, 2000);
    } else {
      setToastMessage("Failed to register. Please try again.");
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <div>
            <Label htmlFor="username" value="Username" />
            <TextInput
              id="username"
              type="text"
              placeholder="Your username"
              required={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email" value="Your email" />
            <TextInput
              id="email"
              type="email"
              placeholder="john.doe@gmail.com"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" value="Your password" />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button color="blue" type="submit">
            Register
          </Button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Log in here
            </Link>
          </p>
        </form>
      </Card>

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
  );
};

export default Register;
