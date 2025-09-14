import './Form.css';
import { useState, useEffect } from 'react';
import Cookie from "cookie-universal";
import { login } from "../Apis/Api";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ErrorMsg, SetErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
  const navigate = useNavigate();

  const token = cookie.get("userToken");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const validation = email === "" || password ==="";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (validation) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill all required fields correctly!',
        showConfirmButton: false,
        timer: 2500,
        position: 'center',
        timerProgressBar: true,
        iconColor: '#ff8800'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
          password: password,
        })
      });

      const data = await response.json();
      if (data.code) {
        SetErrorMsg(data.message || "Login failed");
      } else {
        cookie.set("userToken", data["user-token"], { path: "/", maxAge: 60*60*24 });
        Swal.fire({
          icon: 'success',
          title: 'Logged in successfully!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          position: 'center',
          iconColor: '#191919'
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: 'Please try again later.',
        showConfirmButton: true,
        iconColor: '#d9534f'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      {loading && <LoadingSpinner />}
      <h2>Welcome Back! Please enter your details</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter Your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="********"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {ErrorMsg && <p className="WrongMassage">{ErrorMsg}</p>}
        <button type="submit" className="btn-custom">Log In</button>
      </form>
    </div>
  );
}

export default Login;
