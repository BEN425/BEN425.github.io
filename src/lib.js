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