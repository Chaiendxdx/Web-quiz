import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Password from "./Password";
import UserInfo from "./UserInfo";
import { useSelector } from "react-redux";
import "./Profile.scss";
import { useEffect } from "react";
import { useState } from "react";
import History from "./History";
const markApi = "http://localhost:4000/total-mark";
let dataResult = [];
const Profile = (props) => {
  const { show, handleClose } = props;
  const [listResult, setListResult] = useState(dataResult);
  let account = useSelector((state) => state.user.account);
  useEffect(() => {
    fetchResult();
  }, []);
  const fetchResult = async () => {
    const res = await fetch(markApi);
    const data = await res.json();
    dataResult = data.filter((item) => item.userId === account.id);
    setListResult(dataResult);
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        className="modal-add-user"
      >
        <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="Main Info">
              <UserInfo account={account} />
            </Tab>
            <Tab eventKey="profile" title="Password">
              <Password account={account} />
            </Tab>
            <Tab eventKey="history" title="History">
              <History listResult={listResult} quizPerPage={8} />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
