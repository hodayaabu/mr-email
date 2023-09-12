import { useEffect, useState } from 'react'


export function EmailFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(ev) {
        let { value, name: field } = ev.target

        if (field === 'isRead' || field === 'sendAt') {
            value = JSON.parse(value)
        }
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
        console.log(value);
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    return <>
        <form className="email-filter" onSubmit={onSubmitFilter}>

            {/* <div className="sortDate">
                <select name='sendAt' onChange={handleChange} >
                    <option>Sort By Date:</option>
                    <option value="true">new to old</option>
                    <option value="false">old to new</option>
                </select>
            </div> */}

            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject"
                placeholder="Search by subject"
                name="subject"
                onChange={handleChange}
                value={filterByToEdit.subject} />

            <label htmlFor="from">From:</label>
            <input type="text" id="from"
                placeholder="Search by from"
                name="from"
                onChange={handleChange}
                value={filterByToEdit.from} />

            <label htmlFor="to">To:</label>
            <input type="text" id="to"
                placeholder="Search by to"
                name="to"
                onChange={handleChange}
                value={filterByToEdit.to} />

            <label htmlFor="body">Description:</label>
            <input type="text" id="body"
                placeholder="Search by description"
                name="body"
                onChange={handleChange}
                value={filterByToEdit.body} />

            <div className="sortRead">
                <select name='isRead' onChange={handleChange} >
                    <option>Sort By:</option>
                    <option value='true'>Read Emails</option>
                    <option value='false'>UnRead Emails</option>
                    <option value='null'>All</option>
                </select>
            </div>
        </form>
    </>
}
