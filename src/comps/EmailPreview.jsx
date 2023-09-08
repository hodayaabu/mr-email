import { Link } from "react-router-dom";

export function EmailPreview({ email }) {
    const { id, subject, body, isRead } = email

    const dynClass = isRead ? "is-read" : null

    return <article className={"email-preview " + dynClass}>
        <Link to={`/email/${id}`}>
            <p className="from">{email.from}</p>
            <h2 className="subject">{subject}</h2>
            <p className="body">{body}</p>
        </Link>
    </article>

}
