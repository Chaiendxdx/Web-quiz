import { useRef } from "react";
import { memo } from "react";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import NProgress from "nprogress";
import { useTranslation } from "react-i18next";
const participantApi = "http://localhost:4000/participant";

const TableUserPaginate = (props) => {
  const { listUsers, usersPerPage } = props;
  const [pageNumber, setPageNumber] = useState(0);
  const pagesVisited = pageNumber * usersPerPage;
  const [pageCount, setPageCount] = useState(0);
  const start = pagesVisited;
  const end = pagesVisited + usersPerPage;
  const { t } = useTranslation();
  const [currentListUsers, setcurrentListUsers] = useState(
    listUsers.slice(start, end)
  );

  useEffect(() => {
    fetchUserPerPage();
  }, [listUsers, start]);

  const fetchUserPerPage = async () => {
    NProgress.start();
    const res = await fetch(
      participantApi + "?_start=" + start + "&_limit=" + usersPerPage
    );
    const data = await res.json();

    if (data.length === 0) {
      setPageCount(pageCount - 1);
      setPageNumber(pageNumber - 1);
    } else {
      setcurrentListUsers(data);
      listUsers.length !== 0 &&
        setPageCount(Math.ceil(listUsers.length / usersPerPage));
    }
    NProgress.done();
  };

  const displayUsers = currentListUsers.map((user, index) => {
    return (
      <tr key={`table-users-${index}`}>
        <th scope="row">{index + 1 + pageNumber * usersPerPage}</th>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>
          <button
            className="btn btn-secondary"
            onClick={() => props.handleView(user)}
          >
            {t("tableUser.view")}
          </button>
          <button
            className="btn btn-warning mx-3"
            onClick={() => props.handleClickBtnUpdate(user)}
          >
            {t("tableUser.update")}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => props.handleDeleteUser(user)}
          >
            {" "}
            {t("tableUser.delete")}
          </button>
        </td>
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
            <th scope="col"> {t("tableUser.username")}</th>
            <th scope="col"> {t("tableUser.email")}</th>
            <th scope="col"> {t("tableUser.role")}</th>
            <th scope="col"> {t("tableUser.action")}</th>
          </tr>
        </thead>
        <tbody>{displayUsers}</tbody>
      </table>
      {/* {console.log(pageNumber)} */}
      <div className="page-paginate d-flex justify-content-center">
        <ReactPaginate
          previousLabel={`< ${t("tableUser.prev")}`}
          nextLabel={` ${t("tableUser.next")} >`}
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

export default memo(TableUserPaginate);
