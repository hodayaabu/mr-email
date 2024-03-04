import { Route, HashRouter as Router, Routes } from 'react-router-dom';

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
                        <Route path='/' element={<EmailIndex />} />
                        <Route path='/emails/:folderName' element={<EmailIndex />}>
                            <Route path='/emails/:folderName/compose/:emailId?' element={<EmailCompose />} />
                        </Route>

                        <Route path="/emails/chart" element={<Chart />} />
                    </Routes>
                </main>
                <UserMsg />


                <Footer />

            </section>
        </Router>

    )
}

