import Head from 'next/head'
import { useMoralis } from 'react-moralis'
import Header from '../components/Header'
import LotteryEntrance from '../components/LotteryEntrance'
import styles from '../styles/Home.module.css'

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={styles.container}>
            <Head>
                <title>Smartcontract Lottery</title>
                <meta name="description" content="Smartcontract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            {isWeb3Enabled ? <LotteryEntrance /> : <div>Please connect to a Wallet</div>}
        </div>
    )
}
