import PropTypes from 'prop-types'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//icons
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export function EmailFolders({ onComposeClick, unreadCount, draftCount }) {
  const [active, setActive] = useState();
  const navigate = useNavigate()

  const folders = [
    { id: 1, name: "Inbox", icon: <InboxOutlinedIcon fontSize="small" />, count: unreadCount },
    { id: 2, name: "Starred", icon: <StarBorderOutlinedIcon fontSize="small" /> },
    { id: 3, name: "Sent", icon: <SendOutlinedIcon fontSize="small" /> },
    { id: 4, name: "Drafts", icon: <InsertDriveFileOutlinedIcon fontSize="small" />, count: draftCount },
    { id: 5, name: "Trash", icon: <DeleteOutlineIcon fontSize="small" /> },
  ];

  function setActiveFolder(name) {
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

      {folders.map((folder) => (
        <button
          key={folder.id}
          className={`side-panel-btn ${active === folder.name ? "active" : ""}`}
          onClick={() => setActiveFolder(folder.name)}
        >
          {folder.icon}

          <p className={active === folder.name ? "active" : ""}>
            {folder.name}

            <span className="emails-count">
              {folder.count
                ? folder.count
                : ""}
            </span>
          </p>
        </button>
      ))}
    </div>
  );
}

EmailFolders.propTypes = {
  onComposeClick: PropTypes.func,
  unreadCount: PropTypes.number,
  draftCount: PropTypes.number
}
