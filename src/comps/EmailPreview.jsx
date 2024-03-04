import { useParams, Link } from 'react-router-dom';
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

    function onToggle(field) {
        const newEmail = {
            ...email,
            [field]: !email[field]
        }
        onUpdateEmail(newEmail)
    }

    const { id, from, to, subject, body, isRead, isStarred, isDraft, sentAt } = email
    const classNameRead = isRead ? 'is-read' : 'un-read'
    const directTo = isDraft ? `/emails/${folderName}/compose/${id}` : `/emails/${folderName}?emailId=${id}`

    return (
        <article className={"email-preview " + classNameRead} >

            <div className='select-starr'>
                <input type="checkbox" name="1" className="email-checkbox" />

                <span onClick={() => onToggle('isStarred')}>
                    {isStarred ? (
                        <StarIcon fontSize="x-small" sx={{ color: yellow[500] }} />) : (
                        <StarBorderIcon fontSize="x-small" />
                    )}
                </span>
            </div>

            <Link to={directTo}>
                <section className="wrapper" >

                    {isDraft ? (
                        <p className="draft" title='Edit Draft'>Draft, <span> {to && to.split('@')[0]}</span></p>
                    ) : (
                        <p className={"from " + classNameRead}>{from.split('@')[0]}</p>
                    )}

                    <div>
                        <p className={"subject " + classNameRead}>{subject || "(no subject)"}</p>
                        <p className="body">- {body}</p>
                    </div>

                    <span className="date">{new Date(sentAt).toLocaleDateString()}</span>

                </section>
            </Link>

            <p className="email-actions">
                <span onClick={() => onRemove(id)}>
                    <DeleteIcon fontSize="small" />
                </span>

                <span className="is-read-icon" onClick={() => onToggle('isRead')}>
                    {isRead ? <DraftsOutlinedIcon fontSize="small" /> : <MarkunreadOutlinedIcon fontSize="small" />}
                </span>
            </p>

        </article>
    )
}

EmailPreview.propTypes = {
    email: emailService.getEmailShape(),
    onRemove: PropTypes.func,
    onUpdateEmail: PropTypes.func
}

