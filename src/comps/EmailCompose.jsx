import { useState } from "react"
import { emailService } from "../services/emails.service"
import { useNavigate, useOutletContext } from "react-router"
import { Link } from "react-router-dom"

export function EmailCompose() {
    const [newEmail, setNewEmail] = useState(emailService.createEmail())
    const { onSendEmail } = useOutletContext()
    const navigate = useNavigate()


    function handleChange(ev) {
        let { value, name: field } = ev.target
        setNewEmail((prevNewEmail) => ({ ...prevNewEmail, [field]: value }))
    }

    function handleSendEmail(ev) {
        ev.preventDefault()
        onSendEmail(newEmail)
        navigate('/emails')
        setNewEmail(emailService.createEmail())
    }

    return <>
        <div className="container">


            <form className="modal-content" onSubmit={handleSendEmail}>

                <div className="modal-header">
                    <Link to='/emails'>
                        <button className="btn-close">x</button >
                    </Link>
                    <p>New Message</p>
                </div>

                <div className="modal-body">
                    <label htmlFor="to">To:</label>
                    <input className="modal-to" type="text" name="to" value={newEmail.to} placeholder="memo@memo.com" onChange={handleChange} />
                    <section className="modal-section">
                        <label htmlFor="subject">Subject:</label>
                        <input className="modal-subject" id="subject" type="text" name="subject" value={newEmail.subject} onChange={handleChange} />
                    </section>

                    <section className="modal-section">
                        <textarea className="modal-description" id="body" type="text" name="body" value={newEmail.body} onChange={handleChange} />
                    </section>
                </div>

                <div className="modal-footer">
                    <button className="btn-send">send</button>
                </div>
            </form>
        </div >


    </>
}