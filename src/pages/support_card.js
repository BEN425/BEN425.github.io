import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import styles from '@/styles/SupportCardPage.module.css'

import * as mylib from "../lib"

const typeList = ["速度", "持久力", "力量", "意志力", "智力", "友人", "團隊"]
const typesEnList = ["speed", "stamina", "power", "guts", "wisdom", "friend", "group"]
const rarityList = ["SSR", "SR", "R"]

export default function SupportCardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    // Filter
    const [typeFilter, setTypeFilter] = useState(Array(7).fill(false));
    const [rarityFilter, setRarityFilter] = useState(Array(3).fill(false));
    // Load support card json file
    const [supportList, setSupportList] = useState([])
    async function fetchJson() {
        setLoading(true)
        await fetch("/data/card.json")
        .then(res => res.json())
        .then(res => {
            setSupportList(res)
        })
        setLoading(false)
        // console.log(supportList)
    }
    
    useEffect(() => {fetchJson()}, []);

    // Return a corresponding <SupportCardItem> from the item,
    // or return null if the filter is not matched
    function getItem(item) {
        // If all toggle buttons are off, the filter is off
        let matchType = !typeFilter.includes(true);
        let matchRarity = !rarityFilter.includes(true);
        // Check filters
        typeList.forEach((value, index) => {
            if (typeFilter[index] && value == item.type) matchType = true;
        })
        rarityList.forEach((value, index) => {
            if (rarityFilter[index] && value == item.rarity) matchRarity = true;
        })

        return matchType && matchRarity ? <SupportCardItem
            card={item}
            onClick={() => { router.push({
                pathname: "/support_card/[uuid]",
                query: {
                    uuid: item.uuid
                },
            })}}>
        </SupportCardItem> : null;
    }

    return <>
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
                {/* <RefreshButton></RefreshButton> */}
            </div>
            
            <div className={`${styles.main} main`}>
                {/* Search Table */}
                <div className={styles.searchTable}>
                    <div className={styles.grid_container}>
                        <div className={styles.grid_head}>屬性</div>
                            {generateTypeButtons(typeFilter, setTypeFilter)}
                        <div className={styles.grid_head}>稀有度</div>
                            {generateRarityButtons(rarityFilter, setRarityFilter)}
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
                    { loading 
                    ? <h1 style={{color: "white", fontWeight: "bold"}}>loading</h1> 
                    : supportList.map(item => getItem(item))}
                </div>
            </div>
            
        </main>
    </>
}

function RefreshButton({onPress}) {
    return <button className={styles.refresh} onClick={onPress}>
        <img className="nav_icon" src="/icon/refresh.svg"></img>
    </button>
}

function ToggleButton({text, color, onToggle}) {
    const [pressed, setPressed] = useState(false);

    function handlePress() {
        onToggle();
        setPressed(!pressed);
    }

    const button = <button
        className={`toggle ${pressed ? "selected" : ""}`} 
        style={{background: color}}
        onClick={handlePress}>{text}
    </button>
    return button;  
}

function SupportCardItem({card, onClick}) {
    // return <div>{String(card)}</div>
    const [uuid, title, rarity, type]  = [card.uuid, card.name, card.rarity, mylib.translate(card.type)];
    const src = "/images/card/" + card.id.replace(" thumb ", "_thumb_") + ".png";

    return <Link href={`/support_card/${uuid}`}><div className={styles.support_card_item} onClick={onClick}>
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

function generateTypeButtons(typeFilter, setTypeFilter) {
    return typeList.map((value, index) => <ToggleButton
        text={value}
        color={`var(--${typesEnList[index]}-color)`}
        onToggle={() => { mylib.toggleFilterList(typeFilter, setTypeFilter, index) }}>
    </ToggleButton>)
}

function generateRarityButtons(rarityFilter, setRarityFilter) {
    return rarityList.map((value, index) => <ToggleButton
        text={value}
        color={`var(--${value.toLowerCase()}-color)`}
        onToggle={() => { mylib.toggleFilterList(rarityFilter, setRarityFilter, index) }}>
    </ToggleButton>)
}