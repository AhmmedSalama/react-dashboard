import { useState } from "react";
import { APP_ID, API_KEY, OrdersTABLE } from "../../Apis/Api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function AddOrder() {
  const [clientname, setClientName] = useState("");
  const [phonetype, setPhoneType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleAddOrder(e) {
    e.preventDefault();

    if (!clientname || !phonetype || !quantity) {
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
      text: "Do you want to add this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true); // ⬅️ يبدأ اللودينج

    try {
      const res = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${OrdersTABLE}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientname,
            phonetype,
            quantity,
            status,
          }),
        }
      );

      await res.json();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Order has been added successfully!",
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/Dashboard/Orders", { replace: true });
      }, 2000);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add order.",
      });
    } finally {
      setLoading(false); // ⬅️ يقفل اللودينج في كل الحالات
    }
  }

  return (
    <div className="container mt-4">
      {loading && <LoadingSpinner />}
      <h3>Add Order</h3>
      <form onSubmit={handleAddOrder}>
        {/* Client Name */}
        <div className="mb-3">
          <label className="form-label">Client Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter client name"
            value={clientname}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        {/* Phone Type */}
        <div className="mb-3">
          <label className="form-label">Phone Type</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter phone type"
            value={phonetype}
            onChange={(e) => setPhoneType(e.target.value)}
          />
        </div>

        {/* Quantity */}
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="completed">Delivered</option>
            <option value="completed">Shipped</option>
          </select>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Order"}
        </button>
      </form>
    </div>
  );
}

export default AddOrder;
