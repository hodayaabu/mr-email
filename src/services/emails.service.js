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

const STORAGE_KEY = 'emails'

_createEmails()

async function query(filterBy) {
    console.log("filterBy:", filterBy);
    let emails = await storageService.query(STORAGE_KEY)
    console.log(emails);
    if (filterBy) {
        var { subject, body, from, to } = filterBy
        // isRead = isRead || null
        emails = emails.filter(email =>
            email.subject.toLowerCase().includes(subject.toLowerCase())
            && email.body.toLowerCase().includes(body.toLowerCase())
            && email.from.toLowerCase().includes(from.toLowerCase())
            && email.to.toLowerCase().includes(to.toLowerCase())
            // && (email.isRead == isRead)
        )
    }
    console.log(emails);
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
        // emailToSave.isOn = false
        return storageService.post(STORAGE_KEY, emailToSave)
    }
}

function createEmail(id = "", subject = "", body = "", sentAt = "", from = "", to = "") {
    const email = {
        id,
        subject,
        body,
        isRead: false,
        isStarred: false,
        sentAt,
        removedAt: null, //for later use
        from,
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
        isRead: null
    }
}


function _createEmails() {
    let emails = utilService.loadFromStorage(STORAGE_KEY)
    if (!emails || !emails.length) {
        emails = [
            {
                id: utilService.makeId(),
                subject: 'hey!',
                body: 'Would love to catch up sometimes',
                isRead: false,
                isStarred: false,
                sentAt: 1551133930594,
                removedAt: null, //for later use
                from: 'momo@momo.com',
                to: 'user@appsus.com'
            },
            {
                id: utilService.makeId(),
                subject: 'Miss you!',
                body: 'Would love to catch up sometimes',
                isRead: false,
                isStarred: false,
                sentAt: 1551133930594,
                removedAt: null, //for later use
                from: 'momo@momo.com',
                to: 'user@appsus.com'
            },
            {
                id: utilService.makeId(),
                subject: 'f',
                body: 'Would love to catch up sometimes',
                isRead: false,
                isStarred: false,
                sentAt: 1551133930594,
                removedAt: null, //for later use
                from: 'momo@momo.com',
                to: 'user@appsus.com'
            },

        ]
        utilService.saveToStorage(STORAGE_KEY, emails)
    }
}




