import Select from "react-select";
import { useState, useEffect } from "react";
import NProgress from "nprogress";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const quizApi = "http://localhost:4000/quiz";
const participantApi = "http://localhost:4000/participant";
const quizAssignApi = "http://localhost:4000/quiz-assign-to-user";
const AssignQuiz = (props) => {
  const [listQuiz, setListQuiz] = useState();
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [listQuizAssign, setListQuizAssign] = useState();
  const [listUser, setListUser] = useState();
  const [selectedUser, setSelectedUser] = useState({});
  const { t } = useTranslation();
  useEffect(() => {
    fetchQuiz();
    fetchUser();
    fetchAssignQuiz();
  }, []);
  const fetchQuiz = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(quizApi, options);
    const data = await res.json();
    NProgress.done();
    if (res && res.status === 200) {
      let newQuiz = data.map((item) => {
        return {
          value: item.id,
          label: `${item.name} - ${item.description}`,
        };
      });
      setListQuiz(newQuiz);
    }
  };
  const fetchUser = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(participantApi, options);
    const data = await res.json();
    NProgress.done();
    if (res && res.status === 200) {
      let newUser = data.map((item) => {
        return {
          value: item.id,
          label: `${item.username} - ${item.email}`,
        };
      });
      setListUser(newUser);
    }
  };

  const fetchAssignQuiz = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(quizAssignApi, options);
    const data = await res.json();
    NProgress.done();
    if (res && res.status === 200) {
      setListQuizAssign(data);
    }
  };

  const postAssignQuiz = async (dataAssignQuiz) => {
    const options = {
      method: "POST",
      body: JSON.stringify(dataAssignQuiz),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(quizAssignApi, options);
    const data = await res.json();

    NProgress.done();
    console.log("data: ", data);
  };

  const handleAssign = async () => {
    let dataAssignQuiz = {
      quizId: selectedQuiz.value,
      userId: selectedUser.value,
    };
    let isAssign = false;
    listQuizAssign.forEach((quiz) => {
      if (
        quiz.quizId === dataAssignQuiz.quizId &&
        quiz.userId === dataAssignQuiz.userId
      ) {
        isAssign = true;
      }
    });
    if (isAssign) {
      toast.error(t("assignQuiz.errorAssign"));
      return;
    }
    toast.success(t("assignQuiz.successAssign"));
    await postAssignQuiz(dataAssignQuiz);
  };
  return (
    <div className="assgin-quiz-container row">
      <div className="col-6 form-group">
        <label className="mb-2">{t("quizQA.select")}</label>
        <Select
          value={selectedQuiz}
          onChange={setSelectedQuiz}
          options={listQuiz}
        />
      </div>
      <div className="col-6 form-group">
        <label className="mb-2">{t("manageUser.select")}</label>
        <Select
          value={selectedUser}
          onChange={setSelectedUser}
          options={listUser}
        />
      </div>
      <div>
        <button className="btn btn-warning mt-3" onClick={() => handleAssign()}>
          {t("button.assign")}
        </button>
      </div>
    </div>
  );
};

export default AssignQuiz;
