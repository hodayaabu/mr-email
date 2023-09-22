import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const buttons = [
  { id: 1, name: "Inbox", img: "../../public/imgs/inbox.png" },
  { id: 2, name: "Starred", img: "../../public/imgs/star_baseline.png" },
  { id: 3, name: "Sent", img: "../../public/imgs/sent.png" },
  { id: 4, name: "Drafts", img: "../../public/imgs/draft.png" },
  { id: 5, name: "Trash", img: "../../public/imgs/trash.png" },
];

export function EmailFolders({ emails }) {
  const [active, setActive] = useState();

  const unreadEmailsCount = emails.filter(
    (email) => email.isRead !== true
  ).length;

  function setActiveButton(id) {
    setActive(id);
  }

  useEffect(() => {
    setActive(1);
  }, []);

  return (
    <div>
      <Link to={"/emails/newEmail"} className="compose-btn">
        <span className="compose-img--span">
          <img className="compose-img" src="../../public/imgs/Pencil.png" />
        </span>
        Compose
      </Link>

      {buttons.map((button) => (
        <button
          key={button.id}
          className={`side-panel-btn ${active === button.id ? "active" : ""}`}
          onClick={() => setActiveButton(button.id)}
        >
          <img src={button.img} alt={button.name} />
          <p className={active === button.id ? "active" : ""}>
            {button.name}
            <span className="emails-count">
              {button.name === "Inbox" && unreadEmailsCount > 0
                ? unreadEmailsCount
                : ""}
            </span>
          </p>
        </button>
      ))}
    </div>
  );
}
