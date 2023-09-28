import { Link } from "react-router-dom"

export function Home() {
    return (
        <section className="home container">
            <h1>Welcome to our Email App</h1>
            <button><Link to={`/emails/inbox/compose/?to=Help@gmaol.com&subject=Help`}>Help</Link></button>
            <Link to={`/emails/inbox`}>inbox</Link>
        </section>
    )
}
