import ModalCreateUser from "./ModalCreateUser";
import "./ManageUser.scss";
import { FcPlus } from "react-icons/fc";
import { useState, useEffect } from "react";
import TableUser from "./TableUser";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalViewUser from "./ModalViewUser";
const participantApi = "http://localhost:3000/participant";
let dataUser = [];

const ManageUser = (props) => {
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [showModalUpdateUser, setShowModalUpdateUser] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [dataUpdateUser, setDataUpdateUser] = useState({});
  const [listUsers, setListUsers] = useState(dataUser);
  const [idUser, setIdUser] = useState("");
  let numberUser = dataUser.length;
  const fetchDataUser = () => {
    fetch(participantApi)
      .then((response) => response.json())
      .then((data) => {
        dataUser = [...data];
        setListUsers(dataUser);
      });
  };

  useEffect(() => {
    fetchDataUser();
  }, [numberUser]);

  const handleClickBtnUpdate = (userUpdate) => {
    setShowModalUpdateUser(true);
    setDataUpdateUser(userUpdate);
    setIdUser(userUpdate.id);
  };

  const handleView = (user) => {
    setIdUser(user.id);
    setShowModalView(true);
  };
  return (
    <div className="manage-user-container">
      <div className="title">Manage User</div>
      <div className="users-content">
        <div className="btn-add-new">
          <button
            className="btn btn-primary"
            onClick={() => setShowModalCreateUser(true)}
          >
            <FcPlus /> Add new users
          </button>
        </div>

        <div className="table-user-container">
          <TableUser
            listUsers={listUsers}
            handleClickBtnUpdate={handleClickBtnUpdate}
          />
        </div>
        <ModalCreateUser
          show={showModalCreateUser}
          setShow={setShowModalCreateUser}
          fetchDataUser={fetchDataUser}
        />

        <ModalUpdateUser
          show={showModalUpdateUser}
          setShow={setShowModalUpdateUser}
          dataUpdateUser={dataUpdateUser}
          idUpdateUser={idUser}
          fetchDataUser={fetchDataUser}
        />

        {/* <ModalViewUser
          show={showModalView}
          setShow={setShowModalView}
          idUser={idUser}
        /> */}
      </div>
    </div>
  );
};

export default ManageUser;
