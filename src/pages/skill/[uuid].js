import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '@/styles/SingleSkill.module.css'

import * as mylib from "../../lib"

export default function SingleSkill() {
    const router = useRouter();
    const [skill, setSkill] = useState(null);
    // const [skills, setSkills] = useState([]);

    function getDataHtml() {
        if (router.isReady) {
            // Fetch character data and return <Page>
            if (skill === null) {
                fetch("/data/skill.json")
                .then(res => res.json())
                .then(res => {
                    setSkill(res.find(item => item.uuid == router.query.uuid))
                })
                return <h1>loading</h1>
            }
            else {
                console.log(skill);
                return <Page skill={skill}></Page>
            }
        }
        else return <h1>loading</h1>
    }

    return <>
        <Head>
            <title>{skill === null ? "技能" : skill["3"]}</title>
        </Head>
        <main>
            {/* Navigation Bar */}
            <div className="navbar">
                <Link href="/skill">
                    <img className="nav_icon" src="/icon/arrow_back.svg"></img>
                </Link>
                <div className="nav_title">技能查詢</div>
                <div style={{flexGrow: 1}}></div> {/* Space holder */}
            </div>

            {/* Main Section */}
            <div className={`${styles.main} main`}>
                {getDataHtml()}
            </div>
        </main>
    </>
}

function Page({skill}) {
    const [name, rarity, limit, desc, cond, eff, dura, amount, icon, pt] = 
    [skill["3"], skill["5"], skill["6"], skill["8"], skill["10"],
    skill["11"], skill["13"], skill["12"], skill["17"], skill["19"]];
    
    return <div className={styles.main_column}>
        {/* Title row */}
        <div className={styles.title_row}>
            <img src={"/images/skill/Utx_ico_skill_" + icon + ".png"} className={styles.icon}></img>
            <div style={{fontFamily: "var(--title-font)", fontWeight: "bold"}}>{name}</div>
        </div>

        {/* Data grid */}
        <div className={styles.data_grid}>
            <div>名稱</div>   <div style={{fontFamily: "var(--title-font)", fontWeight: 600}}>{name}</div>
            <div>稀有度</div> <div>{rarity}</div>
            <div>限制</div>   <div>{limit}</div>
            <div>說明</div>   <div>{desc}</div>
            <div>條件</div>   <div>{cond}</div>
            <div>效果</div>   <div>{eff}</div>
            <div>持續時間</div>   <div>{dura}</div>
            <div>效果量</div>   <div>{amount}</div>
            <div>技能pt</div>   <div>{pt === "" ? 0 : pt}</div>
        </div>
    </div>
}