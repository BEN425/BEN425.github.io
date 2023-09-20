import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '@/styles/SingleChara.module.css'

import * as mylib from "../../lib"

export default function SingleSupportCard() {
    const router = useRouter();
    const [chara, setChara] = useState(null);
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

            // Fetch character data and return <Page>
            if (chara === null) {
                fetch("/data/chara.json")
                .then(res => res.json())
                .then(res => {
                    setChara(res.find(element => element.id == router.query.id))
                })
                return <h1>loading</h1>
            }
            else {
                // console.log(chara);
                return <Page chara={chara} skills={skills}></Page>
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
                <div className="nav_title">角色查詢</div>
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

function Page({chara, skills}) {
    return <div className={styles.main_column}>
        {/* Title Row */}
        <div className={styles.title_row}>
            {/* Character image */}
            <img src={"/images/chara/" + chara.id + ".png"} className={styles.chara_image}></img>
            {/* Title Column */}
            <div className={styles.title_col}>
                <div className={styles.title}>{`【${chara.title}】${chara.name}`}</div>
                {/* Intro */}
                <div className={styles.intro}><Intro texts={chara.intro} stars={chara.stars}></Intro></div>
            </div>
        </div>

        {/* Row 1 */}
        <div className={styles.basic_row}>
            {/* Profile */}
            <div className="section middle" style={{width: "40%"}}>
                <div>個人資料</div>
                <hr></hr>
                <div>
                    <Profile 
                        cv={chara.cv} 
                        birthday={chara.birthday} 
                        height={chara.height} 
                        weight={chara.weight} 
                        profile={chara.profile}>
                    </Profile>
                </div>
            </div>
            {/* Talents, Growing Rate, Nickname */}
            <div className={styles.subcol1}>
                <div className="section middle">
                    <div>資質適性</div>
                    <hr></hr>
                    <TalentGrid
                        talent={chara.talent}
                        growing_rate={chara.growing_rate}>
                    </TalentGrid>
                </div>
                <div className="section middle">
                    <div>專屬別稱</div>
                    <hr></hr>
                    <div className={styles.nickname_col}>
                        <div>{chara.nickname.name}</div>
                        <div>{chara.nickname.condition}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function Intro({texts, stars}) {
    return <>
    <div>{"☆".repeat(parseInt(stars))}</div>
    <div>
    {
        Array.from(texts).map(item => <div>{item}</div>)
    }</div></>
}

function Profile({cv, profile}) {
    function GridSepLine() {
        return <>
        <hr style={{gridColumn: "1/-1", width: "100%"}}></hr>
        <div style={{gridColumn: "1/-1", width: "100%"}}></div>
        </>
    }

    function GridRow({name}) {
        return <>
        <div>{name}</div> <div>{profile[name]}</div>
        </>
    }

    return <div className={styles.profile_grid}>
    <div>聲優</div> <div>{cv}</div>
    <GridRow name="生日"></GridRow>
    <GridRow name="身高"></GridRow>
    <GridRow name="體重"></GridRow>
    <GridSepLine></GridSepLine>
    <GridRow name="自我介紹"></GridRow>
    <GridRow name="年級"></GridRow>
    <GridRow name="所屬宿舍"></GridRow>
    <GridSepLine></GridSepLine>
    <GridRow name="擅長的事"></GridRow>
    <GridRow name="不擅長的事"></GridRow>
    <GridSepLine></GridSepLine>
    <GridRow name="關於耳朵"></GridRow>
    <GridRow name="關於尾巴"></GridRow>
    <GridRow name="鞋子尺寸"></GridRow>
    <GridRow name="關於家人"></GridRow>
    </div>
}

function TalentGrid({talent, growing_rate}) {
    const talent_table = [
        "草地", "沙地",
        "短距離", "一哩", "中距離", "長距離",
        "領頭", "前列", "居中", "後追"
    ]
    const type_table = [
        "speed", "stamina", "power", "guts", "wisdom"
    ]

    return <>
        <div className={styles.talent_grid}>
            <div>場地</div>
            { talent.slice(0, 2).map((item, index) => <div style={{color: `var(--${item}-color)`}}>
                {`${talent_table[index]} ${item}`}
            </div>) }
            <div></div><div></div>
            <div>距離</div>
            { talent.slice(2, 6).map((item, index) => <div style={{color: `var(--${item}-color)`}}>
                {`${talent_table[index+2]} ${item}`}
            </div>) }
            <div>跑法</div>
            { talent.slice(6, 10).map((item, index) => <div style={{color: `var(--${item}-color)`}}>
                {`${talent_table[index+6]} ${item}`}
            </div>) }
        </div>
        <div className={styles.grow_grid}>
            <div>成長率</div>
            {growing_rate.map((item, index) => <div style={{color: `var(--${type_table[index]}-color)`}}>{item}</div>)}
        </div>
    </>
}

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
