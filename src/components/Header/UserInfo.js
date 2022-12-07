import { useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import NProgress from "nprogress";
import Button from "react-bootstrap/Button";
import { update } from "../../redux/action/userAction";
const participantApi = "http://localhost:4000/participant";
const UserInfo = (props) => {
  const { account } = props;
  const dispatch = useDispatch();
  // const [dataUsers, setDataUsers] = useState();
  let dataUsers = {};
  const [image, setImage] = useState(account.userImage);
  const [previewImg, setPreviewImg] = useState(account.userImage);
  const [email, setEmail] = useState(account.email);
  // const [password, setPassword] = useState("");

  const [username, setUsername] = useState(account.username);

  const [role, setRole] = useState(account.role);
  let dataUser = {
    // email: email,
    // password: password,
    username: username,
    // role: role,
    userImage: image,
  };
  // useEffect(() => {
  //   if (!_.isEmpty(dataUpdateUser)) {
  //     setEmail(dataUpdateUser.email);
  //     setUsername(dataUpdateUser.username);
  //     setRole(dataUpdateUser.role);
  //     setPreviewImg(dataUpdateUser.userImage);
  //   }
  // }, [dataUpdateUser]);

  const updateParticipant = async (dataUser, id) => {
    const options = {
      method: "PATCH",
      body: JSON.stringify(dataUser),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(participantApi + "/" + id, options);
    const data = await res.json();
    console.log(data);
    NProgress.done();
    // setDataUsers(data);
    dataUsers = { ...data };
    if (res.status === 200) {
      toast.success("Update account succeed!");
    } else {
      toast.error("Fail to update account!");
    }
  };
  function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handleUpload = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewImg(URL.createObjectURL(e.target.files[0]));
      encodeImageFileAsURL(e.target);
    }
  };
  const handleUpdateUser = async (data, id) => {
    await updateParticipant(data, id);
    dispatch(update(dataUsers));
  };
  return (
    <>
      <form className="row g-3 my-3">
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            onChange={(e) => setRole(e.target.value)}
            value={role}
            disabled
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="col-md-12">
          <label className="form-label label-upload" htmlFor="labelUpload">
            <FcPlus />
            Upload File Image
          </label>
          <input
            type="file"
            hidden
            id="labelUpload"
            onChange={(e) => handleUpload(e)}
          />
        </div>

        <div className="col-md-12 img-preview">
          {previewImg ? (
            <img src={previewImg} alt="" />
          ) : (
            <span>Preview Image</span>
          )}
        </div>
      </form>
      <Button
        variant="warning"
        onClick={() => handleUpdateUser(dataUser, account.id)}
      >
        Update
      </Button>
    </>
  );
};

export default UserInfo;
