import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/ChampionPage.module.css";

import * as mylib from "../lib";

export default function ChampionPage() {
	const [showTable1, setShowTable1] = useState(true);
	const [showTable2, setShowTable2] = useState(true);
	const [showTable3, setShowTable3] = useState(true);
	const [loading, setLoading] = useState(true);
	const [raceList, setRaceList] = useState([]);
	const [cmList, setCmList] = useState([]);

	async function fetchJson() {
		setLoading(true);
		await fetch("/data/race.json")
			.then(res => res.json())
			.then(res => {
				setRaceList(res);
			});
		await fetch("/data/champion.json")
			.then(res => res.json())
			.then(res => {
				setCmList(res);
			});
		setLoading(false);
	}

	useEffect(() => {
		fetchJson();
	}, []);

	return (
		<>
			<Head>
				<title>冠軍集會</title>
			</Head>

			<main>
				{/* Navigation Bar */}
				<div className="navbar">
					<Link href="/">
						<img
							className="nav_icon"
							src="/icon/arrow_back.svg"></img>
					</Link>
					<div className="nav_title">冠軍集會</div>
					<div style={{ flexGrow: 1 }}></div> {/* Space holder */}
					{/* <RefreshButton></RefreshButton> */}
				</div>

				{loading ? (
					<h1>loading</h1>
				) : (
					<div className={`${styles.main} main`}>
						{/* First year */}
						<div className="section">
							<div className={styles.title_row}>
								<div className={styles.title}>第一屆</div>
								<ToggleButton
									text={["展開", "收縮"]}
									onToggle={() => setShowTable1(!showTable1)}></ToggleButton>
							</div>
							{showTable1 ? (
								<RaceTable
									raceList={raceList}
									cmList={cmList[0]}></RaceTable>
							) : null}
						</div>
						{/* Second year */}
						<div className="section">
							<div className={styles.title_row}>
								<div className={styles.title}>第二屆</div>
								<ToggleButton
									text={["展開", "收縮"]}
									onToggle={() => setShowTable2(!showTable2)}></ToggleButton>
							</div>
							{showTable2 ? (
								<RaceTable
									raceList={raceList}
									cmList={cmList[1]}></RaceTable>
							) : null}
						</div>
						{/* Third year */}
						<div className="section">
							<div className={styles.title_row}>
								<div className={styles.title}>第三屆</div>
								<ToggleButton
									text={["展開", "收縮"]}
									onToggle={() => setShowTable3(!showTable3)}></ToggleButton>
							</div>
							{showTable3 ? (
								<RaceTable
									raceList={raceList}
									cmList={cmList[2]}></RaceTable>
							) : null}
						</div>
						{/* Walkthrough */}
						<div className="section">
							<div className={styles.title}>攻略</div>
							<hr style={{ width: "100%" }}></hr>
							<div className={styles.link}>
								<a href="https://www.youtube.com/playlist?list=PL_BTNAzC0OXjcGwWkoNKjp_ONe_RPGjRl">
									Youtube砂井裏鍵
								</a>
							</div>
							<div className={styles.link}>
								<a href="https://forum.gamer.com.tw/B.php?bsn=34421&subbsn=3">
									巴哈姆特
								</a>
							</div>
							<div className={styles.link}>
								<a href="https://onj-umamusume.game-info.wiki/d/%a5%c1%a5%e3%a5%f3%a5%d4%a5%aa%a5%f3%a5%ba%a5%df%a1%bc%a5%c6%a5%a3%a5%f3%a5%b0">
									おんJウマ娘wiki
								</a>
							</div>
							<div className={styles.link}>
								<a href="https://gamewith.jp/uma-musume/article/show/272329">
									GameWith
								</a>
							</div>
						</div>
					</div>
				)}
			</main>
		</>
	);
}

function RaceTable({ raceList, cmList }) {
	const title_row = ["名稱", "場地", "賽道", "距離", "方向", "季節", "天氣", "場地狀況"];
	return (
		<div className={styles.table}>
			<>
				{/* Header Row */}
				{title_row.map(item => (
					<div className={styles.grid_header}>{item}</div>
				))}
				{/* Body Rows */}
				{cmList.map(item =>
					// Check if LOH is held at this month
					item.name === "LOH" ? (
						<div
							className={styles.grid_item}
							style={{ gridColumn: "1/-1" }}>
							無舉辦
						</div>
					) : (
						<>
							<div className={styles.grid_item}>{item.name}</div>
							<div className={styles.grid_item}>{item.place}</div>
							<div
								className={styles.grid_item}
								style={{
									color:
										item.course === "草地"
											? "var(--grass-color)"
											: "var(--dirt-color)",
								}}>
								{item.course}
							</div>
							<div className={styles.grid_item}>{item.distance}</div>
							<div className={styles.grid_item}>{item.direction}</div>
							<div
								className={styles.grid_item}
								style={{
									color:
										item.season === "春"
											? "var(--spring-color)"
											: item.season === "夏"
											? "var(--summer-color)"
											: item.season === "秋"
											? "var(--fall-color)"
											: "var(--winter-color)",
								}}>
								{item.season}
							</div>
							<div
								className={styles.grid_item}
								style={{
									color:
										item.weather === "晴"
											? "var(--sunny-color)"
											: item.weather === "陰"
											? "var(--cloudy-color)"
											: item.weather === "雨"
											? "var(--rainy-color)"
											: "var(--snowy-color)",
								}}>
								{item.weather}
							</div>
							<div className={styles.grid_item}>{item.condition}</div>
						</>
					)
				)}
			</>
		</div>
	);
}

function ToggleButton({ text, onToggle }) {
	const [pressed, setPressed] = useState(false);

	function handlePress() {
		onToggle();
		setPressed(!pressed);
	}

	const button = (
		<button
			className={`${styles.toggle_button} toggle ${pressed ? "selected" : ""}`}
			onClick={handlePress}>
			{pressed ? text[0] : text[1]}
		</button>
	);
	return button;
}
