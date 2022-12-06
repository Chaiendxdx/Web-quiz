import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CountUp from "react-countup";
import { useState, useEffect } from "react";
import "./Dashboard.scss";
import NProgress from "nprogress";
const participantApi = "http://localhost:4000/participant";
const quizApi = "http://localhost:4000/quiz";
const questionApi = "http://localhost:4000/question";
const answerApi = "http://localhost:4000/answer";
const DashBoard = (props) => {
  const [dataOverView, setDataOverView] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  let dataRender = [];

  useEffect(() => {
    const fetchData = async () => {
      NProgress.start();
      const dataParticipant = await fetchParticipant();
      const dataQuiz = await fetchQuiz();
      const dataQuestion = await fetchQuestion();
      const dataAnswer = await fetchAnswer();
      NProgress.done();
      let countUsers = 0;
      let countAdmin = 0;
      let countAnswers = dataAnswer.length;
      let countQuestions = dataQuestion.length;
      let countQuiz = dataQuiz.length;
      const data = [
        {
          name: "Quizzes",
          Qz: countQuiz,
        },
        {
          name: "Questions",
          Qs: countQuestions,
        },
        {
          name: "Answers",
          As: countAnswers,
        },
      ];
      dataParticipant.forEach((item) => {
        if (item.role === "ADMIN") {
          countAdmin++;
        }
        if (item.role === "USER") {
          countUsers++;
        }
      });

      dataRender.users = {
        total: dataParticipant.length,
        countUsers: countUsers,
        countAdmin: countAdmin,
      };
      dataRender.others = {
        countQuiz,
        countQuestions,
        countAnswers,
      };
      console.log("dataRender: ", dataRender);
      setDataOverView(dataRender);
      setDataChart(data);
    };

    fetchData();
  }, []);
  const fetchParticipant = async () => {
    const res = await fetch(participantApi);
    const data = await res.json();
    return data;
  };

  const fetchQuiz = async () => {
    const res = await fetch(quizApi);
    const data = await res.json();
    return data;
  };

  const fetchQuestion = async () => {
    const res = await fetch(questionApi);
    const data = await res.json();
    return data;
  };

  const fetchAnswer = async () => {
    const res = await fetch(answerApi);
    const data = await res.json();
    return data;
  };
  return (
    <div className="dashboard-container">
      <div className="title">Analytics DashBoard</div>

      <div className="content">
        <div className="content-left">
          <div className="content-child">
            <span className="text-1"> Total Users </span>
            <span className="text-2">
              {" "}
              {dataOverView &&
              dataOverView.users &&
              dataOverView.users.total ? (
                <CountUp
                  start={0}
                  end={dataOverView.users.total}
                  duration={0.3}
                />
              ) : (
                0
              )}
            </span>
          </div>
          <div className="content-child">
            <span className="text-1">Total Quizzes </span>
            <span className="text-2">
              {" "}
              {dataOverView &&
              dataOverView.others &&
              dataOverView.others.countQuiz ? (
                <CountUp
                  start={0}
                  end={dataOverView.others.countQuiz}
                  duration={0.3}
                />
              ) : (
                0
              )}
            </span>
          </div>
          <div className="content-child">
            <span className="text-1">Total Questions </span>
            <span className="text-2">
              {" "}
              {dataOverView &&
              dataOverView.others &&
              dataOverView.others.countQuestions ? (
                <CountUp
                  start={0}
                  end={dataOverView.others.countQuestions}
                  duration={0.3}
                />
              ) : (
                0
              )}
            </span>
          </div>
          <div className="content-child">
            <span className="text-1">Total Answers </span>
            <span className="text-2">
              {" "}
              {dataOverView &&
              dataOverView.others &&
              dataOverView.others.countAnswers ? (
                <CountUp
                  start={0}
                  end={dataOverView.others.countAnswers}
                  duration={0.3}
                />
              ) : (
                0
              )}
            </span>
          </div>
        </div>
        <div className="content-right">
          <ResponsiveContainer width="95%" height="100%">
            <BarChart data={dataChart}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Qz" fill="#8884d8" />
              <Bar dataKey="Qs" fill="#82ca9d" />
              <Bar dataKey="As" fill="#6C5B7B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
