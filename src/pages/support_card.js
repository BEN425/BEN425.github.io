import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '@/styles/SupportCardPage.module.css'

export default function SupportCardPage() {
    const [loading, setLoading] = useState(true);
    // Load support card json file
    const [supportList, setSupportList] = useState([]);
    async function fetchJson() {
        setLoading(true)
        await fetch("/data/card.json")
        .then(res => res.json())
        .then(res => {
            setSupportList(res)
            // console.log(res);
        })
        setLoading(false)
        console.log(supportList)
    }
    
    useEffect(() => {fetchJson()}, []);

    function getDataHtml() {
        return supportList.map(item => <SupportCardItem card={item}></SupportCardItem>)
    }

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
                    <div className={styles.grid_container}>
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
                        <div></div><div></div><div></div><div></div>
                        {/* Search Bar */}
                        <div className={styles.grid_head}>搜尋</div>
                        <input type="text" className="search" placeholder="以名稱搜尋" style={{gridColumn: "2/-1"}}></input>
                    </div>
                </div>

                <hr style={{
                    marginTop: "20px",
                    marginBottom: "20px"
                }}></hr>

                {/* Support Card Section */}
                <div className={styles.support_grid_container}>
                    {loading ? <h1 style={{color: "white", fontWeight: "bold"}}>loading</h1> : getDataHtml()}
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

function SupportCardItem({card}) {
    // return <div>{String(card)}</div>
    const [title, rarity, type]  = [card.name, card.rarity, translate(card.type)];
    const src = "/images/card/" + card.id.replace(" thumb ", "_thumb_") + ".png";

    return <Link href={""}><div className={styles.support_card_item}>
        <img src={src} className={styles.support_card_image}></img>
        <div className={styles.support_card_sub}>
            <div className={styles.support_card_title}>{title}</div>
            {/* <div className={styles.support_card_title}>{name}</div> */}
            <div className={styles.support_card_sub_sub}>
                <div className={styles.support_card_type} style={{backgroundImage: `url(/icon/${type}.png)`}}></div>
                <div>{rarity}</div>
            </div>
        </div>
    </div></Link>
}

const table = {
    "速度": "speed",
    "耐力": "stamina",
    "力量": "power",
    "毅力": "guts",
    "智力": "wisdom",
    "友人": "friend",
    "团队": "team",
}
function translate(input) {return table[input]}
