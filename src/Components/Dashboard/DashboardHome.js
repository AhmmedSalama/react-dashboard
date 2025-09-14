import { FaUsers, FaBox, FaShoppingCart } from "react-icons/fa";
import "./DashboardHome.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { APP_ID, API_KEY, ClientsTABLE, ProductsTABLE, OrdersTABLE } from "../../Apis/Api";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function DashboardHome() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FetchData();
  }, []);

  async function FetchData() {
    setLoading(true);
    try {
      // Clients
      const clientsRes = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ClientsTABLE}`
      );
      const clientsData = await clientsRes.json();
      setClients(clientsData);

      // Products
      const productsRes = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ProductsTABLE}`
      );
      const productsData = await productsRes.json();
      setProducts(productsData);

      // Orders
      const ordersRes = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${OrdersTABLE}`
      );
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row mt-4">
      {loading && <LoadingSpinner />}

      {/* Clients */}
      <div className="col-md-4 mb-3">
        <Link to={"/Dashboard/Clients"} className="card shadow border-0">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted mb-1">Clients</h6>
              <h3 className="mb-0 fw-bold text-dark">{clients.length}</h3>
            </div>
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
              <FaUsers className="text-primary fs-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Products */}
      <div className="col-md-4 mb-3">
        <Link to={"/Dashboard/Products"} className="card shadow border-0">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted mb-1">Products</h6>
              <h3 className="mb-0 fw-bold text-dark">{products.length}</h3>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded-circle">
              <FaBox className="text-success fs-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Orders */}
      <div className="col-md-4 mb-3">
        <Link to={"/Dashboard/Orders"} className="card shadow border-0">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted mb-1">Orders</h6>
              <h3 className="mb-0 fw-bold text-dark">{orders.length}</h3>
            </div>
            <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
              <FaShoppingCart className="text-warning fs-4" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DashboardHome;
 