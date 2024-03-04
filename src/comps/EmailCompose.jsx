import { useState, useEffect } from "react"
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router"
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

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
    const [coordinates, setCoordinates] = useState({ lat: 32, lng: 33 })
    const [searchParams, setSearchParams] = useSearchParams()
    const [viewMode, setViewMode] = useState('normal')
    const [isOpen, onToggle] = useToggle()

    const to = searchParams.get('to');
    const subject = searchParams.get('subject');

    const { emailId, folderName } = useParams();
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

    function handleSendEmail() {
        const emailToSend = { ...newEmail, isDraft: false, location: coordinates }
        onSendEmail(emailToSend)
        setSearchParams(emailService.getFilterFromParams(searchParams))
        navigate(`/emails/${folderName}`)
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
        setCoordinates({ lat, lng })
    }

    const composeSchema = Yup.object().shape({
        to: Yup.string()
            .required('Required')
            .min(2, 'Too Short!')
            .email('Invalid email'),
        subject: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!'),
        body: Yup.string()
    });

    return <>
        <Formik
            initialValues={newEmail}
            validationSchema={composeSchema}
        >
            {({ errors, touched }) => {
                console.log(errors, touched, newEmail)

                return <Form className={"compose-main-container " + viewMode} onSubmit={handleSendEmail}>

                    <div className="new-message">
                        <p className={"new-message-title-" + viewMode} >New Message</p>

                        <div className="compose-actions">
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
                    </div>

                    <div className="new-message-recipients">
                        <label htmlFor="to">Recipients: </label>

                        <Field
                            autoFocus={false}
                            className="input-recipients"
                            name="to" type="email"
                            id="to"
                            value={newEmail.to}
                            onChange={handleChange}
                        />

                        {errors.to && <div className="error">{errors.to}</div>}
                    </div>
                    <div className="new-message-subject">
                        <label htmlFor="subject">Subject: </label>
                        <Field autoFocus={false} className="input-subject" name="subject" id="subject" value={newEmail.subject} onChange={handleChange} />
                        {errors.subject && touched.subject && (
                            <div className="error">{errors.to}</div>
                        )}
                    </div>

                    <div className="body-input-container">
                        <Field className="body-input" name="body" value={newEmail.body} onChange={handleChange} />
                        {(errors.body && touched.body) && (
                            <div className="error">{errors.body}</div>
                        )}
                    </div>
                    {isOpen &&
                        <div className="map">
                            <UserLocation getUserLocation={getUserLocation} />
                        </div>
                    }
                    <p onClick={onToggle} className="add-location" title="add location"><AddLocationOutlinedIcon /></p>
                    <button type="submit" className="new-message-send-btn">Send</button>


                </Form>
            }
            }

        </Formik>
    </>
}