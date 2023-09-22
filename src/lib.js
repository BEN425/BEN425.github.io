const table = {
    "速度": "speed",
    "耐力": "stamina",
    "持久力": "stamina",
    "力量": "power",
    "毅力": "guts",
    "意志力": "guts",
    "智力": "wisdom",
    "友人": "friend",
    "团队": "team",
    "团隊": "team",
    "團隊": "team",
}
export function translate(input) {return table[input]}

export function objToArray(obj) {
    return Array.from(new Map(Object.entries(obj)))
}

export function toggleFilterList(list, setter, index) {
    const newList = list.slice()
    newList[index] = !newList[index]
    setter(newList)
    // console.log(newList)
}

export function SkillBlock({skill, skillList}) {
    // Find the skill data from the `skillList`
    const skillData = skillList.find(element => element["3"] == skill)
    const [name, icon, desc] = [skillData["3"], skillData["17"], skillData["8"]]
    // console.log(skillData);
    
    return <div className="skill_block">
        <img src={"/images/skill/Utx_ico_skill_" + icon + ".png"} className="skill_icon"></img>
        <div className="skill_block_col">
            <div className="skill_name">{name}</div>
            <div className="skill_desc">{desc}</div>
        </div>
    </div>
}

export function SkillCol({skills, skillList}) {
    return <>{
        skills.map(element => <SkillBlock skill={element} skillList={skillList}></SkillBlock>)
    }</>
}