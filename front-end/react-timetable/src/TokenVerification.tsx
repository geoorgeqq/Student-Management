import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  email: string;
  id: number;
  pic: string;
  department?: { id: number; name: string };
}

interface ResponseJWT {
  jwtToken: string;
  type: "student" | "teacher" | "admin";
  student?: UserData;
  teacher?: UserData;
  admin?: UserData;
}

interface TokenVerificationProps {
  onVerificationComplete: () => void; // Callback for completion
}

const TokenVerification: React.FC<TokenVerificationProps> = ({
  onVerificationComplete,
}) => {
  const jwtToken = localStorage.getItem("jsonWebToken");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!jwtToken) {
        onVerificationComplete(); // Notify that verification is done if no token
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/tokens/verify-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ jwtToken }),
          }
        );

        if (!response.ok) {
          console.error("Token verification failed");
          onVerificationComplete(); // Notify even if verification fails
          return;
        }

        const responseJWT: ResponseJWT = await response.json();
        const { type } = responseJWT;
        const userData = responseJWT[type as keyof ResponseJWT] as
          | UserData
          | undefined;

        if (userData) {
          const { name, email, id, pic, department } = userData;
          const departmentId = department?.id;
          const imageUrl = `data:image/jpeg;base64,${pic}`;

          navigate(`/${type}/dashboard`, {
            state: { name, email, id, image: imageUrl, departmentId },
          });
        } else {
          console.error("User data not found in the response");
        }
        onVerificationComplete(); // Notify on successful verification
      } catch (error) {
        console.error("Error verifying token:", error);
        onVerificationComplete();
      }
    };

    verifyToken();
  }, [jwtToken, navigate, onVerificationComplete]);

  return null; // Render nothing
};

export default TokenVerification;
