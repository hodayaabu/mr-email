import { Link } from "react-router-dom";

export function EmailPreview({ email }) {
    const { id, from, subject, body, isRead, sentAt } = email

    const dynClass = isRead ? 'is-read' : 'un-read'

    return <article className={"email-preview"}>
        <Link to={`/email/${id}`}>
            <p className={"from " + dynClass}>{from.split('@')[0]}</p>
            <p className={"subject " + dynClass}>{subject}</p>
            <p className="body">- {body.split('.')[0]}</p>
            <span className="date">{new Date(sentAt).toLocaleDateString()}</span>

        </Link>
    </article>

}
