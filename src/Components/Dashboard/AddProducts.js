import { APP_ID, API_KEY, ProductsTABLE } from "../../Apis/Api";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProducts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleAddProduct(e) {
    e.preventDefault();

    if (!title || !description || !price || !category ) {
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
      text: "Do you want to add this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Add!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ProductsTABLE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            price,
            category,
            
          }),
        }
      );

      await res.json();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product has been added successfully!",
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/Dashboard/Products", { replace: true });
      }, 2000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      {loading && <LoadingSpinner />}
      <h2>Add Product</h2>
      <div className="container mt-4">
        <form onSubmit={handleAddProduct}>
          {/* Title */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              placeholder="Enter product title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Enter product description"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Price */}
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              id="price"
              className="form-control"
              placeholder="Enter product price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              id="category"
              className="form-control"
              placeholder="Enter product category"
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Image URL */}
          {/* <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              className="form-control"
              placeholder="Enter product image URL"
              onChange={(e) => setImage(e.target.value)}
            />
          </div> */}

          {/* زر الحفظ */}
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProducts;
