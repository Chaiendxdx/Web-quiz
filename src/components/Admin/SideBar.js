import "./SideBar.scss";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { FaGem } from "react-icons/fa";
import { useTranslation, Trans } from "react-i18next";
import sidebarBg from "../../assets/bg1.jpg";
import { SiReactivex } from "react-icons/si";
import { MdDashboard } from "react-icons/md";

const SideBar = (props) => {
  const { image, collapsed, toggled, handleToggleSidebar } = props;
  const { t } = useTranslation();
  return (
    <>
      <ProSidebar
        image={sidebarBg}
        collapsed={collapsed}
        toggled={toggled}
        breakPoint="md"
        onToggle={handleToggleSidebar}
      >
        <SidebarHeader>
          <a className="quiz-web-link" href="/" target="_parent">
            <div
              style={{
                padding: "24px",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: 14,
                letterSpacing: "1px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <SiReactivex
                size={"3em"}
                color={"#00bfff"}
                style={{ margin: "0 15px 0 0" }}
              />
              <span>Quiz Web</span>
            </div>
          </a>
        </SidebarHeader>

        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem
              icon={<MdDashboard />}
              suffix={<span className="badge red">{t("sidebar.main")}</span>}
            >
              {t("sidebar.dashboard")}
              <Link to="/admins" />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <SubMenu icon={<FaGem />} title={t("sidebar.features")}>
              <MenuItem>
                {t("sidebar.manageUser")}
                <Link to="/admins/manage-users" />
              </MenuItem>
              <MenuItem>
                {t("sidebar.manageQuiz")}
                <Link to="/admins/manage-quizzes" />
              </MenuItem>
              <MenuItem>
                {t("sidebar.manageQuestion")}
                <Link to="/admins/manage-questions" />
              </MenuItem>
            </SubMenu>
          </Menu>
        </SidebarContent>

        <SidebarFooter style={{ textAlign: "center" }}>
          <div
            className="sidebar-btn-wrapper"
            style={{
              padding: "20px 24px",
            }}
          >
            <a
              href="/"
              target="_blank"
              className="sidebar-btn"
              rel="noopener noreferrer"
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                &#169; Kien Hoang
              </span>
            </a>
          </div>
        </SidebarFooter>
      </ProSidebar>
    </>
  );
};

export default SideBar;
