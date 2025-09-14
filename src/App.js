import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Auth/Login';
import Register from './Auth/Register';
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard/Dashboard';
import RequireAuth from './Auth/RequireAuth';
import Clients from './Components/Dashboard/Clients';
import ClientsEdit from './Components/Dashboard/ClientsEdit';
import DashboardHome from './Components/Dashboard/DashboardHome.js';
import AddClients from './Components/Dashboard/AddClients.js';
import Products from './Components/Dashboard/Products.js';
import AddProducts from './Components/Dashboard/AddProducts.js';
import Orders from './Components/Dashboard/Orders.js';
import AddOrder from './Components/Dashboard/AddOrder.js';
import OrdersEdit from './Components/Dashboard/OrdersEdit.js';
import ProductsEdit from './Components/Dashboard/ProductsEdit.js';

function App() {
  return (
    <div className="App">
  <NavBar />
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/Register" element={<Register />} />
  <Route path="/Login" element={<Login />} />

  {/* حماية الصفحات */}
  <Route element={<RequireAuth />}>
<Route path="/Dashboard" element={<Dashboard />}>
  <Route index element={<DashboardHome />} />
  <Route path="Clients" element={<Clients />} />
  <Route path="Clients/edit/:id" element={<ClientsEdit />} />
  <Route path="Clients/AddClients" element={<AddClients />} />
  <Route path="Products" element={<Products />} />
  <Route path="Products/AddProducts" element={<AddProducts />} />
  <Route path="Products/edit/:id" element={<ProductsEdit />} />
  <Route path="Orders" element={<Orders />} />
  <Route path="Orders/AddOrder" element={<AddOrder />} />
  <Route path="Orders/edit/:id" element={<OrdersEdit />} />
</Route>

  </Route>
</Routes>
    </div>
  );
}

export default App;
