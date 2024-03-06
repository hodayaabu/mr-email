import { useEffect, useState } from 'react'

//icons
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { emailService } from '../services/emails.service';
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
        setFilterByToEdit(emailService.getDefaultFilter())
        onCloseFilterOption()
    }

    return <>

        <div className="search-outter-box">
            <div className="search-box wrapper-search">
                <div className="search-input">
                    <SearchIcon />
                    <input type="text"
                        className="search-box"
                        placeholder="Search mail"
                        name="searchMail"
                        onChange={handleChange}
                        value={filterByToEdit.searchMail} />
                </div>
                <p className="option-btn" onClick={openOptions}><TuneIcon /></p>
            </div>
        </div>

        <form className={"email-filter-options " + dynClass} onSubmit={onSubmitFilter}>
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

                <div className='filter-footer'>
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

            </div>
        </form>
    </>
}
