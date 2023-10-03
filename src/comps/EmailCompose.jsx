import { useState, useEffect } from "react"
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router"

//Services
import { emailService } from "../services/emails.service"
import { utilService } from "../services/util.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service";
import { useSearchParams } from "react-router-dom";

//icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import MinimizeOutlinedIcon from '@mui/icons-material/MinimizeOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';
import { UserLocation } from "./UserLocation";
import { useToggle } from "../customHooks/useToggle";

export function EmailCompose() {
    const [newEmail, setNewEmail] = useState(emailService.createEmail())
    const [userLocation, setUserLocation] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [viewMode, setViewMode] = useState('normal')
    const [isOpen, onToggle] = useToggle()
    console.log(userLocation);
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
        const emailToSend = { ...newEmail, isDraft: false, location: userLocation }
        onSendEmail(emailToSend)
        navigate(utilService.getContainingFolder(location.pathname))
        setNewEmail(emailService.createEmail())
        setSearchParams(null)
        setUserLocation(null)
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

    function getUserLocation({ lat, lng }) {
        setUserLocation({ lat, lng })
    }
    // setTimeout(() => {
    //     onSaveDraft()
    // }, 5000);


    return <>
        <form className={"compose-main-container " + viewMode} onSubmit={handleSendEmail}>

            <div className="new-message">
                <p className={"new-message-title-" + viewMode} >New Message</p>

                <p onClick={() => onChangeViewMode('minimized')}
                    className={"new-message-minimized"}>
                    <span> <MinimizeOutlinedIcon fontSize="small" title="minimized" /></span>

                </p >

                <p onClick={() => onChangeViewMode('fullscreen')}
                    className="new-message-fullscreen">
                    {viewMode === 'fullscreen' ? (
                        <CloseFullscreenOutlinedIcon fontSize="small" title="close-fullscreen" />
                    ) : (
                        <OpenInFullOutlinedIcon fontSize="small" title="fullscreen" />
                    )}
                </p >

                <p onClick={handleClose}
                    className="new-message-close-btn">
                    <CloseOutlinedIcon fontSize="small" title="save & close" />
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
            {isOpen &&
                <div className="map">
                    <UserLocation getUserLocation={getUserLocation} />
                </div>
            }
            <p onClick={onToggle} className="add-location" title="add location"><AddLocationOutlinedIcon /></p>
            <button className="new-message-send-btn">Send</button>


        </form>
    </>
}