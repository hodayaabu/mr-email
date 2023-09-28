import PropTypes from 'prop-types'

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
    getDraftCount
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
    const { search, dosentHasWords, subject, body, from, to, isRead, sendAt, folder } = filterBy

    if (search) {
        const lowerCaseSearchString = search.toLowerCase()

        emails = emails.filter(email =>
            email.subject.toLowerCase().includes(lowerCaseSearchString)
            || email.body.toLowerCase().includes(lowerCaseSearchString)
            || email.from.toLowerCase().includes(lowerCaseSearchString)
            || email.to.toLowerCase().includes(lowerCaseSearchString)
        )
    }

    if (dosentHasWords) {

        emails = emails.filter(email =>
            !email.subject.toLowerCase().includes(dosentHasWords)
            || !email.body.toLowerCase().includes(dosentHasWords)
            || !email.from.toLowerCase().includes(dosentHasWords)
            || !email.to.toLowerCase().includes(dosentHasWords)
        )
    }

    if (filterBy) {

        emails = emails.filter(email =>
            email.subject.toLowerCase().includes(subject.toLowerCase())
            && email.body.toLowerCase().includes(body.toLowerCase())
            && email.from.toLowerCase().includes(from.toLowerCase())
            && email.to.toLowerCase().includes(to.toLowerCase())
        )
    }

    if (isRead !== null && isRead !== undefined) {
        emails = emails.filter(email =>
            email.isRead === filterBy.isRead
        )
    }

    if (sendAt) {
        console.log("sendat", sendAt);
        const date = new Date(sendAt).getTime();
        console.log("date", date);
        emails = emails.filter(email =>
            email.sendAt === date
        )
    }

    if (folder) {
        emails = emails.filter((email) => {

            switch (folder) {
                case 'inbox':
                    return (
                        email.to === _getLoggedInUser().email
                    )
                case 'sent':
                    return (
                        email.sentAt !== null &&
                        email.from === _getLoggedInUser().email &&
                        !email.isDraft
                    )
                case 'drafts':
                    return email.isDraft
                case 'all':
                    return email.sentAt != null
                case 'starred':
                    return email.isStarred
                case 'trash':
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
        isDraft: false,
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
        search: '',
        sendAt: null,
        isRead: null,
        folder: null
    }
}

function getFilterFromParams(searchParams) {
    const filterBy = {
        subject: searchParams.get('subject') || '',
        body: searchParams.get('body') || '',
        from: searchParams.get('from') || '',
        to: searchParams.get('field') || '',
        search: searchParams.get('search') || '',
        sendAt: searchParams.get('sentAt') || null,
        isRead: searchParams.get('isRead') || null,
        folder: searchParams.get('folderName') || null
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

function _getLoggedInUser() {
    return loggedinUser
}