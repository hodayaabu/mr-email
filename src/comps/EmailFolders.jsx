import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//icons
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export function EmailFolders({ emails, onComposeClick }) {
  const [active, setActive] = useState();
  const navigate = useNavigate()

  const unreadEmailsCount = emails.filter(
    (email) => email.isRead !== true
  ).length;

  const draftsCount = emails.filter(
    (email) => email.isDraft
  ).length;

  const buttons = [
    { id: 1, name: "Inbox", icon: <InboxOutlinedIcon fontSize="small" />, count: unreadEmailsCount },
    { id: 2, name: "Starred", icon: <StarBorderOutlinedIcon fontSize="small" />, count: null },
    { id: 3, name: "Sent", icon: <SendOutlinedIcon fontSize="small" />, count: null },
    { id: 4, name: "Drafts", icon: <InsertDriveFileOutlinedIcon fontSize="small" />, count: draftsCount },
    { id: 5, name: "Trash", icon: <DeleteOutlineIcon fontSize="small" />, count: null },
  ];


  function setActiveButton(name) {
    navigate(`/emails/${name.toLowerCase()}`)
    setActive(name);
  }

  useEffect(() => {
    setActive("inbox");
  }, []);

  return (
    <div>
      <button onClick={onComposeClick} className="compose-btn">
        <CreateOutlinedIcon />
        Compose
      </button>

      {buttons.map((button) => (
        <button
          key={button.id}
          className={`side-panel-btn ${active === button.name ? "active" : ""}`}
          onClick={() => setActiveButton(button.name)}
        >
          {button.icon}
          <p className={active === button.name ? "active" : ""}>
            {button.name}
            <span className="emails-count">
              {/* {button.name === "Inbox" && unreadEmailsCount > 0
                ? unreadEmailsCount
                : ""} */}
              {button.count > 0 && button.count}
            </span>
          </p>
        </button>
      ))}
    </div>
  );
}
