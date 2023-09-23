import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const emailService = {
    query,
    save,
    remove,
    getById,
    createEmail,
    getDefaultFilter
}

const loggedinUser = {
    email: 'hodaya1abu@gmail.com',
    fullname: 'Hodaya Abu',
}

const STORAGE_KEY = 'emails'

function getLoggedInUser() {
    return loggedinUser
}

_createEmails()

async function query(filterBy) {

    let emails = await storageService.query(STORAGE_KEY)
    var { subject, body, from, to, isRead, sendAt, folder } = filterBy

    if (filterBy) {
        emails = emails.filter(email =>
            email.subject.toLowerCase().includes(subject.toLowerCase())
            && email.body.toLowerCase().includes(body.toLowerCase())
            && email.from.toLowerCase().includes(from.toLowerCase())
            && email.to.toLowerCase().includes(to.toLowerCase())
        )
    }

    if (isRead !== null) {
        emails = emails.filter(email =>
            email.isRead === filterBy.isRead
        )
    }

    if (sendAt) {
        emails = emails.sort((a, b) => (b.sendAt) - (a.sendAt)).slice(0, 14)
    }
    if (sendAt === false) {
        emails = emails.sort((a, b) => (a.sendAt) - (b.sendAt)).slice(0, 14)
    }

    if (folder) {
        emails = emails.filter((email) => {

            switch (folder) {
                case 'inbox':
                    return (
                        email.to == getLoggedInUser().email
                    )
                case 'sent':
                    return (
                        email.sentAt !== null &&
                        email.from == getLoggedInUser().email
                    )
                case 'drafts':
                    return email.sentAt == null
                case 'all':
                    return email.sentAt != null
                case 'starred':
                    return email.isStarred
                case 'bin':
                    return email.removedAt !== null
            }
        })
    }
    return emails
}

function getById(id) {
    return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function save(emailToSave) {
    if (emailToSave.id) {
        return storageService.put(STORAGE_KEY, emailToSave)
    } else {
        return storageService.post(STORAGE_KEY, emailToSave)
    }
}

function createEmail(id = '', subject = "", body = "", sentAt = Date.now(), removedAt, to = "") {
    const email = {
        id,
        subject,
        body,
        isRead: true,
        isStarred: false,
        sentAt,
        removedAt,
        from: loggedinUser.email,
        to,
    }
    return email
}

function getDefaultFilter() {
    return {
        subject: '',
        body: '',
        from: '',
        to: '',
        sendAt: null,
        isRead: null,
        folder: 'all'
    }
}


function _createEmails() {
    let emails = utilService.loadFromStorage(STORAGE_KEY)
    if (!emails || !emails.length) {
        emails = [
            {
                id: utilService.makeId(),
                subject: 'Hey!',
                body: 'Would love to catch up sometimes',
                isRead: false,
                isStarred: false,
                sentAt: 1551133930594,
                removedAt: null, //for later use
                from: 'hodaya@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'Miss you!',
                body: 'Would love to catch up sometimes',
                isRead: false,
                isStarred: false,
                sentAt: 1551133930594,
                removedAt: null, //for later use
                from: 'shay@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'Hello',
                body: 'Would love to catch up sometimes',
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'momo@momo.com',
                to: 'hodaya1abu@gmail.com'
            },

        ]
        utilService.saveToStorage(STORAGE_KEY, emails)
    }
}




