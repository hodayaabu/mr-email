import { EmailPreview } from "./EmailPreview";

//icon

export function EmailList({ emails, onRemove, onUpdateEmail }) {

    return (
        <ul className="email-list">
            {
                emails.map(email => <li className="list-item" key={email.id}>
                    <EmailPreview email={email} onRemove={onRemove} onUpdateEmail={onUpdateEmail} />
                </li>)
            }
        </ul>
    )
}
