import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router"
import GoogleMapReact from 'google-map-react';

//Services
import { utilService } from "../services/util.service";
import { emailService } from "../services/emails.service";
import { showErrorMsg } from "../services/event-bus.service";

export function EmailDetails() {
    const [email, setEmail] = useState(null)
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        loadEmail()
    }, [params.emailId])

    function handleGoBack() {
        navigate(utilService.getContainingFolder(location.pathname))
    }

    async function loadEmail() {
        try {
            let email = await emailService.getById(params.emailId)
            email = { ...email, isRead: true }
            await emailService.save(email)
            setEmail(email)
        } catch (err) {
            handleGoBack()
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
            {email.location &&
                <div className="map">
                    <div style={{ height: '150px', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "AIzaSyCju_hmhNCmyKS7cwa8YtAjNkO7ZPz4XmU" }}
                            center={{ lat: email.location.lat, lng: email.location.lng }}
                            defaultZoom={16}
                        />
                    </div>
                </div>}
            <button onClick={handleGoBack}>Go back</button>

        </section>
    )
}
