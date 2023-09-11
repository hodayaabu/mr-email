import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { emailService } from "../services/emails.service";
import { Link } from "react-router-dom";

export function EmailDetails() {
    const [email, setEmail] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadEmail()
    }, [params.emailId])

    async function loadEmail() {
        try {
            let email = await emailService.getById(params.emailId)
            email = { ...email, isRead: true }
            await emailService.save(email)
            setEmail(email)
        } catch (err) {
            navigate('/emails')
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
            <Link to="/emails">Go back</Link>

        </section>
    )
}
