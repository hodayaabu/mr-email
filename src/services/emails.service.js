import PropTypes from 'prop-types'

//services
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const emailService = {
    query,
    save,
    remove,
    getById,
    createEmail,
    getDefaultFilter,
    getFilterFromParams,
    getEmailShape,
    getUnreadCount,
    getDraftCount,
    getAllCounts

}

const loggedinUser = {
    email: 'hodaya1abu@gmail.com',
    fullname: 'Hodaya Abu',
}

const STORAGE_KEY = 'emails'

_createEmails()

async function query(filterBy = null) {
    let emails = await storageService.query(STORAGE_KEY)
    if (!filterBy) return emails

    const { searchMail, dosentHasWords, subject, body = '', from, to, isRead, sentAt, folderName, isStarred } = filterBy

    if (searchMail) {
        const lowerCaseStr = searchMail.toLowerCase()

        emails = emails.filter(email =>
        (email.subject.toLowerCase().includes(lowerCaseStr)
            || email.body.toLowerCase().includes(lowerCaseStr)
            || email.from.toLowerCase().includes(lowerCaseStr)
            || email.to.toLowerCase().includes(lowerCaseStr)))

    }

    if (body || from || subject || to) {

        emails = emails.filter(email =>
            email.subject.toLowerCase().includes(subject.toLowerCase())
            && email.body.toLowerCase().includes(body.toLowerCase())
            && email.from.toLowerCase().includes(from.toLowerCase())
            && email.to.toLowerCase().includes(to.toLowerCase())
        )
    }

    if (isRead !== null && isRead !== undefined && isRead !== 'null') {
        emails = emails.filter(email =>
            email.isRead === filterBy.isRead
        )
    }

    if (isStarred !== null && isStarred !== undefined && isStarred !== 'null') {
        emails = emails.filter(email =>
            email.isStarred === filterBy.isStarred
        )
    }

    if (folderName) {
        emails = emails.filter((email) => {

            switch (folderName) {
                case 'inbox':
                    return (
                        email.to === _getLoggedInUser().email &&
                        email.removedAt === null
                    )
                case 'sent':
                    return (
                        email.sentAt !== null &&
                        email.from === _getLoggedInUser().email &&
                        !email.isDraft &&
                        email.removedAt === null
                    )
                case 'drafts':
                    return (
                        email.isDraft &&
                        email.removedAt === null)
                case 'all':
                    return email.sentAt != null
                case 'starred':
                    return (
                        email.isStarred && email.removedAt === null)
                case 'trash':
                    return email.removedAt !== null
            }
        })
    }

    // dosent work yet
    function sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    if (sentAt) {
        const filteredDate = new Date(sentAt);
        emails = emails.filter(email => {
            const emailSentAt = new Date(email.sentAt)
            sameDay(filteredDate, emailSentAt)
        })
        return emails
    }

    if (dosentHasWords) {
        const lowerCaseStr = dosentHasWords.toLowerCase()

        emails = emails.filter(email =>
            !email.subject.toLowerCase().includes(lowerCaseStr)
            || !email.body.toLowerCase().includes(lowerCaseStr)
            || !email.from.toLowerCase().includes(lowerCaseStr)
            || !email.to.toLowerCase().includes(lowerCaseStr)
        )
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

function createEmail(id = '', subject = "", body = "", sentAt = Date.now(), to = "", location = "") {
    const email = {
        id,
        subject,
        body,
        isRead: true,
        isStarred: false,
        sentAt,
        isDraft: false,
        removedAt: null,
        from: loggedinUser.email,
        to,
        location,
    }
    return email
}

function getDefaultFilter() {
    return {
        subject: '',
        body: '',
        from: '',
        to: '',
        searchMail: '',
        sentAt: '',
        isRead: null,
        folderName: null,
        isStarred: null
    }
}

function getFilterFromParams(searchParams) {
    const filterBy = {
        subject: searchParams.get('subject') || '',
        body: searchParams.get('body') || '',
        from: searchParams.get('from') || '',
        to: searchParams.get('field') || '',
        searchMail: searchParams.get('searchMail') || '',
        sentAt: searchParams.get('sentAt') || '',
        isRead: searchParams.get('isRead') || null,
        folderName: searchParams.get('folderName') || null
    }

    return filterBy
}

function getEmailShape() {
    return PropTypes.shape({
        id: PropTypes.string,
        subject: PropTypes.string,
        body: PropTypes.string,
        isRead: PropTypes.bool,
        isStarred: PropTypes.bool,
        sentAt: PropTypes.number,
        isDraft: PropTypes.bool,
        removedAt: PropTypes.number,
        from: PropTypes.string,
        to: PropTypes.string,

    })
}

async function getUnreadCount() {
    const filterBy = getDefaultFilter()
    filterBy.isRead = false
    const emails = await query(filterBy)
    return emails.length
}

async function getDraftCount() {
    const filterBy = getDefaultFilter()
    const emails = await query(filterBy)
    const drafts = emails.filter((email) => (
        email.isDraft
    ))
    return drafts.length
}

async function getStarredCount() {
    const filterBy = getDefaultFilter()
    const emails = await query(filterBy)
    const starred = emails.filter((email) => (
        email.isStarred
    ))
    return starred.length
}

async function getInboxCount() {
    const filterBy = getDefaultFilter()
    filterBy.to = loggedinUser.email
    const emails = await query(filterBy)
    return emails.length

}

async function getSentCount() {
    const filterBy = getDefaultFilter()
    filterBy.from = loggedinUser.email
    const emails = await query(filterBy)
    return emails.length
}

async function getAllCounts() {
    const unRead = await getUnreadCount();
    const starred = await getStarredCount();
    const drafts = await getDraftCount()
    const inbox = await getInboxCount()
    const sent = await getSentCount()

    const counts = [unRead, starred, drafts, inbox, sent]

    return counts
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

function _getLoggedInUser() {
    return loggedinUser
}