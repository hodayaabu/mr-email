import { Link } from "react-router-dom";

import star from "../../public/imgs/star_baseline.png";
import fillStar from "../../public/imgs/star_fil.png";

export function EmailPreview({ email, onUpdateEmail }) {
    const { id, from, subject, body, isRead, isStarred, sentAt } = email

    const readUaRead = isRead ? 'is-read' : 'un-read'

    function onToggle(field) {
        const newEmail = {
            ...email,
            [field]: !email[field]
        }
        onUpdateEmail(newEmail)
    }

    return <article className={"email-preview " + readUaRead}>
        <input type="checkbox" name="1" className="email-checkbox" />
        <span onClick={() => onToggle('isStarred')}>
            {isStarred ? (
                <img src={fillStar} />
            ) : (
                <img className="star-img" src={star} />
            )}
        </span>
        <Link className="wrapper-link" to={`/email/${id}`}>
            <p className={"from " + readUaRead}>{from.split('@')[0]}</p>
            <p className={"subject " + readUaRead}>{subject}</p>
            <p className="body">- {body.split('.')[0]}</p>
            <span className="date">{new Date(sentAt).toLocaleDateString()}</span>
        </Link>
        <span onClick={() => onToggle('isRead')}>
            {isRead ? " 📭" : " 📬"}
        </span>
    </article>

}
