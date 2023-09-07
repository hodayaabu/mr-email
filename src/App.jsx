import { Route, HashRouter as Router, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { EmailIndex } from './pages/EmailIndex';
import { AppHeader } from './comps/AppHeader';
import { EmailDetails } from './pages/EmailDetails';

export function App() {

    return (
        <Router>
            <section className='main-app'>
                <header className="app-header">
                    <section className="container">
                        <AppHeader />
                    </section>
                </header>

                <main className='container'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/emails' element={<EmailIndex />} />
                        <Route path="/email/:emailId" element={<EmailDetails />} />
                    </Routes>
                </main>

                <footer>
                    <section className="container">
                        robotRights 2023 &copy;
                    </section>
                </footer>
            </section>
        </Router>

    )
}

