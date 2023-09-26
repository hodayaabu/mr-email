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
    const [viewMode, setViewMode] = useState('normal')

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
        onSaveDraft()
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
        navigate(utilService.getContainingFolder(location.pathname))
        setNewEmail(emailService.createEmail())
        setSearchParams(null)
        showSuccessMsg('Email sent successfully')
    }

    function onSaveDraft() {
        const draft = { ...newEmail, isDraft: true }
        onSendEmail(draft)
        showSuccessMsg('Saved as a draft')
        setNewEmail(emailService.createEmail())
    }

    function onChangeViewMode(newViewMode) {

        if (viewMode === newViewMode) {
            setViewMode('normal')
        } else {
            setViewMode(newViewMode)
        }
    }

    // setTimeout(() => {
    //     onSaveDraft()
    // }, 5000);


    return <>
        <form className={"compose-main-container " + viewMode} onSubmit={handleSendEmail}>

            <div className="new-message">
                <p className={"new-message-title-" + viewMode} >New Message</p>

                <p onClick={() => onChangeViewMode('minimized')}
                    className="new-message-minimized">
                    {viewMode === 'minimized' ? (
                        <img src='../../public/imgs/minimized.png' alt="minimized" title="minimized" />
                    ) : (
                        <img src='../../public/imgs/minimize.png' alt="minimize" title="minimize" />
                    )}
                </p >

                <p onClick={() => onChangeViewMode('fullscreen')}
                    className="new-message-fullscreen">
                    {viewMode === 'fullscreen' ? (
                        <img src='../../public/imgs/close-fullscreen.png' alt="close-fullscreen" title="close-fullscreen" />
                    ) : (
                        <img src='../../public/imgs/fullscreen.png' alt="full-screen" title="full-screen" />
                    )}
                </p >

                <p onClick={handleClose}
                    className="new-message-close-btn">
                    <img src='../../public/imgs/close.png' alt="save & close" title="save & close" />
                </p >
            </div>

            <div className="new-message-recipients">
                <label htmlFor="to">Recipients: </label>
                <input className="input-recipients" type="email" name="to" value={newEmail.to} onChange={handleChange} />
            </div>

            <div className="new-message-subject">
                <label htmlFor="subject">Subject: </label>
                <input className="input-subject" id="subject" type="text" name="subject" value={newEmail.subject} onChange={handleChange} />
            </div>

            <div className="body-input-container">
                <input className="body-input" id="body" type="text" name="body" value={newEmail.body} onChange={handleChange} />
            </div>

            <button className="new-message-send-btn">Send</button>

        </form>
    </>
}