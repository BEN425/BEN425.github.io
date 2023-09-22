import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/SkillPage.module.css'

export default function SkillPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
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

    // function getDataHtml() {
    //     return skillList.map(item => <SkillItem skill={item}></SkillItem>)
    // }

    return (
    <>
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
                <RefreshButton></RefreshButton>
            </div>
            
            <div className={`${styles.main} main`}>
                {/* Search Table */}
                <div className={styles.searchTable}>
                    <div className={styles.grid_container}>
                        <div className={styles.grid_head}>稀有度</div>
                        <ToggleButton text="普通" color="var(--r-color)"></ToggleButton>
                        <ToggleButton text="稀有" color="var(--sr-color)"></ToggleButton>
                        <ToggleButton text="固有" color="var(--ssr-color)"></ToggleButton>
                        <ToggleButton text="繼承" color="var(--r-color)"></ToggleButton>
                        <ToggleButton text="劇情" color="var(--toggle-color)"></ToggleButton>
                        <div className={styles.grid_head} style={{gridRow: "2/5"}}>條件限制</div>
                        <ToggleButton text="通用" color="var(--toggle-color)"></ToggleButton>
                        <div></div><div></div><div></div><div></div>
                        <ToggleButton text="沙地" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="短距離" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="一哩" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="中距離" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="長距離" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="領頭" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="前列" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="居中" color="var(--toggle-color)"></ToggleButton>
                        <ToggleButton text="後追" color="var(--toggle-color)"></ToggleButton>
                        <div></div>
                        <div className={styles.grid_head}>技能類型</div>
                        <ToggleButton text="綠技" color="var(--wisdom-color)"></ToggleButton>
                        <ToggleButton text="黃技" color="var(--power-color)"></ToggleButton>
                        <ToggleButton text="藍技" color="var(--speed-color)"></ToggleButton>
                        <ToggleButton text="紅技" color="var(--stamina-color)"></ToggleButton>
                        <ToggleButton text="紫技" color="var(--purple-color)"></ToggleButton>
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
                    : skillList.map(item => <SkillItem
                        skill={item}
                        onClick={() => { router.push({
                            pathname: "/skill/[name]",
                            query: {
                                name: item["3"]
                            },
                        })}}>
                    </SkillItem>)}
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

function SkillItem({skill, onClick}) {
    const [name, id, desc] = [skill["3"], skill["17"], skill["8"]]

    return <Link href={`/skill/${skill["3"]}`}><div className={styles.skill_item} onClick={onClick}>
        <img src={"/images/skill/Utx_ico_skill_" + id + ".png"} className={styles.skill_image}></img>
        <div className={styles.skill_sub}>
            <div className={styles.skill_name}>{name}</div>
            <div className={styles.skill_desc}>{desc}</div>
        </div>
    </div></Link>
}