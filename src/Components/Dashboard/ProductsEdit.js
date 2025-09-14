import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APP_ID, API_KEY, ProductsTABLE } from "../../Apis/Api";
import Swal from "sweetalert2";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function ProductsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ProductsTABLE}/${id}`
        );
        const data = await res.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(data.price || "");
        setCategory(data.category || "");
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  async function handleEditProduct(e) {
    e.preventDefault();

    if (!title || !price || !category) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all required fields!",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ProductsTABLE}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, price, category }),
        }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product updated successfully!",
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/Dashboard/Products", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Error updating product:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update product.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      {loading && <LoadingSpinner />}
      <h2>Edit Product</h2>
      <form onSubmit={handleEditProduct} className="mt-3">
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default ProductsEdit;
