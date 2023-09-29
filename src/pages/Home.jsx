import { Link } from "react-router-dom"

export function Home() {
    return (
        <section className="home container">
            <h1>Welcome to our Email App</h1>
            <div>
                <Link to={`/emails/inbox/compose/?to=Help@gmaol.com&subject=Help`}>Help</Link>
            </div>
            <div>
                <Link to={`/emails/inbox`}>inbox</Link>
            </div>
            < div>
                <Link to={`/about`}>about</Link>
            </div>
        </section>
    )
}
