import { Link } from "react-router-dom"

export function Home() {
    return (
        <section className="home container">
            <h1>Welcome to our Email App</h1>
            <Link to={`/emails/inbox/compose/?to=Help@gmaol.com&subject=Help`}>Help</Link>
        </section>
    )
}
