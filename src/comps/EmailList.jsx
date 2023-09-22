import { EmailPreview } from "./EmailPreview";

import trash from "../../public/imgs/trash.png";


export function EmailList({ emails, onRemove, onUpdateEmail }) {

    return (
        <ul className="email-list">
            {
                emails.map(email => <li className="list-item" key={email.id}>
                    <EmailPreview email={email} onUpdateEmail={onUpdateEmail} />
                    <p className="email-actions">
                        <span onClick={() => onRemove(email.id)}>
                            <img src={trash} />{" "}
                        </span>
                    </p>
                </li>)
            }
        </ul>
    )
}
