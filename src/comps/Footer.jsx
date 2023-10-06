import { NavLink } from "react-router-dom";

export function Footer() {
    return (
        <footer className="footer">
            <nav>
                <NavLink className="navLink" to="/emails/chart">Chart</NavLink>
                <NavLink className="navLink" to="/emails/inbox/compose/?to=Help@gmaol.com&subject=Help">Help</NavLink>
            </nav>
        </footer>
    )
}