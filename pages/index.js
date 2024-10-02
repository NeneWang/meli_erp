import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>POS Barcode </title>
                <meta name="description" content="React POS app with barcode scanning and product search" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>POS</h1>
            {/* Use href instead of to */}
            <Link href="/pagode">
                pagode
            </Link>
            <br />
            <Link href="/arribenos">
                arribeños
            </Link>
        </div>
    );
}
