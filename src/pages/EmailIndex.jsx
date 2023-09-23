import { useEffect, useState } from "react"

import { emailService } from "../services/emails.service";
import { EmailList } from "../comps/EmailList";
import { EmailFilter } from "../comps/EmailFilter";
import { useParams, Outlet, useNavigate } from "react-router";
import { EmailFolders } from "../comps/EmailFolders";

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter())
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadEmails()
    }, [filterBy])

    useEffect(() => {

        // filter by folder
        setFilterBy((prevFilterBy) => ({
            ...prevFilterBy,
            folder: params.folderName,
        }))
    }, [params])

    function onSetFilter(fieldsToUpdate) {
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...fieldsToUpdate }))
    }

    function onComposeClick() {
        navigate(`/emails/${params.folderName}/newEmail`)
    }

    async function loadEmails() {
        try {
            const emails = await emailService.query(filterBy)
            setEmails(emails)
        } catch (err) {
            console.log('Had issues loading emails', err);
        }
    }

    async function onRemoveEmail(emailId) {
        try {
            let email = await emailService.getById(emailId)

            if (email.removedAt) {
                await emailService.remove(emailId)
                setEmails((prevEmails) => prevEmails.filter(email => email.id !== emailId))
            }
            const newEmail = {
                ...email,
                removedAt: Date.now()
            }
            await emailService.save(newEmail);
            setEmails((prevEmails) => prevEmails.filter(email => email.id !== emailId))
        } catch (err) {
            console.log('Had issues remove email to bin emails', err);
        }
    }

    async function onSendEmail(newEmail) {
        try {
            await emailService.save(newEmail)
            await loadEmails()
        } catch (err) {
            console.log('Had issues sending email', err);
        }
    }

    async function onUpdateEmail(email) {
        try {
            const updatedEmail = await emailService.save(email);
            setEmails(prevEmails => prevEmails.map(email => email.id === updatedEmail.id ? updatedEmail : email))
        } catch (err) {
            console.log('Had issues updating email', err);
        }
    }

    if (!emails) return <div>Loading..</div>
    return (
        <div className="container">
            <EmailFilter onSetFilter={onSetFilter} filterBy={filterBy} />
            <EmailFolders onComposeClick={onComposeClick} emails={emails} />
            <EmailList emails={emails} onRemove={onRemoveEmail} onUpdateEmail={onUpdateEmail} />
            <Outlet context={{ onSendEmail }} />
        </div>
    )
}
