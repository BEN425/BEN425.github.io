import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/SupportCard.module.css'
import { useState } from 'react'

export default function SupportCard() {
    return (
    <>
        <Head>
            <title>支援卡一覽</title>
        </Head>

        <main>
            {/* Navigation Bar */}
            <div className={styles.navbar}>
                <Link href="/"><img className={styles.nav_icon} src="/arrow_back.svg"></img></Link>
                <div className={styles.title}>支援卡一覽</div>
                <div style={{flexGrow: 1}}></div> {/* Space holder */}
                <RefreshButton></RefreshButton>
            </div>
            
            <div className={`${styles.main} main`}>
                <div className={styles.searchTable}>
                    <table>
                        <tbody>
                            <tr>
                                <th>屬性</th>
                                <td>
                                    <ToggleButton text="速度" color="var(--speed-color)"></ToggleButton>
                                    <ToggleButton text="持久力" color="var(--stamina-color)"></ToggleButton>
                                    <ToggleButton text="力量" color="var(--power-color)"></ToggleButton>
                                    <ToggleButton text="意志力" color="var(--guts-color)"></ToggleButton>
                                    <ToggleButton text="智力" color="var(--wisdom-color)"></ToggleButton>
                                    <ToggleButton text="友人" color="var(--friend-color)"></ToggleButton>
                                    <ToggleButton text="團隊" color="var(--group-color)"></ToggleButton>
                                </td>
                            </tr>
                            <tr>
                                <th>稀有度</th>
                                <td>
                                    <ToggleButton text="SSR" color="var(--group-color)"></ToggleButton>
                                    <ToggleButton text="SR" color="var(--group-color)"></ToggleButton>
                                    <ToggleButton text="R" color="var(--group-color)"></ToggleButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
        <img className={styles.nav_icon} src="/refresh.svg"></img>
    </button>
}

function ToggleButton({text, color}) {
    const [pressed, setPressed] = useState(false);

    function handlePress() {
        // TODO
        setPressed(!pressed);
    }

    const button = <button
        className={`${styles.toggle} ${pressed ? styles.selected : ""}`} 
        style={{backgroundColor: color}}
        onClick={handlePress}>{text}
    </button>
    return button;  
}