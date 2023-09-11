import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/SkillPage.module.css'
import { useState } from 'react'

export default function SupportCardPage() {
    return (
    <>
        <Head>
            <title>技能一覽</title>
        </Head>

        <main>
            {/* Navigation Bar */}
            <div className="navbar">
                <Link href="/">
                    <img className="nav_icon" src="/icon/arrow_back.svg"></img>
                </Link>
                <div className="nav_title">技能一覽</div>
                <div style={{flexGrow: 1}}></div> {/* Space holder */}
                <RefreshButton></RefreshButton>
            </div>
            
            <div className={`${styles.main} main`}>
                {/* Search Table */}
                <div className={styles.searchTable}>
                    <div class={styles.grid_container}>
                        <div className={styles.grid_head}>稀有度</div>
                        <ToggleButton text="普通" color="var(--r-color)"></ToggleButton>
                        <ToggleButton text="稀有" color="var(--sr-color)"></ToggleButton>
                        <ToggleButton text="固有" color="var(--ssr-color)"></ToggleButton>
                        <ToggleButton text="繼承" color="var(--guts-color)"></ToggleButton>
                        <ToggleButton text="劇情" color="var(--toggle-color)"></ToggleButton>
                        <div className={styles.grid_head} style={{gridRow: "2/5"}}>條件限制</div>
                        <ToggleButton text="通用" color="var(--toggle-color)"></ToggleButton>
                        <div></div><div></div><div></div><div></div>
                        <ToggleButton text="沙地" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="短距離" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="一哩" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="中距離" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="長距離" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="領頭" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="前列" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="居中" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="後追" color="var(--toggle-color)"></ToggleButton>
                        <div></div>
                        <div className={styles.grid_head}>技能類型</div>
                        <ToggleButton text="綠技" color="var(--wisdom-color)"></ToggleButton>
                        <ToggleButton text="黃技" color="var(--power-color)"></ToggleButton>
                        <ToggleButton text="藍技" color="var(--speed-color)"></ToggleButton>
                        <ToggleButton text="紅技" color="var(--stamina-color)"></ToggleButton>
                        <ToggleButton text="紫技" color="var(--purple-color)"></ToggleButton>
                    </div>
                </div>

                <hr style={{
                    marginTop: "20px",
                    marginBottom: "20px"
                }}></hr>

                {/* Skill Section */}
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