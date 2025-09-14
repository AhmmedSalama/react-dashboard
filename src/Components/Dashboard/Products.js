import { useState, useEffect } from "react";
import { APP_ID, API_KEY, ProductsTABLE } from "../../Apis/Api";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import PaginatedItems from "../ReactPaginate";

function Products() {
  const [products, setProducts] = useState([]);
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
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ProductsTABLE}?pageSize=${limit}&offset=${(page - 1) * limit}`
      );
      const data = await res.json();
      setProducts(data);

      const countRes = await fetch(
        `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ProductsTABLE}/count`
      );
      const total = await countRes.json();
      setTotaldata(Number(total));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(search.toLowerCase())
  );

  async function DeleteProduct(productId, productName) {
    const result = await Swal.fire({
      title: `Are you sure you want to delete "${productName}"?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await fetch(
          `https://api.backendless.com/${APP_ID}/${API_KEY}/data/${ProductsTABLE}/${productId}`,
          { method: "DELETE" }
        );

        Swal.fire({
          title: "Deleted!",
          text: "Product deleted successfully.",
          icon: "success",
        });

        FetchData();
      } catch (err) {
        console.error("Error deleting product:", err);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the product.",
          icon: "error",
        });
      }
    }
  }

  return (
    <div className="container">
      {loading && <LoadingSpinner />} 

      <h3 className="mb-3">Products Data</h3>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="table table-striped table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.objectId}>
                  <td>{product.title}</td>
                  <td>{product.description}</td>
                  <td>{product.price} $</td>
                  <td>{product.category}</td>
                  <td className="d-flex justify-content-center align-items-center flex-wrap gap-1">
                    <Link aria-label="Edit Product"
                      to={`/Dashboard/Products/edit/${product.objectId}`}
                      className="btn btn-sm btn-primary"
                    >
                      <FaEdit />
                    </Link>
                    <button aria-label="Delete Product"
                      onClick={() =>
                        DeleteProduct(product.objectId, product.title)
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

export default Products;
