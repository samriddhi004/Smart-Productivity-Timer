import Link from 'next/link';

export default function Home () {
    return (
        <div style = {{textAlign: 'center', marginTop: '50px'}}>
            <h1> Welcome to Smart Productivity Timer</h1>
            <Link href="/timer">
                <button> Go to TIMER!</button>
            </Link>
        </div>
    );
}
