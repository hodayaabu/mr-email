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
    getAllFolders
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
    var { search, dosentHasWords, subject, body, from, to, isRead, sendAt, folder } = filterBy

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

    if (isRead !== null) {
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
                        email.to == getLoggedInUser().email
                    )
                case 'sent':
                    return (
                        email.sentAt !== null &&
                        email.from == getLoggedInUser().email &&
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
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
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

// async function getCount(folder) {
//     let emails = await storageService.query(STORAGE_KEY)

//     const count = emails.filter((email) => {

//         switch (folder) {
//             case 'inbox':
//                 return (
//                     !email.isRead
//                 )
//             case 'drafts':
//                 return (email.isDraft)
//   
//         }
//     })

//     return count.length
// }
async function getAllFolders() {
    const emails = await storageService.query(STORAGE_KEY)

    const unreadEmailsCount = emails.filter(
        (email) => email.isRead !== true
    ).length;

    const totalDraftsEmails = emails.filter(
        (email) => email.isDraft
    ).length;

    const folders = [
        { id: 1, name: "Inbox", icon: "../../public/icons/inbox.png", count: unreadEmailsCount },
        { id: 2, name: "Starred", icon: "../../public/icons/star_baseline.png", count: null },
        { id: 3, name: "Sent", icon: "../../public/icons/sent.png", count: null },
        { id: 4, name: "Drafts", icon: "../../public/icons/draft.png", count: totalDraftsEmails },
        { id: 5, name: "Bin", icon: "../../public/imgs/trash.png", count: null },
    ];

    return folders;
}