import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "@/styles/RacePage.module.css";
import { useRouter } from "next/router";

import * as mylib from "../lib";

const gradeList = ["G1", "G2", "G3", "OP", "Pre-OP"];
const directionList = ["順時針", "逆時針", "直線"];
const courseList = ["草地", "沙地"];
const distanceList = ["短距離", "一哩", "中距離", "長距離", "主要距離", "非主要距離"];
const placeList = [
	"札幌",
	"函館",
	"新潟",
	"福島",
	"中山",
	"東京",
	"中京",
	"京都",
	"阪神",
	"小倉",
	"大井",
	"川崎",
	"船橋",
	"盛岡",
	"隆尚",
];

export default function RacePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	// Filters
	const [gradeFilter, setGradeFilter] = useState(Array(5).fill(false));
	const [directionFilter, setDirectionFilter] = useState(Array(3).fill(false));
	const [courseFilter, setCourseFilter] = useState(Array(2).fill(false));
	const [distanceFilter, setDistanceFilter] = useState(Array(6).fill(false));
	const [placeFilter, setPlaceFilter] = useState(Array(15).fill(false));
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
		let matchGrade = !gradeFilter.includes(true);
		let matchDirection = !directionFilter.includes(true);
		let matchCourse = !courseFilter.includes(true);
		let matchDistance = !distanceFilter.includes(true);
		let matchPlace = !placeFilter.includes(true);

		// Check filters
		gradeList.forEach((value, index) => {
			if (gradeFilter[index] && item.basic.grade == value) matchGrade = true;
		});
		directionList.forEach((value, index) => {
			if (directionFilter[index] && item.basic.direction == value) matchDirection = true;
		});
		courseList.forEach((value, index) => {
			if (courseFilter[index] && item.basic.course == value) matchCourse = true;
		});
		if (distanceFilter[0] && parseInt(item.basic.distance) <= 1400) matchDistance = true;
		if (
			distanceFilter[1] &&
			1500 <= parseInt(item.basic.distance) &&
			parseInt(item.basic.distance) <= 1900
		)
			matchDistance = true;
		if (
			distanceFilter[2] &&
			2000 <= parseInt(item.basic.distance) &&
			parseInt(item.basic.distance) <= 2400
		)
			matchDistance = true;
		if (distanceFilter[3] && parseInt(item.basic.distance) >= 2500) matchDistance = true;
		if (distanceFilter[4] && parseInt(item.basic.distance) % 400 == 0) matchDistance = true;
		if (distanceFilter[5] && parseInt(item.basic.distance) % 400 != 0) matchDistance = true;
		placeList.forEach((value, index) => {
			if (placeFilter[index] && item.basic.place.includes(value)) matchPlace = true;
		});

		return matchGrade && matchDirection && matchCourse && matchDistance && matchPlace ? (
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
		) : null;
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
							<div className={styles.grid_head}>等級</div>
							{generateGradeButtons(gradeFilter, setGradeFilter)}
							<div className={styles.grid_head}>方向</div>
							{generateDirectionButtons(directionFilter, setDirectionFilter)}
							<div></div>
							<div></div>
							<div className={styles.grid_head}>場地</div>
							{generateCourseButtons(courseFilter, setCourseFilter)}
							<div></div>
							<div></div>
							<div></div>
							<div
								className={styles.grid_head}
								style={{ gridRow: "span 2" }}>
								距離
							</div>
							{generateDistanceButtons(distanceFilter, setDistanceFilter)}
							<div></div>
							<div></div>
							<div></div>
							<div
								className={styles.grid_head}
								style={{ gridRow: "span 3" }}>
								賽道
							</div>
							{generatePlaceButtons(placeFilter, setPlaceFilter)}
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
							<h1 style={{ color: "white", fontWeight: "bold" }}>Loading</h1>
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

function ToggleButton({ text, color, onToggle }) {
	const [pressed, setPressed] = useState(false);

	function handlePress() {
		onToggle();
		setPressed(!pressed);
	}

	const button = (
		<button
			className={`toggle ${pressed ? "selected" : ""}`}
			style={{ background: color }}
			onClick={handlePress}>
			{text}
		</button>
	);
	return button;
}

function generateGradeButtons(gradeFilter, setGradeFilter) {
	return gradeList.map((value, index) => (
		<ToggleButton
			text={value}
			color={`var(--${value.toLowerCase()}-color)`}
			onToggle={() => {
				mylib.toggleFilterList(gradeFilter, setGradeFilter, index);
			}}></ToggleButton>
	));
}

function generateDirectionButtons(directionFilter, setDirectionFilter) {
	return directionList.map((value, index) => (
		<ToggleButton
			text={value}
			color="var(--toggle-color)"
			onToggle={() => {
				mylib.toggleFilterList(directionFilter, setDirectionFilter, index);
			}}></ToggleButton>
	));
}

function generateCourseButtons(courseFilter, setCourseFilter) {
	return courseList.map((value, index) => (
		<ToggleButton
			text={value}
			color="var(--toggle-color)"
			onToggle={() => {
				mylib.toggleFilterList(courseFilter, setCourseFilter, index);
			}}></ToggleButton>
	));
}

function generateDistanceButtons(distanceFilter, setDistanceFilter) {
	return distanceList.map((value, index) => (
		<>
			<ToggleButton
				text={value}
				color="var(--toggle-color)"
				onToggle={() => {
					mylib.toggleFilterList(distanceFilter, setDistanceFilter, index);
				}}></ToggleButton>
			{value === "長距離" ? <div></div> : null}
		</>
	));
}

function generatePlaceButtons(placeFilter, setplaceFilter) {
	return placeList.map((value, index) => (
		<>
			<ToggleButton
				text={value}
				color="var(--toggle-color)"
				onToggle={() => {
					mylib.toggleFilterList(placeFilter, setplaceFilter, index);
				}}></ToggleButton>
			{value === "長距離" ? <div></div> : null}
		</>
	));
}
