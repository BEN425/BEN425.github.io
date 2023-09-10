import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/SupportCardPage.module.css'
import { useState } from 'react'

export default function SupportCardPage() {
    return (
    <>
        <Head>
            <title>支援卡一覽</title>
        </Head>

        <main>
            {/* Navigation Bar */}
            <div className="navbar">
                <Link href="/">
                    <img className="nav_icon" src="/icon/arrow_back.svg"></img>
                </Link>
                <div className="nav_title">支援卡一覽</div>
                <div style={{flexGrow: 1}}></div> {/* Space holder */}
                <RefreshButton></RefreshButton>
            </div>
            
            <div className={`${styles.main} main`}>
                {/* Search Table */}
                <div className={styles.searchTable}>
                    <div class={styles.grid_container}>
                        <div className={styles.grid_head}>屬性</div>
                        <ToggleButton text="速度" color="var(--speed-color)"></ToggleButton>
                        <ToggleButton text="持久力" color="var(--stamina-color)"></ToggleButton>
                        <ToggleButton text="力量" color="var(--power-color)"></ToggleButton>
                        <ToggleButton text="意志力" color="var(--guts-color)"></ToggleButton>
                        <ToggleButton text="智力" color="var(--wisdom-color)"></ToggleButton>
                        <ToggleButton text="友人" color="var(--friend-color)"></ToggleButton>
                        <ToggleButton text="團隊" color="var(--group-color)"></ToggleButton>
                        <div className={styles.grid_head}>稀有度</div>
                        <ToggleButton text="SSR" color="var(--ssr-color)"></ToggleButton>
                        <ToggleButton text="SR" color="var(--sr-color)"></ToggleButton>
                        <ToggleButton text="R" color="var(--r-color)"></ToggleButton>
                    </div>
                </div>

                <hr style={{
                    marginTop: "20px",
                    marginBottom: "20px"
                }}></hr>

                {/* Support Card Section */}
            </div>
            
        </main>
    </>
    )
}

function RefreshButton() {
    function handlePress() {
        // TODO
    }

    return <button className={styles.refresh}>
        <img className="nav_icon" src="/icon/refresh.svg"></img>
    </button>
}

function ToggleButton({text, color}) {
    const [pressed, setPressed] = useState(false);

    function handlePress() {
        // TODO
        setPressed(!pressed);
    }

    const button = <button
        className={`toggle ${pressed ? "selected" : ""}`} 
        style={{background: color}}
        onClick={handlePress}>{text}
    </button>
    return button;  
}