import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/test.module.css'

export default function SingleSupportCard() {
    const [loading, setLoading] = useState(true);
    // Load support card json file
    const [supportList, setSupportList] = useState([]);
    const [data, setData] = useState({});
    async function fetchJson() {
        setLoading(true)
        await fetch("/data/card.json")
        .then(res => res.json())
        .then(res => {
            setSupportList(res)
            setData(supportList[0])
        })
        setLoading(false)
        console.log(supportList);
    }
    
    useEffect(() => {fetchJson()}, []);

    function getDataHtml(card) {
        return <div>{card.name}</div>
    }

    return (
    <>
        <Head>
            <title>test</title>
        </Head>
        <main>
            {/* Navigation Bar */}
            <div className="navbar">
                <Link href="/">
                    <img className="nav_icon" src="/icon/arrow_back.svg"></img>
                </Link>
                <div className="nav_title">支援卡查詢</div>
                <div style={{flexGrow: 1}}></div> {/* Space holder */}
            </div>

            {/* Main Section */}
            <div className={`${styles.main} main`}>
                {loading ? <h1>loading</h1> : <Page card={supportList[0]}></Page>}
            </div>
        </main>
    </>
    );
}

function Page({card}) {
    return <>
    <div>{card.name}</div>
    </>
}