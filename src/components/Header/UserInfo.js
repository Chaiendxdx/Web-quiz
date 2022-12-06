import { useState } from "react";
import { FcPlus } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
const UserInfo = (props) => {
  let account = useSelector((state) => state.user.account);
  const [image, setImage] = useState(account.userImage);
  const [previewImg, setPreviewImg] = useState("");
  const [email, setEmail] = useState(account.email);
  // const [password, setPassword] = useState("");

  const [username, setUsername] = useState(account.username);

  const [role, setRole] = useState(account.role);
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
  const handleUpdateUser = () => {};
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
      <Button variant="warning" onClick={() => handleUpdateUser()}>
        Update
      </Button>
    </>
  );
};

export default UserInfo;
