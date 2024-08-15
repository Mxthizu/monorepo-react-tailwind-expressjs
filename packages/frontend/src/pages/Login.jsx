import { useState } from "react";
import { Label, TextInput, Button, Card, Modal, Toast } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiCheck, HiExclamation } from "react-icons/hi";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success or error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      setToastType("error");
      setToastMessage("Invalid credentials");
      setShowToast(true);
    }
  };

  const handlePasswordResetRequest = async () => {
    const response = await fetch(
      `${backendUrl}/api/auth/request-password-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      },
    );

    if (response.ok) {
      setToastType("success");
      setToastMessage("Password reset email sent. Please check your inbox.");
      setShowToast(true);
      setIsModalOpen(false);
    } else {
      setToastType("error");
      setToastMessage("Failed to send password reset email.");
      setShowToast(true);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email" value="Your email" />
            <TextInput
              id="email"
              type="email"
              placeholder="name@company.com"
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
            Login
          </Button>
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Sign up here
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500">
            Forgot your password?{" "}
            <Link
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500"
            >
              Reset it here
            </Link>
          </p>
        </form>
      </Card>

      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="bg-gray-900/80"
      >
        <Modal.Header>Reset Password</Modal.Header>
        <Modal.Body>
          <div>
            <Label htmlFor="reset-email" value="Enter your email" />
            <TextInput
              id="reset-email"
              type="email"
              placeholder="name@company.com"
              required={true}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlePasswordResetRequest} color="blue">
            Send Reset Link
          </Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

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
    </div>
  );
};

export default Login;
