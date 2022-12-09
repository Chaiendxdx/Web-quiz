import { useRef } from "react";
import { memo } from "react";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import NProgress from "nprogress";
import { useTranslation } from "react-i18next";
const participantApi = "http://localhost:4000/participant";
const markApi = "http://localhost:4000/total-mark";

const History = (props) => {
  const { listResult, quizPerPage } = props;
  const { t } = useTranslation();
  const [pageNumber, setPageNumber] = useState(0);
  const pagesVisited = pageNumber * quizPerPage;
  const [pageCount, setPageCount] = useState(0);
  const start = pagesVisited;
  const end = pagesVisited + quizPerPage;
  //   const [currentListUsers, setcurrentListUsers] = useState(
  //     listUsers.slice(start, end)
  //   );

  const [currentListResult, setcurrentListResult] = useState(
    listResult.slice(start, end)
  );

  useEffect(() => {
    fetchDataResult();
  }, [listResult, start]);

  const fetchDataResult = async () => {
    NProgress.start();
    const res = await fetch(
      markApi + "?_start=" + start + "&_limit=" + quizPerPage
    );
    const data = await res.json();

    if (data.length === 0) {
      setPageCount(pageCount - 1);
      setPageNumber(pageNumber - 1);
    } else {
      setcurrentListResult(data);
      listResult.length !== 0 &&
        setPageCount(Math.ceil(listResult.length / quizPerPage));
    }
    NProgress.done();
  };

  //   const fetchUserPerPage = async () => {
  //     NProgress.start();
  //     const res = await fetch(
  //       participantApi + "?_start=" + start + "&_limit=" + usersPerPage
  //     );
  //     const data = await res.json();

  //     if (data.length === 0) {
  //       setPageCount(pageCount - 1);
  //       setPageNumber(pageNumber - 1);
  //     } else {
  //       setcurrentListUsers(data);
  //       listUsers.length !== 0 &&
  //         setPageCount(Math.ceil(listUsers.length / usersPerPage));
  //     }
  //     NProgress.done();
  //   };

  const displayResult = currentListResult.map((result, index) => {
    return (
      <tr key={`table-users-${index}`}>
        <th scope="row">{index + 1 + pageNumber * quizPerPage}</th>
        <td>{result.quizName}</td>
        <td>{result.totalQuestion}</td>
        <td>{result.totalCorrect}</td>
        <td>{result.mark}</td>

        {/* <td>
          <button
            className="btn btn-secondary"
            onClick={() => props.handleView(user)}
          >
            View
          </button>
          <button
            className="btn btn-warning mx-3"
            onClick={() => props.handleClickBtnUpdate(user)}
          >
            Update
          </button>
          <button
            className="btn btn-danger"
            onClick={() => props.handleDeleteUser(user)}
          >
            {" "}
            Delete
          </button>
        </td> */}
      </tr>
    );
  });

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      <table className="table table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">{t("history.quizName")}</th>
            <th scope="col">{t("history.totalQ")}</th>
            <th scope="col">{t("history.totalC")}</th>
            <th scope="col">{t("history.mark")}</th>
          </tr>
        </thead>
        <tbody>{displayResult}</tbody>
      </table>
      {/* {console.log(pageNumber)} */}
      <div className="page-paginate d-flex justify-content-center">
        <ReactPaginate
          previousLabel={`< ${t("button.prev")}`}
          nextLabel={`${t("button.next")} >`}
          pageCount={pageCount}
          onPageChange={changePage}
          pageRangeDisplayed={5}
          marginPagesDisplayed={3}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
          forcePage={pageNumber}
        />
      </div>
    </>
  );
};

export default History;
