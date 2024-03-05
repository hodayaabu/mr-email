import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
// import GoogleMapReact from 'google-map-react';

//Services
import { emailService } from "../services/emails.service";
import { showErrorMsg } from "../services/event-bus.service";

//Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import { yellow } from "@mui/material/colors";

export function EmailDetails({ emailId }) {
    const [email, setEmail] = useState(null)
    const { folderName } = useParams()

    useEffect(() => {
        loadEmail()
    }, [emailId])

    async function loadEmail() {
        try {
            let email = await emailService.getById(emailId)
            setEmail(email)
            email = { ...email, isRead: true }
            await emailService.save(email)
        } catch (err) {
            showErrorMsg('Had issues loading email');
            console.log('Had issues loading email', err);
        }
    }

    async function onUpdateEmail(email) {
        try {
            await emailService.save(email);
            setEmail(email)
        } catch (err) {
            console.log('Had issues updating email', err);
            showErrorMsg('Had issues updating email');
        }
    }

    function onToggle(field) {
        const newEmail = {
            ...email,
            [field]: !email[field]
        }
        onUpdateEmail(newEmail)
    }

    if (!email) return <div>Loading..</div>
    return (
        <section className="email-details">
            <div className="email-header">

                <Link className="action-btn" to={`/emails/${folderName}`}><ArrowBackIcon /></Link>

                <span className="action-btn" onClick={() => onToggle('isStarred')}>
                    {email.isStarred ? (
                        <StarIcon fontSize="medium" sx={{ color: yellow[500] }} />) : (
                        <StarBorderIcon fontSize="medium" />
                    )}
                </span>

                <span className="is-read-icon action-btn" onClick={() => onToggle('isRead')}>
                    {email.isRead ? <DraftsOutlinedIcon fontSize="medium" /> : <MarkunreadOutlinedIcon fontSize="medium" />}
                </span>

            </div>

            <h1 className="email-details-subject">{email.subject}</h1>

            <div className="sub-header">
                <div>
                    <p className="email-details-from-name">{email.from.split('@')[0]}</p>
                    <p className="email-details-from"> {email.from}  </p>
                </div>
                <span className="email-details-date">{new Date(email.sentAt).toLocaleDateString()}</span>
            </div>


            <p className="email-details-body">{email.body}</p>

            {/* {email.location &&
                <div className="map">
                    <div style={{ height: '150px', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "AIzaSyCju_hmhNCmyKS7cwa8YtAjNkO7ZPz4XmU" }}
                            center={{ lat: email.location.lat, lng: email.location.lng }}
                            defaultZoom={16}
                        />
                    </div>
                </div>} */}

        </section>
    )
}
