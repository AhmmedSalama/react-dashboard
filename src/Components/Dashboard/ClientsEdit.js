import { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { APP_ID , API_KEY , ClientsTABLE} from "../../Apis/Api";
import Swal from 'sweetalert2';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
function ClientsEdit() {
  const { id } = useParams(); 
  const [client , setClient]= useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
useEffect(() => {
  fetch(`https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ClientsTABLE}/${id}`)
    .then((response) => response.json())
    .then((data) => {
      setClient(data);
      setName(data.name);      
      setEmail(data.email);   
      setPhone(data.phone);    
      setAddress(data.address);
    });
}, [id]);
async function handleEditClient(e) {
  e.preventDefault();

  if (!name) {
    Swal.fire({
      icon: 'warning',
      title: 'Please fill all fields!',
      showConfirmButton: false,
      timer: 2000
    });
    return;
  }

  setLoading(false);

  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to update this client?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, update!',
    cancelButtonText: 'Cancel'
  });

  if (!confirm.isConfirmed) return;

  setLoading(true);

  try {
    const res = await fetch(`https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ClientsTABLE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, address })
    });
    await res.json();
    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Client updated successfully!',
      timer:2000
    });
    setTimeout(() => {
      navigate("/Dashboard/Clients", { replace: true });
    }, 2000);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Failed to update client.'
    });
  } finally {
    setLoading(false); 
  }
}




  return (
    <div className="p-4">
      {loading && <LoadingSpinner />}
      <h2>Edit Clients</h2>
      <p>Client Name: {client.name}</p>
    <div className="container mt-4">
      <form onSubmit={handleEditClient}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            className="form-control"
            placeholder="Enter phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            id="address"
            className="form-control"
            placeholder="Enter address"
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
    </div>
  );
}

export default ClientsEdit;
