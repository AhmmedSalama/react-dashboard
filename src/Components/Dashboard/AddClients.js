import { APP_ID, API_KEY, ClientsTABLE } from "../../Apis/Api";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddClients() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleAddClints(e) {
    e.preventDefault();

    if (!name || !email || !phone || !address) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all fields!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Add this client?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ClientsTABLE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            address,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to add client");

      await res.json();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Client has been added successfully!",
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/Dashboard/Clients", { replace: true });
      }, 2000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      {loading && <LoadingSpinner />} {/* هيغطي الشاشة كلها */}
      <h2>Add Clients</h2>
      <div className="container mt-4">
        <form onSubmit={handleAddClints}>
          {/* الاسم */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* الايميل */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* الرقم */}
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              className="form-control"
              placeholder="Enter phone"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* العنوان */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="form-control"
              placeholder="Enter address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* زر الحفظ */}
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddClients;
