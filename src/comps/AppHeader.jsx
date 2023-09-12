import { NavLink } from "react-router-dom";

export function AppHeader() {
    return (
        <header className="app-header">
            <section className="container">
                <h1 className="header">MisterEmail</h1>

                <nav className="navbar">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/emails">Emails</NavLink>
                </nav>
            </section>
        </header>
    )
}
