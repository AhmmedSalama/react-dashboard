import ReactPaginate from "react-paginate";
import "./Reactpaginate.css";

export default function PaginatedItems({ itemsPerPage = 10, totaldata = 0, setpage }) {
  const total = Number(totaldata) || 0;
  const perPage = Number(itemsPerPage) || 10;
  const pageCount = Math.ceil(total / perPage);

  if (pageCount === 0) return null;

  return (
    <nav aria-label="Pagination"> {/* مهم عشان يدي معنى لعنصر الباجنيشن */}
      <ReactPaginate
        breakLabel="..."
        nextLabel={<span aria-label="Next page">»</span>}
        previousLabel={<span aria-label="Previous page">«</span>}
        onPageChange={(e) => setpage(e.selected + 1)}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}

        // مهم عشان يدي اسم للصفحات
        ariaLabelBuilder={(page) => `Go to page ${page}`}
      />
    </nav>
  );
}
