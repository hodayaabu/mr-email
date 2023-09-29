import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

//icons
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';
// import { useForm } from '../customHooks/useForm';

export function EmailFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    // const [filterByToEdit, handleChange] = useForm(filterBy)

    const [dynClass, setDynClass] = useState(null)

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(ev) {
        let { value, name: field } = ev.target

        if (field === 'isRead') {
            value = JSON.parse(value)
        }
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
        onCloseFilterOption()
    }

    function openOptions() {
        setDynClass('show')
    }

    function onCloseFilterOption() {
        setDynClass(null)
    }

    function onClearFilter() {
        // handleChange(filterBy)
        onSetFilter(filterBy)
        onCloseFilterOption()
    }

    return <>

        <div className="search-outter-box">
            <div className="search-box">
                <span className="img-span--container">
                    <SearchIcon />
                </span>
                <input type="text"
                    className="search-box"
                    placeholder="Search mail"
                    name="searchMail"
                    onChange={handleChange}
                    value={filterByToEdit.searchMail} />
                <p className="option-btn" onClick={openOptions}><TuneIcon /></p>
            </div>
        </div>

        <form className={"email-filter-options " + dynClass} onSubmit={onSubmitFilter}>
            <Link className="close-options-btn" onClick={onCloseFilterOption}><ClearIcon fontSize='small' /></Link>
            <div className='filter-options' >

                <div className="option">
                    <label htmlFor="from">From</label>
                    <input type="text" id="from"
                        name="from"
                        onChange={handleChange}
                        value={filterByToEdit.from} />
                </div>

                <div className="option">
                    <label htmlFor="to">To</label>
                    <input type="text" id="to"
                        name="to"
                        onChange={handleChange}
                        value={filterByToEdit.to} />
                </div>

                <div className="option">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject"
                        name="subject"
                        onChange={handleChange}
                        value={filterByToEdit.subject} />
                </div>

                <div className="option">
                    <label htmlFor="search">Has the words</label>
                    <input type="text"
                        id='search'
                        name="searchMail"
                        onChange={handleChange}
                        value={filterByToEdit.searchMail} />
                </div>

                <div className="option">
                    <label htmlFor="dosnt-have">Doesnt have</label>
                    <input type="text"
                        id='dosnt-have'
                        name="dosentHasWords"
                        onChange={handleChange}
                        value={filterByToEdit.dosentHasWords} />
                </div>

                <div className="option">
                    <label htmlFor="sentAt">Date within</label>
                    <input type="date"
                        id='sentAt'
                        name="sentAt"
                        onChange={handleChange}
                        value={filterByToEdit.sentAt} />
                </div>

                <div className="option">
                    <label htmlFor="search">Search</label>
                    <input type="text"
                        placeholder='All Mail'
                        id='search'
                        name="searchMail"
                        onChange={handleChange}
                        value={filterByToEdit.searchMail} />
                </div>

                <div className="sortRead">
                    <select name='isRead' onChange={handleChange} >
                        <option value='true'>Read Emails</option>
                        <option value='false'>UnRead Emails</option>
                        <option value='null'>All</option>
                    </select>
                </div>

                <button type='submit' className='search-btn' >search</button>
                <p className='clear-filter' onClick={onClearFilter} >Clear filter</p>

            </div>
        </form>
    </>
}
