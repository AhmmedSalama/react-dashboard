import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APP_ID, API_KEY, OrdersTABLE } from "../../Apis/Api";
import Swal from "sweetalert2";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function OrdersEdit() {
  const { id } = useParams();
  const [order, setOrder] = useState("");
  const [clientname, setClientName] = useState("");
  const [phonetype, setPhoneType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.backendless.com/${APP_ID}/${API_KEY}/data/${OrdersTABLE}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setOrder(data);
        setClientName(data.clientname);
        setPhoneType(data.phonetype);
        setQuantity(data.quantity);
        setStatus(data.status);
      });
  }, [id]);

  async function handleEditOrder(e) {
    e.preventDefault();

    if (!clientname) {
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
      text: "Do you want to update this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${OrdersTABLE}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientname, phonetype, quantity, status }),
        }
      );
      await res.json();

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Order updated successfully!",
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/Dashboard/Orders", { replace: true });
      }, 2000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update order.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      {loading && <LoadingSpinner />}
      <h2>Edit Order</h2>
      <p>Client: {order.clientname}</p>
      <div className="container mt-4">
        <form onSubmit={handleEditOrder}>
          {/* Client Name */}
          <div className="mb-3">
            <label htmlFor="clientname" className="form-label">
              Client Name
            </label>
            <input
              type="text"
              id="clientname"
              className="form-control"
              placeholder="Enter client name"
              value={clientname}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          {/* Phone Type */}
          <div className="mb-3">
            <label htmlFor="phonetype" className="form-label">
              Phone Type
            </label>
            <input
              type="text"
              id="phonetype"
              className="form-control"
              placeholder="Enter phone type"
              value={phonetype}
              onChange={(e) => setPhoneType(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <input
              type="text"
              id="status"
              className="form-control"
              placeholder="Enter status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrdersEdit;
