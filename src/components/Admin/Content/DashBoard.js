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
import { Cell } from "recharts";
import CountUp from "react-countup";
import { useState, useEffect } from "react";
import "./Dashboard.scss";
import { useTranslation, Trans } from "react-i18next";
import NProgress from "nprogress";
const participantApi = "http://localhost:4000/participant";
const quizApi = "http://localhost:4000/quiz";
const questionApi = "http://localhost:4000/question";
const answerApi = "http://localhost:4000/answer";
const resultApi = "http://localhost:4000/total-mark";
const submitAnswerApi = "http://localhost:4000/submit-answers";
const DashBoard = (props) => {
  const [dataOverView, setDataOverView] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const [dataChart1, setDataChart1] = useState([]);
  let dataRender = [];
  let dataRender2 = [];
  const { t } = useTranslation();
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      NProgress.start();
      const dataParticipant = await fetchParticipant();
      const dataQuiz = await fetchQuiz();
      const dataQuestion = await fetchQuestion();
      const dataAnswer = await fetchAnswer();
      const dataResult = await fetchResult();
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
      const data1 = [];
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
      dataQuiz.forEach((item) => {
        let dataMark = {
          name: item.name,
          averageScore: averageScore(dataResult, item.id),
          maxScore: maxScore(dataResult, item.id),
        };
        data1.push(dataMark);
      });

      setDataOverView(dataRender);
      setDataChart(data);
      setDataChart1(data1);
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
    const res = await fetch(submitAnswerApi);
    const data = await res.json();
    return data;
  };
  const fetchResult = async () => {
    const res = await fetch(resultApi);
    const data = await res.json();
    return data;
  };

  const averageScore = (dataResult, quizId) => {
    let totalScore = 0;
    let count = 0;
    dataResult.forEach((result) => {
      if (+result.quizId === +quizId) {
        count++;
        totalScore += result.mark;
      }
    });
    return isNaN(Math.ceil(totalScore / count))
      ? 0
      : Math.ceil(totalScore / count);
  };

  const maxScore = (dataResult, quizId) => {
    let maxScore = 0;
    dataResult.forEach((result) => {
      if (+result.quizId === +quizId && result.mark > maxScore) {
        maxScore = result.mark;
      }
    });
    return maxScore;
  };
  return (
    <div className="dashboard-container">
      <div className="title">{t("dashboard.title")}</div>

      <div className="content">
        <div className="content-left">
          <div className="content-child">
            <span className="text-1"> {t("dashboard.totalUser")}</span>
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
            <span className="text-1">{t("dashboard.totalQuiz")} </span>
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
            <span className="text-1">{t("dashboard.totalQuestion")} </span>
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
            <span className="text-1">{t("dashboard.totalAnswer")} </span>
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
        <div className="content-detail">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              // width={500}
              // height={300}
              data={dataChart1}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="averageScore" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="maxScore" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
