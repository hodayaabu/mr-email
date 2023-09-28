import { Link, useParams } from "react-router-dom";
import PropTypes from 'prop-types'

//services
import { emailService } from '../services/emails.service';

//icons
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { yellow } from "@mui/material/colors";

export function EmailPreview({ email, onRemove, onUpdateEmail }) {
    const { folderName } = useParams()
    const { id, from, to, subject, body, isRead, isStarred, isDraft, sentAt } = email

    const readUaRead = isRead ? 'is-read' : 'un-read'
    const directTo = isDraft ? `/emails/${folderName}/compose/${id}` : `/emails/${folderName}/${id}`

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
                <StarIcon fontSize="small" sx={{ color: yellow[500] }} />) : (
                <StarBorderIcon fontSize="small" />
            )}
        </span>
        <Link className="wrapper-link" to={directTo}>
            {isDraft ? (
                <p className="draft">Draft, <span> {to && to.split('@')[0]}</span></p>
            ) : (
                <p className={"from " + readUaRead}>{from.split('@')[0]}</p>
            )}
            <p className={"subject " + readUaRead}>{subject || "(no subject)"}</p>
            <p className="body">- {body.split('.')[0]}</p>
            <span className="date">{new Date(sentAt).toLocaleDateString()}</span>
        </Link>
        <p className="email-actions">
            <span onClick={() => onRemove(email.id)}>
                <DeleteIcon fontSize="small" />
            </span>
            <span className="is-read-icon" onClick={() => onToggle('isRead')}>
                {isRead ? <DraftsOutlinedIcon fontSize="small" /> : <MarkunreadOutlinedIcon fontSize="small" />}
            </span>
        </p>

    </article>

}

EmailPreview.propTypes = {
    email: emailService.getEmailShape(),
    onRemove: PropTypes.func,
    onUpdateEmail: PropTypes.func
}

