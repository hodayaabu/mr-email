import PropTypes from 'prop-types'

//components
import { EmailPreview } from "./EmailPreview";

//services
import { emailService } from '../services/emails.service';

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


EmailList.propTypes = {
    emails: PropTypes.arrayOf(emailService.getEmailShape()),
    onRemove: PropTypes.func,
    onUpdateEmail: PropTypes.func
}
