import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import GoogleMapReact from 'google-map-react';

//Services
import { emailService } from "../services/emails.service";
import { showErrorMsg } from "../services/event-bus.service";
import { useParams } from "react-router";

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


    if (!email) return <div>Loading..</div>
    return (
        <section className="email-details">
            <span className="date">{new Date(email.sentAt).toLocaleDateString()}</span>
            <h1>{email.subject}</h1>
            <h5>{email.from}</h5>
            <p>{email.body}</p>
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
            <Link to={`/emails/${folderName}`}>Go back</Link>
        </section>
    )
}
