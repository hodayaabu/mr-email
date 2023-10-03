import { RadialLinearScale, Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { emailService } from '../services/emails.service';
import { useEffect, useState } from 'react';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export function Chart() {
    const [counts, setCounts] = useState([])

    useEffect(() => {
        getCount()
    }, [])

    async function getCount() {
        const counts = await emailService.getAllCounts()
        setCounts(counts)
    }
    const data = {
        labels: ['UnRead', 'Starred', 'Drafts', 'Inbox', 'Send'],
        datasets: [
            {
                label: 'emails',
                data: counts,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <section className='doughnut'>
            <Doughnut data={data} />
        </section>
    )
}

