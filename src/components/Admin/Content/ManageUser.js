import ModalCreateUser from "./ModalCreateUser";
import "./ManageUser.scss";
import { FcPlus } from "react-icons/fc";
import { useState, useEffect, useCallback } from "react";
import TableUser from "./TableUser";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalViewUser from "./ModalViewUser";
import ModalDeleteUser from "./ModalDeleteUser";
import TableUserPaginate from "./TableUserPaginate";
const participantApi = "http://localhost:4000/participant";
let dataUser = [];

const ManageUser = (props) => {
  // let idView;
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [showModalUpdateUser, setShowModalUpdateUser] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [dataUpdateUser, setDataUpdateUser] = useState({});
  const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);
  const [listUsers, setListUsers] = useState(dataUser);
  const [idUser, setIdUser] = useState();
  const [deleteUser, setDeleteUser] = useState({});
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

  const handleClickBtnUpdate = useCallback((userUpdate) => {
    setShowModalUpdateUser(true);
    setDataUpdateUser(userUpdate);
    setIdUser(userUpdate.id);
  }, []);

  const handleView = useCallback((user) => {
    setShowModalView(true);
    setDataUpdateUser(user);
    setIdUser(user.id);
  }, []);

  const handleDeleteUser = useCallback((user) => {
    setShowModalDeleteUser(true);
    setDeleteUser(user);
  }, []);
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
          {/* <TableUser
            listUsers={listUsers}
            handleClickBtnUpdate={handleClickBtnUpdate}
            handleView={handleView}
            handleDeleteUser={handleDeleteUser}
          /> */}

          <TableUserPaginate
            listUsers={listUsers}
            usersPerPage={+5}
            handleClickBtnUpdate={handleClickBtnUpdate}
            handleView={handleView}
            handleDeleteUser={handleDeleteUser}
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

        <ModalViewUser
          show={showModalView}
          setShow={setShowModalView}
          dataUser={dataUpdateUser}
          idUser={idUser}
          fetchDataUser={fetchDataUser}
        />

        <ModalDeleteUser
          show={showModalDeleteUser}
          setShow={setShowModalDeleteUser}
          deleteUser={deleteUser}
          listUsers={listUsers}
          setListUsers={setListUsers}
        />
      </div>
    </div>
  );
};

export default ManageUser;
