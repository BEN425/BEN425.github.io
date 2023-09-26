import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/RacePage.module.css";
import { useRouter } from "next/router";

export default function RacePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	// Load race json file
	const [raceList, setRaceList] = useState({});
	async function fetchJson() {
		setLoading(true);
		await fetch("/data/race.json")
			.then(res => res.json())
			.then(res => {
				setRaceList(res);
			});
		setLoading(false);
	}

	useEffect(() => {
		fetchJson();
	}, []);

	function getItem(item) {
		return (
			<RaceItem
				race={item}
				onClick={() => {
					router.push({
						pathname: "/race/[uuid]",
						query: {
							uuid: item.uuid,
						},
					});
				}}></RaceItem>
		);
	}

	return (
		<>
			<Head>
				<title>競賽一覽</title>
			</Head>

			<main>
				{/* Navigation Bar */}
				<div className="navbar">
					<Link href="/">
						<img
							className="nav_icon"
							src="/icon/arrow_back.svg"></img>
					</Link>
					<div className="nav_title">競賽一覽</div>
					<div style={{ flexGrow: 1 }}></div> {/* Space holder */}
					{/* <RefreshButton></RefreshButton> */}
				</div>

				<div className={`${styles.main} main`}>
					{/* Search Table */}
					<div className={styles.searchTable}>
						<div className={styles.grid_container}>
							{/* Search Bar */}
							<div className={styles.grid_head}>搜尋</div>
							<input
								type="text"
								className="search"
								placeholder="以名稱搜尋"
								style={{ gridColumn: "2/-1" }}></input>
						</div>
					</div>

					<hr
						style={{
							marginTop: "20px",
							marginBottom: "20px",
						}}></hr>

					{/* Race Section */}
					<div className={styles.race_grid_container}>
						{loading ? (
							<h1 style={{ color: "white", fontWeight: "bold" }}>
								Loading
							</h1>
						) : (
							<>
								{raceList.G1.map(item => getItem(item))}
								{raceList.G2.map(item => getItem(item))}
								{raceList.G3.map(item => getItem(item))}
								{raceList.OP.map(item => getItem(item))}
								{raceList.Pre.map(item => getItem(item))}
							</>
						)}
					</div>
				</div>
			</main>
		</>
	);
}

function RaceItem({ race, onClick }) {
	const [name, link] = [race.name, race.link.split("/")];
	const id = link[link.length - 1];

	// console.log(race);
	return (
		<Link
			href={`/race/${race.uuid}`}
			onClick={onClick}
			className={styles.race_item}>
			<img
				src={`/images/race/${id}.png`}
				className={styles.race_image}></img>
			<div>{name}</div>
		</Link>
	);
}
