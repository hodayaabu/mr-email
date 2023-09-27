//icons
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import ForwardToInboxSharpIcon from '@mui/icons-material/ForwardToInboxSharp';

export function Logo() {
    return (
        <>
            <div className="logo">
                <button className='menu-btn'><MenuSharpIcon /></button>
                < ForwardToInboxSharpIcon fontSize="large" />
                <h1>Gmail</h1>
            </div>
        </>
    )
}