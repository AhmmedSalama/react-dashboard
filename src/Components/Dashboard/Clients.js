import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { APP_ID, API_KEY, ClientsTABLE } from "../../Apis/Api";
import Swal from "sweetalert2";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import PaginatedItems from "../ReactPaginate";

function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totaldata, setTotaldata] = useState(0);

  useEffect(() => {
    FetchData();
  }, [page, limit]);

  async function FetchData() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ClientsTABLE}?pageSize=${limit}&offset=${(page - 1) * limit}`
      );
      const data = await res.json();
      setClients(data);

      const countRes = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ClientsTABLE}/count`
      );
      const total = await countRes.json();
      setTotaldata(Number(total));
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(search.toLowerCase())
  );

  async function DeleteClient(clientId, clientName) {
    const result = await Swal.fire({
      title: `Are you sure you want to delete "${clientName}"?`,
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
          `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ClientsTABLE}/${clientId}`,
          { method: "DELETE" }
        );

        Swal.fire({
          title: "Deleted!",
          text: "Client deleted successfully.",
          icon: "success",
        });

        FetchData();
      } catch (err) {
        console.error("Error deleting client:", err);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the client.",
          icon: "error",
        });
      }
    }
  }

  return (
    <div className="container">
      {loading && <LoadingSpinner />}
      <h3 className="mb-3">Clients Data</h3>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="table table-striped table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.objectId}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.address}</td>
                  <td className="d-flex justify-content-center align-items-center flex-wrap gap-1">
                    <Link aria-label="edit client"
                      to={`/Dashboard/Clients/edit/${client.objectId}`}
                      className="btn btn-sm btn-primary"
                    >
                      <FaEdit />
                    </Link>
                    <button aria-label="Delete client"
                      onClick={() => DeleteClient(client.objectId, client.name)}
                      className="btn btn-sm btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginatedItems
        totaldata={totaldata}
        itemsPerPage={limit}
        setpage={setPage}
      />
    </div>
  );
}

export default Clients;
