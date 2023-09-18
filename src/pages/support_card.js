import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import styles from '@/styles/SupportCardPage.module.css'

import * as mylib from "../lib"

export default function SupportCardPage() {
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
    useEffect(() => {console.log(typeFilter)});

    // Use router for dynamic routing to each support card page
    const router = useRouter();

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
                    {loading 
                    ? <h1 style={{color: "white", fontWeight: "bold"}}>loading</h1> 
                    : supportList.map(item =>{
                        // If the list is all false, the filter is off
                        let matchType = !typeFilter.includes(true);
                        let matchRarity = !rarityFilter.includes(true);
                        // Check filters
                        if (typeFilter[0] && "速度" === item.type) matchType = true;
                        if (typeFilter[1] && "耐力" === item.type) matchType = true;
                        if (typeFilter[2] && "力量" === item.type) matchType = true;
                        if (typeFilter[3] && "毅力" === item.type) matchType = true;
                        if (typeFilter[4] && "智力" === item.type) matchType = true;
                        if (typeFilter[5] && "友人" === item.type) matchType = true;
                        if (typeFilter[6] && "团隊" === item.type) matchType = true;
                        if (rarityFilter[0] && "SSR" === item.rarity) matchRarity = true;
                        if (rarityFilter[1] && "SR" === item.rarity) matchRarity = true;
                        if (rarityFilter[2] && "R" === item.rarity) matchRarity = true;

                        return matchType && matchRarity ? <SupportCardItem
                            card={item}
                            onClick={() => { router.push({
                                pathname: "/support_card/[id]",
                                query: {
                                    id: item.id
                                },
                            })}}>
                        </SupportCardItem> : null;
                        })
                    }
                </div>
            </div>
            
        </main>
    </>
    )
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
    const [title, rarity, type]  = [card.name, card.rarity, mylib.translate(card.type)];
    const src = "/images/card/" + card.id.replace(" thumb ", "_thumb_") + ".png";

    return <div className={styles.support_card_item} onClick={onClick}>
        <img src={src} className={styles.support_card_image}></img>
        <div className={styles.support_card_sub}>
            <div className={styles.support_card_title}>{title}</div>
            {/* <div className={styles.support_card_title}>{name}</div> */}
            <div className={styles.support_card_sub_sub}>
                <div className={styles.support_card_type} style={{backgroundImage: `url(/icon/${type}.png)`}}></div>
                <div>{rarity}</div>
            </div>
        </div>
    </div>
}

function generateTypeButtons(typeFilter, setTypeFilter) {
    const types = ["速度", "持久力", "力量", "意志力", "智力", "友人", "團隊"]
    const typesEn = ["speed", "stamina", "power", "guts", "wisdom", "friend", "group"]

    return types.map((value, index) => <ToggleButton
        text={value}
        color={`var(--${typesEn[index]}-color)`}
        onToggle={() => { mylib.toggleFilterList(typeFilter, setTypeFilter, index) }}>
    </ToggleButton>)
}

function generateRarityButtons(rarityFilter, setRarityFilter) {
    const rarity = ["SSR", "SR", "R"]

    return rarity.map((value, index) => <ToggleButton
        text={value}
        color={`var(--${value.toLowerCase()}-color)`}
        onToggle={() => { mylib.toggleFilterList(rarityFilter, setRarityFilter, index) }}>
    </ToggleButton>)
}