import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '@/styles/SingleSupportCard.module.css'

import * as mylib from "../../lib"

export default function SingleSupportCard() {
    const router = useRouter();
    const [card, setCard] = useState(null);
    const [skills, setSkills] = useState([]);

    function getDataHtml() {
        if (router.isReady) {
            // Fetch skill data
            if (skills.length === 0) {
                fetch("/data/skill.json")
                .then(res => res.json())
                .then(res => {setSkills(res)})
                return <h1>loading</h1>
            }

            // Fetch card data and return `Page` element
            if (card === null) {
                fetch("/data/card.json")
                .then(res => res.json())
                .then(res => {
                    setCard(res.find(element => element.uuid == router.query.uuid))
                })
                return <h1>loading</h1>
            }
            else {
                // console.log(skills);
                return <Page card={card} skills={skills}></Page>
            }
        }
        else return <h1>loading</h1>
    }

    return (
    <>
        <Head>
            <title>{card === null ? "支援卡" : card.name}</title>
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

function Page({card, skills}) {
    const [showEffectTable, setShowEffectTable] = useState(false);

    // Columns of the effect grid
    const effColNum = card.rarity === "SSR" ?
        11 : (card.rarity === "SR" ? 10 : 9);

    return <div className={styles.main_column}>
        {/* Title Row */}
        <div className={styles.title_row}>
            {/* Card Image */}
            <img src={"/images/card/" + card.id + ".png"} className={styles.card_image}></img>
            {/* Card title */}
            <div className={styles.title_column}>
                <div className={styles.title}>{card.name}</div>
                <div className={styles.title_subrow}>
                    <img src={"/icon/" + mylib.translate(card.type) + ".png"} className={styles.type_icon}></img>
                    <div>{card.rarity}</div>
                </div>
                {/* Special Skills */}
                <div className={styles.special + " section"}>
                    <div>固有技能</div>
                    <hr></hr>
                    <div className={styles.special_grid}>
                        <SpecialGrid special={card.special}></SpecialGrid>
                    </div>
                </div>
            </div>
        </div>

        {/* Effect Table */}
        <div className={styles.effect_col + " section"}>
            <div className={styles.effect_row}>
                <div className={styles.effect_title}>卡片效果</div>
                <ToggleButton
                    text="顯示詳細內容"
                    onToggle={() => setShowEffectTable(!showEffectTable)}>
                </ToggleButton>
            </div>
            <hr style={{width: "100%"}}></hr>
            <div className={styles.effect_flex}>
                <EffectGrid
                    effetcs={card.effect} 
                    effColNum={effColNum} 
                    showTable={showEffectTable}>
                </EffectGrid>
            </div>
        </div>
        
        {/* Skill Row */}
        <div className={styles.skill_row}>
            {/* Hint skills */}
            <div className="section" style={{width: "40%"}}>
                <div>靈感技能</div>
                <hr></hr>
                <div className={styles.skill_col}>
                    <mylib.SkillCol skills={card.hint_skills} skillList={skills}></mylib.SkillCol>
                </div>
            </div>
            {/* Event Skills */}
            <div className="section" style={{width: "40%"}}>
                <div>事件技能</div>
                <hr></hr>
                <div className={styles.skill_col}>
                    <mylib.SkillCol skills={card.event_skills} skillList={skills}></mylib.SkillCol>
                </div>
            </div>
        </div>
    </div>
}

function SpecialGrid({special}) {
    return <>{
    mylib.objToArray(special).map(element => {
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

function EffectGrid({effetcs, effColNum, showTable}) {
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
    mylib.objToArray(effetcs).map(element => {
        const [key, item] = element;
        return <div className={styles.effect_grid} style={{gridTemplateColumns: `repeat(${effColNum}, auto)`}}>
            {/* Table title */}
            <div className={styles.effect_name}>{key}</div>
            <div className={styles.effect_value}>{item[item.length-1]}</div>
            {/* Table head */}
            {showTable ? item.map((_, index) => <GridHead index={index}></GridHead>) : null}
            {/* Table body */}
            {showTable ? item.map((value, index) => <GridBody value={value} index={index}></GridBody>) : null}
        </div>
    })
    }</>
}

// function SkillCol({card_skills, skillList}) {
//     function SkillBlock({skill}) {
//         // Find the skill data from the `skillList`
//         const skillData = skillList.find(element => element["3"] == skill)
//         const [name, icon, desc] = [skillData["3"], skillData["17"], skillData["8"]]
//         // console.log(skillData);
        
//         return <div className="skill_block">
//             <img src={"/images/skill/Utx_ico_skill_" + icon + ".png"} className="skill_icon"></img>
//             <div className="skill_block_col">
//                 <div className="skill_name">{name}</div>
//                 <div className="skill_desc">{desc}</div>
//             </div>
//         </div>
//     }

//     return <>{
//         card_skills.map(element => <SkillBlock skill={element}></SkillBlock>)
//     }</>
// }

function ToggleButton({text, onToggle}) {
    const [pressed, setPressed] = useState(false);

    function handlePress() {
        onToggle();
        setPressed(!pressed);
    }

    const button = <button
        className={`${styles.toggle_button} toggle ${pressed ? "selected" : ""}`} 
        onClick={handlePress}>{text}
    </button>
    return button;  
}
