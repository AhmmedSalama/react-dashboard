import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { register } from "../Apis/Api";
import Cookie from "cookie-universal";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import './Form.css';

function Register() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [Rpassword, setRpassword] = useState("");
  const [ErrorMsg, SetErrorMsg] = useState("");
  const [AcceptPassword, setAcceptPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const cookie = Cookie();
  const token = cookie.get("userToken");

  const validation = name === "" || password.length < 8 || password !== Rpassword;

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setAcceptPassword(true);
    setLoading(true);

    if (validation) {
      if (name === "" || password === "") {
        Swal.fire({
          icon: 'warning',
          title: 'Please fill all required fields correctly!',
          showConfirmButton: false,
          timer: 2500,
          position: 'center',
          timerProgressBar: true,
          iconColor: '#ff8800'
        });
      }
      setLoading(false); // ✨ وقف اللودينج لو الفاليديشن فشلت
      return;
    }

    try {
      const response = await fetch(`${register}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          email: email,
          password: password,
        })
      });

      const data = await response.json();

      if (data.code === 3033) {
        SetErrorMsg("The email has already been taken.");
      } else if (data.code) {
        SetErrorMsg("Error");
      }

      if (!data.code) {
        Swal.fire({
          icon: 'success',
          title: 'Registered successfully!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          position: 'center',
          iconColor: '#191919'
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: 'Please try again later.',
        showConfirmButton: true,
        iconColor: '#d9534f'
      });
    } finally {
      setLoading(false); // ✨ دايماً في الآخر يوقف اللودينج
    }
  }

  return (
    <div className="form-container">
      {loading && <LoadingSpinner />}
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your Name"
          onChange={(e) => setname(e.target.value)}
          maxLength={50}
        />

        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
          required
          onChange={(e) => setemail(e.target.value)}
        />
        {ErrorMsg && <p className="WrongMassage">{ErrorMsg}</p>}

        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="********"
          onChange={(e) => setpassword(e.target.value)}
          maxLength={20}
        />
        {password.length < 8 && AcceptPassword &&
          <p className='WrongMassage'>Password must be at least 8 characters</p>
        }

        <label>Repeat Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Repeat your password"
          onChange={(e) => setRpassword(e.target.value)}
          maxLength={20}
        />
        {password !== Rpassword && Rpassword.length > 0 &&
          <p className='WrongMassage'>Passwords do not match</p>
        }

        <button type="submit" className="btn-custom">Register</button>
      </form>
    </div>
  );
}

export default Register;
