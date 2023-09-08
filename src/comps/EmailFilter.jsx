import { useEffect, useState } from 'react'

export function EmailFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(ev) {
        let { value, name: field } = ev.target
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    return <form className="email-filter" onSubmit={onSubmitFilter}>
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
            placeholder="Search by body"
            name="body"
            onChange={handleChange}
            value={filterByToEdit.body} />

        <button>Filter</button>
    </form>
}
