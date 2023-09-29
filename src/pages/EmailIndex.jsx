import { useEffect, useState } from "react"
import { useParams, Outlet, useNavigate, useSearchParams } from "react-router-dom";

//services
import { emailService } from "../services/emails.service";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";

//components
import { Logo } from "../comps/Logo";
import { EmailList } from "../comps/EmailList";
import { EmailFilter } from "../comps/EmailFilter";
import { EmailFolders } from "../comps/EmailFolders";

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(emailService.getFilterFromParams(searchParams))
    const [unreadCount, setUnreadCount] = useState(0)
    const [draftCount, setDraftCount] = useState(0)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setSearchParams(filterBy)
        loadEmails()
    }, [filterBy])

    useEffect(() => {
        if (filterBy.folderName === params.folderName) return
        setFilterBy((prevFilterBy) => ({
            ...prevFilterBy,
            folderName: params.folderName,
        }))
    }, [params.folderName])

    function onSetFilter(fieldsToUpdate) {
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...fieldsToUpdate }))
    }

    function onComposeClick() {
        navigate(`/emails/${params.folderName}/compose`)
    }

    async function loadEmails() {
        try {
            const emails = await emailService.query(filterBy)
            const unreadCount = await emailService.getUnreadCount()
            const draftCount = await emailService.getDraftCount()

            setEmails(emails)
            setUnreadCount(unreadCount)
            setDraftCount(draftCount)
        } catch (err) {
            showErrorMsg('Had issues loading emails')
            console.log('Had issues loading emails', err);
        }
    }

    async function onRemoveEmail(emailId) {
        try {
            let email = await emailService.getById(emailId)

            if (email.removedAt) {
                await emailService.remove(emailId)
                setEmails((prevEmails) => prevEmails.filter(email => email.id !== emailId))
                showSuccessMsg('Successfully deleted')
            } else {
                const newEmail = {
                    ...email,
                    removedAt: Date.now()
                }
                await emailService.save(newEmail);
                setEmails((prevEmails) => prevEmails.filter(email => email.id !== emailId))
                showSuccessMsg('removed to bin')
            }
        } catch (err) {
            console.log('Had issues remove email to bin emails', err);
            showErrorMsg('Had issues remove email to bin emails');
        }
    }

    async function onSendEmail(newEmail) {
        try {
            await emailService.save(newEmail)
            await loadEmails()
        } catch (err) {
            console.log('Had issues sending email', err);
            showErrorMsg('Had issues sending email');
        }
    }

    async function onUpdateEmail(email) {
        try {
            const updatedEmail = await emailService.save(email);
            setEmails(prevEmails => prevEmails.map(email => email.id === updatedEmail.id ? updatedEmail : email))
        } catch (err) {
            console.log('Had issues updating email', err);
            showErrorMsg('Had issues updating email');
        }
    }

    if (!emails) return <div>Loading..</div>
    return (
        <div className="email-index">
            <Logo />
            <EmailFilter onSetFilter={onSetFilter} filterBy={filterBy} />
            <EmailFolders onComposeClick={onComposeClick} unreadCount={unreadCount} draftCount={draftCount} emails={emails} />
            <section className="email-index-main">
                <div className="email-list-top"></div>
                <EmailList emails={emails} onRemove={onRemoveEmail} onUpdateEmail={onUpdateEmail} />
                <div className="email-list-bottom"></div>

            </section>
            <Outlet context={{ onSendEmail }} />
        </div>
    )
}
