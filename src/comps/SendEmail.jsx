import { useState } from "react"
import { Modal } from 'react-bootstrap';
import { emailService } from "../services/emails.service"

export function SendEmail({ onSendEmail }) {
    const [newEmail, setNewEmail] = useState(emailService.createEmail())
    const [show, setShow] = useState(false)

    function handleOpen() {
        setShow(true)
    }

    function handleClose() {
        setShow(false)
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

            <button className="new-email" onClick={handleOpen}>New Email</button>

            <Modal className="modal-content" show={show}>

                <div className="modal-header">
                    <button className="btn-close" onClick={handleClose}>x</button >
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
                    <button className="btn-send" onClick={handleSendEmail}>send</button>
                </div>
            </Modal>
        </div >


    </>
}