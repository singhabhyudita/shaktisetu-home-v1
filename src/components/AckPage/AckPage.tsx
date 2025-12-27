import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { notificationService } from "../../services/notificationService";
import "./AckPage.css";

const AckPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const acknowledgeToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage(
          "Missing token parameter. Please provide token=xxxxx in the query string.",
        );
        return;
      }

      try {
        const result = await notificationService.acknowledgeNotification(token);

        if (result.success) {
          setStatus("success");
          setMessage(
            result.message || "Notification acknowledged successfully!",
          );
        } else {
          setStatus("error");
          setMessage(result.error || "Failed to acknowledge token");
        }
      } catch (error) {
        console.error("Error calling acknowledge edge function:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to acknowledge token",
        );
      }
    };

    acknowledgeToken();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="ack-page">
        <div className="container">
          <div className="spinner"></div>
          <h1 className="text-gradient">Processing</h1>
          <p>Please wait while we acknowledge your request...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="ack-page">
        <div className="container">
          <div className="checkmark">✓</div>
          <h1 className="text-gradient">Thank You!</h1>
          <p>{message}</p>
          <Link to="/" className="back-home-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ack-page">
      <div className="container">
        <div className="error-icon">✗</div>
        <h1 className="text-gradient">Error</h1>
        <p>{message}</p>
        <Link to="/" className="back-home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AckPage;
