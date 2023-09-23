import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function EmailFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [dynClass, setDynClass] = useState(null)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(ev) {
        let { value, name: field } = ev.target

        if (field === 'isRead' || field === 'sendAt') {
            value = JSON.parse(value)
        }
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }
    function openOptions() {
        setDynClass('show')
    }

    function onCloseFilterOption() {
        setDynClass(null)
    }
    return <>
        <form className="email-filter" onSubmit={onSubmitFilter}>

            <div className="sortDate">
                <select name='sendAt' onChange={handleChange} >
                    <option>Sort By Date:</option>
                    <option value="true">new to old</option>
                    <option value="false">old to new</option>
                </select>
            </div>

            <div className="search-outter--box">
                <div className="search-box">
                    <span className="img-span--container">
                        <img src="../../public/imgs/glass.png" className="magnifying-glass--img" />
                    </span>
                    <input type="text"
                        className="search-box"
                        placeholder="Search mail"
                        name="body"
                        onChange={handleChange}
                        value={filterByToEdit.body} />
                    <button onClick={openOptions}>options</button>
                </div>
            </div>

            <div className={'filter-options ' + dynClass}>
                <form onSubmit={onSubmitFilter}>
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

                    <label htmlFor="subject">Subject:</label>
                    <input type="text" id="subject"
                        placeholder="Search by subject"
                        name="subject"
                        onChange={handleChange}
                        value={filterByToEdit.subject} />


                    <div className="sortRead">
                        <select name='isRead' onChange={handleChange} >
                            <option>Sort By:</option>
                            <option value='true'>Read Emails</option>
                            <option value='false'>UnRead Emails</option>
                            <option value='null'>All</option>
                        </select>
                    </div>
                    <button >search</button>
                    <Link onClick={onCloseFilterOption}>X</Link>
                </form>

            </div>




        </form>
    </>
}
