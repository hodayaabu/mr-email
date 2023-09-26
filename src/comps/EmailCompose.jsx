import { useState, useEffect } from "react"
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router"

//Services
import { emailService } from "../services/emails.service"
import { utilService } from "../services/util.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service";
import { useSearchParams } from "react-router-dom";

export function EmailCompose() {
    const [newEmail, setNewEmail] = useState(emailService.createEmail())
    const [searchParams, setSearchParams] = useSearchParams()

    const to = searchParams.get('to');
    const subject = searchParams.get('subject');

    const { emailId } = useParams();
    const { onSendEmail } = useOutletContext()

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        loadEmail()
    }, [])

    async function loadEmail() {
        if (emailId) {
            try {
                const email = await emailService.getById(emailId)
                setNewEmail(email)
            } catch (err) {
                handleClose()
                showErrorMsg('Had issues loading draft');
                console.log('Had issues loading draft', err);
            }
        }
        if (to && subject) {
            const email = { ...newEmail, to, subject }
            setNewEmail(email)
        }
    }

    function handleClose() {
        navigate(utilService.getContainingFolder(location.pathname))
    }

    function handleChange(ev) {
        let { value, name: field } = ev.target
        setNewEmail((prevNewEmail) => ({ ...prevNewEmail, [field]: value }))
    }

    function handleSendEmail(ev) {
        ev.preventDefault()
        const emailToSend = { ...newEmail, isDraft: false }
        onSendEmail(emailToSend)
        handleClose()
        setNewEmail(emailService.createEmail())
        searchParams(null)
        showSuccessMsg('Email sent successfully')
    }

    function onSaveDraft() {
        const draft = { ...newEmail, isDraft: true }
        onSendEmail(draft)
        showSuccessMsg('Saved as a draft')
        handleClose()
        setNewEmail(emailService.createEmail())

    }

    // setTimeout(() => {
    //     onSaveDraft()
    // }, 5000);


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
                    <button onClick={onSaveDraft} className="btn-save-draft">draft</button>
                </div>
            </form>
        </div >


    </>
}