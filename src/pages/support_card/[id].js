import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from '@/styles/SingleSupportCard.module.css'

export default function SingleSupportCard() {
    const router = useRouter();
    const [card, setCard] = useState(null);

    function getDataHtml() {
        if (router.isReady) {
            if (card === null) {
                fetch("/data/card.json")
                .then(res => res.json())
                .then(res => {
                    setCard(res.find(element => element.id == router.query.id))
                })
                return <h1>loading</h1>
            }
            else {
                console.log(card);
                return <Page card={card}></Page>
            }
        }
        else return <h1>loading</h1>
    }

    return (
    <>
        <Head>
            <title>test</title>
        </Head>
        <main>
            {/* Navigation Bar */}
            <div className="navbar">
                <Link href="/support_card">
                    <img className="nav_icon" src="/icon/arrow_back.svg"></img>
                </Link>
                <div className="nav_title">支援卡查詢</div>
                <div style={{flexGrow: 1}}></div> {/* Space holder */}
            </div>

            {/* Main Section */}
            <div className={`${styles.main} main`}>
                {getDataHtml()}
            </div>
        </main>
    </>
    );
}

function Page({card}) {
    // Columns of the effect grid
    const effColNum = card.rarity === "SSR" ?
        11 : (card.rarity === "SR" ? 10 : 9);

    return <div className={styles.main_column}>
        {/* Title Row */}
        <div className={styles.title_row}>
            {/* Card Image */}
            <img src={"/images/card/" + card.id + ".png"}></img>
            {/* Card title */}
            <div className={styles.title_column}>
                <div className={styles.title}>{card.name}</div>
                <div className={styles.title_subrow}>
                    <img src={"/icon/" + translate(card.type) + ".png"} className={styles.type_icon}></img>
                    <div>{card.rarity}</div>
                </div>
                {/* Special Skills */}
                <div className={styles.special}>
                    <div>固有技能</div>
                    <hr></hr>
                    <div className={styles.special_grid}>
                        <SpecialGrid special={card.special}></SpecialGrid>
                    </div>
                </div>
            </div>
        </div>
        {/* Effect Table */}
        <div className={styles.effect_col}>
            <div className={styles.effect_title}>卡片效果</div>
            <hr style={{width: "100%"}}></hr>
            <div className={styles.effect_flex}>
                <EffectGrid effetcs={card.effect} effColNum={effColNum}></EffectGrid>
            </div>
        </div>
        {/* Skill Row */}
    </div>
}

function SpecialGrid({special}) {
    return <>{
    objToArray(special).map(element => {
        const [key, item] = element;
        // Check whether key has value (the special skill has only a column)
        return (key === "") ? <>
            <div style={{gridColumn: "1 / 3"}}>{item}</div>
        </> : <>
            <div>{key}</div>
            <div>{item}</div>
        </>
    })
    }</>
}

function EffectGrid({effetcs, effColNum}) {
    function GridHead({index}) {
        // Check if the index is larger than column number
        if (index >= effColNum) return
        return <div className={styles.effect_grid_item}>{`Lv.${index === 0 ? 1 : index * 5}`}</div>
    }
    function GridBody({value, index}) {
        // Check if the index is larger than column number
        if (index >= effColNum) return
        return <div className={styles.effect_grid_item}>{value === "" ? "0" : value}</div>
    }

    return <>{
    objToArray(effetcs).map(element => {
        const [key, item] = element;
        return <div className={styles.effect_grid} style={{gridTemplateColumns: `repeat(${effColNum}, auto)`}}>
            {/* Table title */}
            <div className={styles.effect_name}>{key}</div>
            {/* Table head */}
            {item.map((_, index) => <GridHead index={index}></GridHead>)}
            {/* Table body */}
            {item.map((value, index) => <GridBody value={value} index={index}></GridBody>)}
        </div>
    })
    }</>
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

function objToArray(obj) {
    return Array.from(new Map(Object.entries(obj)))
}