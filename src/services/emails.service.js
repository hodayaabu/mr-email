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
            {
                id: utilService.makeId(),
                subject: 'Thanks for your recent interest in joining us at Sensi.ai',
                body: "Hi hodaya, Thank you for your recent interest in joining us at Sensi.ai. Unfortunately, the Full Stack Developer opportunity for which you were under consideration is no longer open. We’d love to be in touch regarding future openings at Sensi.Ai! Feel free to check out our new opportunities on our career website or LinkedIn page.Kind regards, Sensi.ai Hiring Team",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'LinkedIn@momo.com',
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
                subject: 'Hi hodaya',
                body: "Thank you for your recent interest in joining us at Sensi.ai. Unfortunately, the Full Stack Developer opportunity for which you were under consideration is no longer open. We’d love to be in touch regarding future openings at Sensi.Ai! Feel free to check out our new opportunities on our career website or LinkedIn page.Kind regards, Sensi.ai Hiring Team",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'david@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'Hi hodaya, a notification from linkedin',
                body: "Navigating career breaks, celebrating International Women’s Day and the perks of exercising at work",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'linkedin@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'Intro to Data Modeling on March 13th',
                body: "A frequently asked question in the MongoDB community is “I’m designing an application to do X, how do I model the data? In this webinar on Wednesday, March 13th at 11 A.M. ET we will examine the most important considerations when making decisions about your data model, so that you can create the model that best fits your application.",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'mongodbteam@gmail.com',
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
                subject: 'back end developer”: Deloitte Back End Developer and more',
                body: "Your job alert for back end developer In this webinar on Wednesday, March 13th at 11 A.M. ET we will examine the most important considerations when making decisions about your data model, so that you can create the model that best fits your application.",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'linkedin@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'You have points in your account that you have not yet redeemed',
                body: "You have points in your account that you have not yet redeemed",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'FRÉ@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'LinkedIn News via LinkedI',
                body: "Make space for people to reveal themselves.” How former Secret Service Agent Evy Poumpouras learned to spot a liar.",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'linkedin@gmail.com',
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
                subject: 'BA',
                body: "Greetings,We are glad that you chose to study at Ben Gurion University and thank you for your interest in the Faculty of Humanities and Social Sciences.",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'Rishum@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'You have points in your account that you have not yet redeemed',
                body: "You have points in your account that you have not yet redeemed",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'FRÉ@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'back end developer”: Deloitte Back End Developer and more',
                body: "Your job alert for back end developer In this webinar on Wednesday, March 13th at 11 A.M. ET we will examine the most important considerations when making decisions about your data model, so that you can create the model that best fits your application.",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'linkedin@gmail.com',
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
                subject: 'Hi hodaya',
                body: "Thank you for your recent interest in joining us at Sensi.ai. Unfortunately, the Full Stack Developer opportunity for which you were under consideration is no longer open. We’d love to be in touch regarding future openings at Sensi.Ai! Feel free to check out our new opportunities on our career website or LinkedIn page.Kind regards, Sensi.ai Hiring Team",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'david@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
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
                subject: 'You have points in your account that you have not yet redeemed',
                body: "You have points in your account that you have not yet redeemed",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'FRÉ@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'back end developer”: Deloitte Back End Developer and more',
                body: "Your job alert for back end developer In this webinar on Wednesday, March 13th at 11 A.M. ET we will examine the most important considerations when making decisions about your data model, so that you can create the model that best fits your application.",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'linkedin@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },
            {
                id: utilService.makeId(),
                subject: 'You have points in your account that you have not yet redeemed',
                body: "You have points in your account that you have not yet redeemed",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'FRÉ@gmail.com',
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
                subject: 'You have points in your account that you have not yet redeemed',
                body: "You have points in your account that you have not yet redeemed",
                isRead: false,
                isStarred: false,
                sentAt: 15511339305999,
                removedAt: null, //for later use
                from: 'FRÉ@gmail.com',
                to: 'hodaya1abu@gmail.com'
            },

        ]
        utilService.saveToStorage(STORAGE_KEY, emails)
    }
}

function _getLoggedInUser() {
    return loggedinUser
}