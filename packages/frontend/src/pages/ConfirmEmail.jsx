import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Toast } from "flowbite-react";
import { HiCheck, HiExclamation } from "react-icons/hi";

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success or error
  const [confirmationFailed, setConfirmationFailed] = useState(false); // Nouvel état

  const confirmEmail = async () => {
    setIsLoading(true);
    setConfirmationFailed(false); // Réinitialiser l'état
    const response = await fetch(
      `${backendUrl}/api/auth/confirm-email/${token}`,
    );

    if (response.ok) {
      setToastType("success");
      setToastMessage("Email confirmed successfully!");
      setShowToast(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setToastType("error");
      setToastMessage("Failed to confirm email. Please try again.");
      setShowToast(true);
      setConfirmationFailed(true); // Marquer l'échec de la confirmation
    }
    setIsLoading(false);
  };

  const resendConfirmationEmail = async () => {
    setIsLoading(true);

    // Envoie l'email pour tenter de renvoyer la confirmation
    const response = await fetch(`${backendUrl}/api/auth/resend-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setToastType("success");
      setToastMessage(
        "If an account with this email exists, a confirmation email has been resent. Please check your inbox.",
      );
      setShowToast(true);
    } else {
      setToastType("error");
      setToastMessage("Failed to resend confirmation email.");
      setShowToast(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    confirmEmail();
  }, [token]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-xl font-bold">Confirming your email...</h2>
      {!isLoading && confirmationFailed && (
        <div className="mt-4">
          <Label htmlFor="email" value="Enter your email" />
          <TextInput
            id="email"
            type="email"
            placeholder="Enter your email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            color="blue"
            onClick={resendConfirmationEmail}
            className="mt-2"
          >
            Resend Confirmation Email
          </Button>
        </div>
      )}

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

export default ConfirmEmail;
