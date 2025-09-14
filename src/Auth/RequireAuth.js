import { Navigate, Outlet } from "react-router-dom";
import Cookie from "cookie-universal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";


const BASE_URL = "https://api.backendless.com/2D686640-3AF8-4C84-9DE8-BA0907098963/B78B7769-9CBD-42B3-AF6D-551310D8C7CC";

function RequireAuth() {
  const cookie = Cookie();
  const token = cookie.get("userToken"); // التوكن اللي خزنته في اللوجين
  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }

    // التحقق من التوكن
    fetch(`${BASE_URL}/users/isvalidusertoken/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data === true) {
          setIsValid(true);
        } else {
          cookie.remove("userToken");
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        cookie.remove("userToken");
        navigate("/login", { replace: true });
      })
      .finally(() => setChecking(false));
  }, [token, navigate, cookie]);

  if (checking) {
    return <LoadingSpinner />;
  }

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
}

export default RequireAuth;
