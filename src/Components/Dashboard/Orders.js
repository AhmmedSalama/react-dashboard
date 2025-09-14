import { useState, useEffect } from "react";
import { APP_ID, API_KEY, OrdersTABLE } from "../../Apis/Api";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import PaginatedItems from "../ReactPaginate";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    FetchData();
  }, [page, limit]);

  async function FetchData() {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;

      const res = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${OrdersTABLE}?pageSize=${limit}&offset=${offset}`
      );
      const data = await res.json();

      const countRes = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${OrdersTABLE}/count`
      );
      const total = await countRes.json();

      setOrders(data);
      setTotalData(total);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter((order) =>
    order.clientname?.toLowerCase().includes(search.toLowerCase())
  );

  async function DeleteOrder(orderId, clientName) {
    const result = await Swal.fire({
      title: `Are you sure you want to delete order for "${clientName}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await fetch(
          `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${OrdersTABLE}/${orderId}`,
          { method: "DELETE" }
        );

        Swal.fire({
          title: "Deleted!",
          text: "Order deleted successfully.",
          icon: "success",
        });

        FetchData();
      } catch (err) {
        console.error("Error deleting order:", err);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the order.",
          icon: "error",
        });
      }
    }
  }

  return (
    <div className="container">
      {loading && <LoadingSpinner />}

      <h3 className="mb-3">Orders Data</h3>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Client..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="table table-striped table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Client Name</th>
              <th>Phone Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.objectId}>
                  <td>{order.clientname}</td>
                  <td>{order.phonetype}</td>
                  <td>{order.quantity}</td>
                  <td>{order.status}</td>
                  <td className="d-flex justify-content-center align-items-center flex-wrap gap-1">
                    <Link aria-label="edit Orders"
                      to={`/Dashboard/Orders/edit/${order.objectId}`}
                      className="btn btn-sm btn-primary"
                    >
                      <FaEdit />
                    </Link>
                    <button aria-label="Delete Orders"
                      onClick={() =>
                        DeleteOrder(order.objectId, order.clientname)
                      }
                      className="btn btn-sm btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginatedItems
        totaldata={totalData}
        itemsPerPage={limit}
        setpage={setPage}
      />
    </div>
  );
}

export default Orders;
