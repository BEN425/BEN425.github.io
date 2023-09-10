import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/CharaPage.module.css'
import { useState } from 'react'

export default function SupportCardPage() {
    return (
    <>
        <Head>
            <title>角色一覽</title>
        </Head>

        <main>
            {/* Navigation Bar */}
            <div className="navbar">
                <Link href="/">
                    <img className="nav_icon" src="/icon/arrow_back.svg"></img>
                </Link>
                <div className="nav_title">角色一覽</div>
                <div style={{flexGrow: 1}}></div> {/* Space holder */}
                <RefreshButton></RefreshButton>
            </div>
            
            <div className={`${styles.main} main`}>
                {/* Search Table */}
                <div className={styles.searchTable}>
                    <div class={styles.grid_container}>
                        <div className={styles.grid_head}>稀有度</div>
                        <ToggleButton text="三星"></ToggleButton>
                        <ToggleButton text="二星"></ToggleButton>
                        <ToggleButton text="一星"></ToggleButton>
                        <div></div> {/* Placeholder */}
                    </div>
                </div>

                <hr style={{
                    marginTop: "20px",
                    marginBottom: "20px"
                }}></hr>

                {/* Character Section */}
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

function ToggleButton({text}) {
    const [pressed, setPressed] = useState(false);

    function handlePress() {
        // TODO
        setPressed(!pressed);
    }

    const button = <button
        className={`${styles.toggle_button} toggle ${pressed ? "selected" : ""}`} 
        onClick={handlePress}>{text}
    </button>
    return button;  
}