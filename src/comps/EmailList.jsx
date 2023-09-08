import { EmailPreview } from "./EmailPreview";


export function EmailList({ emails, onRemove }) {

    return (
        <ul className="email-list">
            {
                emails.map(email => <li className="list-item" key={email.id}>
                    <EmailPreview email={email} />
                    <p className="email-actions">
                        <button onClick={() => onRemove(email.id)}>X</button>
                    </p>
                </li>)
            }
        </ul>
    )
}
