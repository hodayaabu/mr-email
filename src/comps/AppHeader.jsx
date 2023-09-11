import { NavLink } from "react-router-dom";

export function AppHeader() {
    return (
        <header className="app-header">
            <section className="container">
                <h1>MisterEmail</h1>
            </section>
            <section className="navbar">
                <nav>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/emails">Emails</NavLink>
                </nav>
            </section>
        </header>
    )
}
