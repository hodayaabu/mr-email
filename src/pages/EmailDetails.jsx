import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router"

import { utilService } from "../services/util.service";
import { emailService } from "../services/emails.service";

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
            <button onClick={handleGoBack}>Go back</button>

        </section>
    )
}
