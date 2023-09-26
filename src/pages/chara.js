import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/CharaPage.module.css";
import { useRouter } from "next/router";

import * as mylib from "../lib";

const rarityList = ["三星", "二星", "一星"];

export default function CharaPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	// Filter
	const [rarityFilter, setRarityFilter] = useState(Array(3).fill(false));
	// Load character json file
	const [charaList, setCharaList] = useState([]);
	async function fetchJson() {
		setLoading(true);
		await fetch("/data/chara.json")
			.then(res => res.json())
			.then(res => {
				setCharaList(res);
			});
		setLoading(false);
		// console.log(charaList)
	}

	useEffect(() => {
		fetchJson();
	}, []);

	function getItem(item) {
		let matchRarity = !rarityFilter.includes(true);
		rarityList.forEach((_, index) => {
			if (rarityFilter[index] && parseInt(item.stars) == 3 - index)
				matchRarity = true;
		});
		// console.log(rarityFilter);

		return matchRarity ? (
			<CharaItem
				chara={item}
				onClick={() => {
					router.push({
						pathname: "/chara/[uuid]",
						query: {
							uuid: item.uuid,
						},
					});
				}}></CharaItem>
		) : null;
	}

	return (
		<>
			<Head>
				<title>角色一覽</title>
			</Head>

			<main>
				{/* Navigation Bar */}
				<div className="navbar">
					<Link href="/">
						<img
							className="nav_icon"
							src="/icon/arrow_back.svg"></img>
					</Link>
					<div className="nav_title">角色一覽</div>
					<div style={{ flexGrow: 1 }}></div> {/* Space holder */}
					{/* <RefreshButton></RefreshButton> */}
				</div>

				<div className={`${styles.main} main`}>
					{/* Search Table */}
					<div className={styles.searchTable}>
						<div className={styles.grid_container}>
							<div className={styles.grid_head}>稀有度</div>
							{generateRarityButtons(
								rarityFilter,
								setRarityFilter
							)}
							<div></div> {/* Placeholder */}
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

					{/* Character Section */}
					<div className={styles.chara_grid_container}>
						{loading ? (
							<h1 style={{ color: "white", fontWeight: "bold" }}>
								Loading
							</h1>
						) : (
							charaList.map(item => getItem(item))
						)}
					</div>
				</div>
			</main>
		</>
	);
}

function RefreshButton() {
	function handlePress() {
		// TODO
	}

	return (
		<button className={styles.refresh}>
			<img
				className="nav_icon"
				src="/icon/refresh.svg"></img>
		</button>
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
			className={`${styles.toggle_button} toggle ${
				pressed ? "selected" : ""
			}`}
			onClick={handlePress}>
			{text}
		</button>
	);
	return button;
}

function CharaItem({ chara, onClick }) {
	const [title, name, id, uuid] = [
		chara.title,
		chara.name,
		chara.id,
		chara.uuid,
	];

	return (
		<Link
			href={`/chara/${uuid}`}
			className={styles.chara_item}
			onClick={onClick}>
			<img
				className={styles.chara_image}
				src={"/images/chara/" + id + ".png"}></img>
			<div className={styles.chara_title}>{title}</div>
			<div className={styles.chara_name}>{name}</div>
		</Link>
	);
}

function generateRarityButtons(rarityFilter, setRarityFilter) {
	return rarityList.map((value, index) => (
		<ToggleButton
			text={value}
			onToggle={() => {
				mylib.toggleFilterList(rarityFilter, setRarityFilter, index);
			}}></ToggleButton>
	));
}
