import { useState } from "react"
import { emailService } from "../services/emails.service"
import { useLocation, useNavigate, useOutletContext } from "react-router"
import { utilService } from "../services/util.service.js"

export function EmailCompose() {
    const [newEmail, setNewEmail] = useState(emailService.createEmail())
    const { onSendEmail } = useOutletContext()
    const location = useLocation()
    const navigate = useNavigate()

    function handleClose() {
        navigate(utilService.getContainingFolder(location.pathname))
    }

    function handleChange(ev) {
        let { value, name: field } = ev.target
        setNewEmail((prevNewEmail) => ({ ...prevNewEmail, [field]: value }))
    }

    function handleSendEmail(ev) {
        ev.preventDefault()
        onSendEmail(newEmail)
        handleClose()
        setNewEmail(emailService.createEmail())
    }



    return <>
        <div className="container">


            <form className="modal-content" onSubmit={handleSendEmail}>

                <div className="modal-header">
                    <button onClick={handleClose} className="btn-close">x</button >
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