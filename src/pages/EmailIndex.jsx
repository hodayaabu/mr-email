import { useEffect, useState } from "react"

import { emailService } from "../services/emails.service";
import { EmailList } from "../comps/EmailList";
import { EmailFilter } from "../comps/EmailFilter";

export function EmailIndex() {
    const [emails, setEmails] = useState(null)
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter())

    useEffect(() => {
        loadEmails()
    }, [filterBy])

    function onSetFilter(fieldsToUpdate) {
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...fieldsToUpdate }))
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
            await emailService.remove(emailId)
            setEmails((prevEmails) => prevEmails.filter(email => email.id !== emailId))
        } catch (err) {
            console.log('Had issues loading emails', err);
        }
    }

    if (!emails) return <div>Loading..</div>
    return (
        <div className="container">
            <EmailFilter onSetFilter={onSetFilter} filterBy={filterBy} />
            <EmailList emails={emails} onRemove={onRemoveEmail} />
        </div>
    )
}
