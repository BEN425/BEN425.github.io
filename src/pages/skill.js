import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/SkillPage.module.css'

import * as mylib from "../lib"

const rarityList = ["普通", "稀有", "固有", "繼承", "劇情"]
const rarityColorList = ["r", "sr", "ssr", "r", "toggle"]
const limitList = ["通用", "沙地", "短距離", "一哩", "中距離", "長距離", "領頭", "前列", "居中", "後追"]
const typeList = ["綠技", "黃技", "藍技", "紅技", "紫技"]
const typeColorList = ["wisdom", "power", "speed", "stamina", "purple"]

export default function SkillPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    // Filter
    const [rarityFilter, setRarityFilter] = useState(Array(5).fill(false));
    const [limitFilter, setLimitFilter] = useState(Array(10).fill(false));
    const [typeFilter, setTypeFilter] = useState(Array(5).fill(false));
    // Load skill json file
    const [skillList, setSkillList] = useState([]);
    async function fetchJson() {
        setLoading(true)
        await fetch("/data/skill.json")
        .then(res => res.json())
        .then(res => {
            setSkillList(res)
        })
        setLoading(false)
        // console.log(skillList)
    }
    
    useEffect(() => {fetchJson()}, []);

    function getItem(item) {
        let matchRarity = !rarityFilter.includes(true);
        let matchLimit = !limitFilter.includes(true);
        let matchType = !typeFilter.includes(true);

        rarityList.forEach((value, index) => {
            if (rarityFilter[index] && item["5"] == value) matchRarity = true;
        })
        limitList.forEach((value, index) => {
            if (limitFilter[index] && item["6"] == value) matchLimit = true;
        })
        typeList.forEach((value, index) => {
            if (typeFilter[index] && item["7"][0] == value[0]) matchType = true;
        })

        return matchRarity && matchLimit && matchType ? <SkillItem
            skill={item}
            onClick={() => { router.push({
                pathname: "/skill/[uuid]",
                query: {
                    uuid: item.uuid
                }
            })}}>
        </SkillItem> : null
    }

    return <>
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
                {/* <RefreshButton></RefreshButton> */}
            </div>
            
            <div className={`${styles.main} main`}>
                {/* Search Table */}
                <div className={styles.searchTable}>
                    <div className={styles.grid_container}>
                        <div className={styles.grid_head}>稀有度</div>
                        {generateRairtyButtons(rarityFilter, setRarityFilter)}
                        <div className={styles.grid_head} style={{gridRow: "2/5"}}>條件限制</div>
                        {generateLimitButtons(limitFilter, setLimitFilter)}
                        <div></div>
                        <div className={styles.grid_head}>技能類型</div>
                        {generateTypeButtons(typeFilter, setTypeFilter)}
                        {/* Search Bar */}
                        <div className={styles.grid_head}>搜尋</div>
                        <input type="text" className="search" placeholder="以名稱搜尋" style={{gridColumn: "2/-1"}}></input>
                    </div>
                </div>

                <hr style={{
                    marginTop: "20px",
                    marginBottom: "20px"
                }}></hr>

                {/* Skill Section */}
                <div className={styles.skill_grid_container}>
                    {loading 
                    ? <h1 style={{color: "white", fontWeight: "bold"}}>Loading</h1> 
                    : skillList.map(item => getItem(item))}
                </div>
            </div>
            
        </main>
    </>
}

function RefreshButton() {
    function handlePress() {
        // TODO
    }

    return <button className={styles.refresh}>
        <img className="nav_icon" src="/icon/refresh.svg"></img>
    </button>
}

function ToggleButton({text, color, onToggle}) {
    const [pressed, setPressed] = useState(false);

    function handlePress() {
        onToggle()
        setPressed(!pressed);
    }

    const button = <button
        className={`toggle ${pressed ? "selected" : ""}`} 
        style={{background: color}}
        onClick={handlePress}>{text}
    </button>
    return button;
}

function SkillItem({skill, onClick}) {
    const [name, id, desc, uuid] = [skill["3"], skill["17"], skill["8"], skill.uuid]

    return <Link href={`/skill/${uuid}`}>
        <div className={styles.skill_item} onClick={onClick}>
            <img src={"/images/skill/Utx_ico_skill_" + id + ".png"} className={styles.skill_image}></img>
            <div className={styles.skill_sub}>
                <div className={styles.skill_name}>{name}</div>
                <div className={styles.skill_desc}>{desc}</div>
            </div>
        </div>
    </Link>
}

function generateRairtyButtons(rarityFilter, setRarityFilter) {
    return rarityList.map((value, index) => <ToggleButton
        text={value}
        color={`var(--${rarityColorList[index].toLowerCase()}-color)`}
        onToggle={() => { mylib.toggleFilterList(rarityFilter, setRarityFilter, index) }}>
    </ToggleButton>)
}

function generateLimitButtons(limitFilter, setLimitFilter) {
    return limitList.map((value, index) => <>
        <ToggleButton
            text={value}
            color={"var(--toggle-color)"}
            onToggle={() => { mylib.toggleFilterList(limitFilter, setLimitFilter, index) }}>
        </ToggleButton>
        {value === "通用" 
            ? <><div></div><div></div><div></div><div></div></> 
            : null}
    </>)
}

function generateTypeButtons(typeFilter, setTypeFilter) {
    return typeList.map((value, index) => <ToggleButton
        text={value}
        color={`var(--${typeColorList[index]}-color)`}
        onToggle={() => { mylib.toggleFilterList(typeFilter, setTypeFilter, index) }}>
    </ToggleButton>)
}