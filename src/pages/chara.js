import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '@/styles/CharaPage.module.css'

export default function SupportCardPage() {
    const [loading, setLoading] = useState(true);
    // Load character json file
    const [charaList, setCharaList] = useState([]);
    async function fetchJson() {
        setLoading(true)
        await fetch("/data/chara.json")
        .then(res => res.json())
        .then(res => {
            setCharaList(res)
            // console.log(res)
        })
        setLoading(false)
        console.log(charaList)
    }
    
    useEffect(() => {fetchJson()}, []);

    function getDataHtml() {
        return charaList.map(item => <CharaItem chara={item}></CharaItem>)
    }

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
                        {/* Search Bar */}
                        <div className={styles.grid_head}>搜尋</div>
                        <input type="text" className="search" placeholder="以名稱搜尋" style={{gridColumn: "2/-1"}}></input>
                    </div>
                </div>

                <hr style={{
                    marginTop: "20px",
                    marginBottom: "20px"
                }}></hr>

                {/* Character Section */}
                <div className={styles.chara_grid_container}>
                    {loading ? <h1 style={{color: "white", fontWeight: "bold"}}>Loading</h1> : getDataHtml()}
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

function CharaItem({chara}) {
    const [title, name, id] = [chara.title, chara.name, chara.id];

    return <Link href=""><div className={styles.chara_item}>
        <img className={styles.chara_image} src={"/images/chara/" + id + ".png"}></img>
        <div className={styles.chara_title}>{title}</div>
        <div className={styles.chara_name}>{name}</div>
    </div></Link>
}