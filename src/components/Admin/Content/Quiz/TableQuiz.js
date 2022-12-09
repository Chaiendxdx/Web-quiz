import { useEffect, useState } from "react";
import { memo } from "react";
import NProgress from "nprogress";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";
const quizApi = "http://localhost:4000/quiz";
const TableQuiz = (props) => {
  const { listQuiz, quizPerPage, handleClickBtnEdit, handleDeleteQuiz } = props;
  const [pageNumber, setPageNumber] = useState(0);
  const pagesVisited = pageNumber * quizPerPage;
  const [pageCount, setPageCount] = useState(0);
  const start = pagesVisited;
  const end = pagesVisited + quizPerPage;
  const { t } = useTranslation();
  const [currentListQuiz, setcurrentListQuiz] = useState(
    listQuiz.slice(start, end)
  );

  useEffect(() => {
    fetchQuizPerPage();
  }, [listQuiz, start]);

  const fetchQuizPerPage = async () => {
    NProgress.start();
    const res = await fetch(
      quizApi + "?_start=" + start + "&_limit=" + quizPerPage
    );
    const data = await res.json();

    if (data.length === 0) {
      setPageCount(pageCount - 1);
      setPageNumber(pageNumber - 1);
    } else {
      setcurrentListQuiz(data);
      listQuiz.length !== 0 &&
        setPageCount(Math.ceil(listQuiz.length / quizPerPage));
    }
    NProgress.done();
  };

  const displayQuiz = currentListQuiz.map((item, index) => {
    return (
      <tr key={`table-quiz-${index}`}>
        <th>{index + 1 + pageNumber * quizPerPage}</th>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{item.difficulty}</td>
        <td style={{ display: "flex", gap: "15px" }}>
          <button
            className="btn btn-warning"
            onClick={() => handleClickBtnEdit(item)}
          >
            {t("button.edit")}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteQuiz(item)}
          >
            {t("button.del")}
          </button>
        </td>
      </tr>
    );
  });

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  // const [listQuiz, setListQuiz] = useState({});
  // let numberQuiz = listQuiz.length;
  // useEffect(() => {
  //   getQuizbyApi();
  // }, [numberQuiz]);

  // const getQuizbyApi = async () => {
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //   };
  //   NProgress.start();
  //   const res = await fetch(quizApi, options);
  //   const data = await res.json();
  //   NProgress.done();
  //   if (res && res.status === 200) {
  //     setListQuiz(data);
  //   }
  // };
  return (
    <>
      <div>{t("quiz.listQuiz")}</div>
      <table className="table table-hover table-bordered my-2">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">{t("quiz.name")}</th>
            <th scope="col">{t("quiz.desc")}</th>
            <th scope="col">{t("quiz.type")}</th>
            <th scope="col">{t("quiz.action")}</th>
          </tr>
        </thead>
        <tbody>{displayQuiz}</tbody>
      </table>
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

export default memo(TableQuiz);
