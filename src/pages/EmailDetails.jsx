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
            const email = await emailService.getById(params.emailId)
            setEmail(email)
        } catch (err) {
            navigate('/emails')
            console.log('Had issues loading email', err);
        }
    }

    if (!email) return <div>Loading..</div>
    return (
        <section className="email-details">
            <h1>{email.subject}</h1>
            <h5>{email.from}</h5>
            <p>{email.body}</p>
            <Link to="/emails">Go back</Link>

        </section>
    )
}
