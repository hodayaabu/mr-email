import { Route, HashRouter as Router, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { EmailIndex } from './pages/EmailIndex';
import { AppHeader } from './comps/AppHeader';
import { EmailDetails } from './pages/EmailDetails';
import { EmailCompose } from './comps/EmailCompose';
import { UserMsg } from './comps/UserMsg';

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
                        <Route path='/emails/:folderName' element={<EmailIndex />}>
                            <Route path='/emails/:folderName/compose/:emailId?' element={<EmailCompose />} />
                        </Route>
                        <Route path="/emails/:folderName/:emailId" element={<EmailDetails />} />
                    </Routes>
                </main>
                <UserMsg />
                <footer>
                    <section className="container">
                        robotRights 2023 &copy;
                    </section>
                </footer>
            </section>
        </Router>

    )
}

