import { Route, HashRouter as Router, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { EmailIndex } from './pages/EmailIndex';
import { EmailCompose } from './comps/EmailCompose';
import { UserMsg } from './comps/UserMsg';
import { Chart } from './pages/Chart';
import { Footer } from './comps/Footer';

export function App() {

    return (
        <Router>
            <section className='main-app'>

                <main className='container' >
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/emails/:folderName' element={<EmailIndex />}>
                            <Route path='/emails/:folderName/compose/:emailId?' element={<EmailCompose />} />
                        </Route>

                        {/* <Route path='/emails/:folderName/:emailId?' element={<EmailIndex />}>
                            <Route path='/emails/:folderName/:emailId/compose/:emailId?' element={<EmailCompose />} />
                        </Route> */}

                        <Route path="/emails/chart" element={<Chart />} />
                    </Routes>
                </main>
                <UserMsg />


                <Footer />

            </section>
        </Router>

    )
}

