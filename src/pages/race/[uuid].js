import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "@/styles/SingleRace.module.css";

import * as mylib from "../../lib";

export default function SingleRace() {
	const router = useRouter();
	const [race, setRace] = useState(null);

	function getDataHtml() {
		if (router.isReady) {
			// Fetch card data and return `Page` element
			if (race === null) {
				fetch("/data/race.json")
					.then(res => res.json())
					.then(res => {
						setRace(
							res.G1.concat(res.G2, res.G3, res.OP, res.Pre).find(
								item => item.uuid == router.query.uuid
							)
						);
					});
				return <h1>loading</h1>;
			} else {
				// console.log(skills);
				return <Page race={race}></Page>;
			}
		} else return <h1>loading</h1>;
	}

	return (
		<>
			<Head>
				<title>{race === null ? "競賽" : race.name}</title>
			</Head>
			<main>
				{/* Navigation Bar */}
				<div className="navbar">
					<Link href="/race">
						<img
							className="nav_icon"
							src="/icon/arrow_back.svg"></img>
					</Link>
					<div className="nav_title">競賽查詢</div>
					<div style={{ flexGrow: 1 }}></div> {/* Space holder */}
				</div>

				{/* Main Section */}
				<div className={`${styles.main} main`}>{getDataHtml()}</div>
			</main>
		</>
	);
}

function Page({ race }) {
	const [name, link] = [race.name, race.link.split("/")];
	const id = link[link.length - 1];
	return (
		<div className={styles.main_column}>
			{/* Title Row */}
			<div className={styles.title_row + " section"}>
				<img
					src={`/images/race/${id}.png`}
					className={styles.race_image}></img>
				<div>{name}</div>
			</div>

			{/* Data Row */}
			<div className={styles.data_row}>
				<div
					className="section"
					style={{ width: "25%", minWidth: "250px" }}>
					<div>基本資料</div>
					<hr></hr>
					<BasicGrid data={race.basic}></BasicGrid>
				</div>
				<div
					className="section"
					style={{ width: "25%", minWidth: "300px" }}>
					<div>賽道分布</div>
					<hr></hr>
					<CourseGrid data={race.course}></CourseGrid>
				</div>
			</div>

			{/* Course Graph */}
			<div
				className="section middle"
				style={{ width: "90%", minWidth: "1000px" }}>
				<div>賽道分布圖</div>
				<hr></hr>
				<CourseGraph
					distance={race.basic.distance}
					phase={race.phase}
					course={race.course}></CourseGraph>
			</div>
		</div>
	);
}

function BasicGrid({ data }) {
	return (
		<div
			className={styles.data_grid}
			style={{
				columnGap: "20%",
				gridTemplateColumns: "35% auto",
			}}>
			<div className={styles.grid_head}>等級</div> <div>{data.grade}</div>
			<div className={styles.grid_head}>日期</div> <div>{data.date.replace(" ", "")}</div>
			<div className={styles.grid_head}>場地</div> <div>{data.place}</div>
			<div className={styles.grid_head}>賽道</div> <div>{data.course}</div>
			<div className={styles.grid_head}>方向</div> <div>{data.direction}</div>
			<div className={styles.grid_head}>距離</div> <div>{data.distance}</div>
			<div className={styles.grid_head}>賽場檢定</div> <div>{data.comp_status}</div>
		</div>
	);
}

function CourseGrid({ data }) {
	function getKey(key) {
		return key
			.replace("straight", "直線")
			.replace("corner", "彎道")
			.replace("uphill", "上坡")
			.replace("downhill", "下坡")
			.replace("none", "無");
	}

	function getValue(value) {
		return (
			<>
				{value.map(element => (
					<div>{element}</div>
				))}
			</>
		);
	}

	return (
		<div
			className={styles.data_grid}
			style={{
				columnGap: "10%",
				gridTemplateColumns: "20% auto",
			}}>
			{mylib.objToArray(data).map(element => {
				const [key, value] = element;
				return (
					<>
						<div
							style={{ gridRow: `span ${value.length}` }}
							className={styles.grid_head}>
							{getKey(key)}
						</div>
						{getValue(value)}
					</>
				);
			})}
		</div>
	);
}

function CourseGraph({ distance, phase, course }) {
	function getLength(range) {
		const temp = range.split("~").map(element => parseInt(element));
		return temp[1] - temp[0];
	}

	function DistanceTooltip({ distance, range, show = true, left = false }) {
		return (
			<div
				className={styles.dist_tooltip}
				style={{ display: show ? "block" : "none", left: left ? 0 : "100%" }}>
				{distance === undefined ? range.split("~")[1] : distance}
			</div>
		);
	}

	function TypeTooltip({ type, text }) {
		const textDirection = {
			writingMode: "vertical-lr",
			textOrientation: "upright",
		};

		return (
			<div
				className={styles.type_tooltip}
				style={
					text === undefined && parseInt(distance) >= 2500 ? textDirection : undefined
				}>
				{text === undefined
					? type
							.replace("corner", "彎道")
							.replace("straight", "直線")
							.replace("none", "無")
					: text}
			</div>
		);
	}

	function HillItem({ start, end, old_height, height, type }) {
		const [showTooltip, setShowTooltip] = useState(false);

		return (
			<div
				className={styles.graph_item}
				style={{ flexGrow: end - start, position: "relative" }}
				onMouseEnter={() => setShowTooltip(true)}
				onMouseLeave={() => setShowTooltip(false)}>
				<div
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
						background: `var(--${type}-color)`,
						clipPath: `polygon(0% ${old_height}%,
							100% ${height}%,
							100% 100%, 0% 100%)`,
					}}></div>
				<DistanceTooltip
					show={showTooltip}
					distance={start}
					left={true}></DistanceTooltip>
				<DistanceTooltip
					distance={end}
					show={showTooltip}></DistanceTooltip>
			</div>
		);
	}

	function HillGraph() {
		// Default height of the hill graph in percentage
		let height = 40;

		function RangeToElement(hill) {
			const [start, end, slope, type] = [hill[0][0], hill[0][1], hill[0][2], hill[1]];
			const old_height = height;
			height -= ((end - start) * slope * 7.2) / 100;

			return (
				<HillItem
					start={start}
					end={end}
					height={height}
					old_height={old_height}
					type={type}></HillItem>
			);
		}

		// `hillRanges` contains hill datas like [[start, end, slope(%)], type]
		// `start` and `end` tell the position of the hill and are both `int`.
		// `type` is string. It can be uphill or downhill.
		let hillRanges = [];
		mylib
			.objToArray(course)
			.filter(i => i[0].includes("hill"))
			.forEach(i => {
				const [type, rangeList] = i;
				rangeList.forEach(range => {
					hillRanges.push([
						range
							.replace("（", " ")
							.replace("~", "")
							.split(RegExp(" +"))
							.map(k => parseInt(k)),
						type,
					]);
				});
			});
		hillRanges.sort((a, b) => a[0][0] - b[0][0]);

		// hillComps contains all elements representing a hill or a flat
		let hillComps = [];
		for (let i = 0; i < hillRanges.length; i++) {
			const [item, next] = [hillRanges[i], hillRanges[i + 1]];

			// Skip flat
			if (item[1] === "flat") continue;

			// If the first hill does not start from 0, insert a flat before the first hill
			if (i == 0 && item[0][0] > 0) hillComps.push([[0, item[0][0], 0], "flat"]);

			// Add the current hill
			hillComps.push(item);

			// If there is a gap between the current hill and the next hill, insert a flat between them
			if (next != undefined && item[0][1] < next[0][0])
				hillComps.push([[item[0][1], next[0][0], 0], "flat"]);

			// If the current hill is the last hill and does not end at the goal, insert a flat after the hill
			if (next == undefined && item[0][1] < parseInt(distance))
				hillComps.push([[item[0][1], parseInt(distance), 0], "flat"]);
		}
		console.log(hillComps);

		hillComps = hillComps.map(RangeToElement);

		// No hills, add a flat from start to end
		if (hillComps.length == 0)
			hillComps.push(
				<div
					style={{
						background: "var(--flat-color)",
						flexGrow: 1,
						clipPath: `polygon(0% ${height}%, 100% ${height}%, 100% 100%, 0% 100%)`,
					}}></div>
			);

		return <div className={styles.graph_row}>{hillComps}</div>;
	}

	function PhaseGraph() {
		return (
			<div
				className={styles.graph_row}
				style={{ borderTop: "5px #884A39 solid" }}>
				<div
					className={styles.graph_item}
					style={{
						background: "var(--opening-color)",
						flexGrow: getLength(phase.opening_phase),
					}}>
					<TypeTooltip text="序盤"></TypeTooltip>
					<DistanceTooltip range={phase.opening_phase}></DistanceTooltip>
				</div>
				<div
					className={styles.graph_item}
					style={{
						background: "var(--middle-color)",
						flexGrow: getLength(phase.middle_phase),
					}}>
					<TypeTooltip text="中盤"></TypeTooltip>
					<DistanceTooltip range={phase.middle_phase}></DistanceTooltip>
				</div>
				<div
					className={styles.graph_item}
					style={{
						background: "var(--endding-color)",
						flexGrow: parseInt(distance) - parseInt(phase.endding_phase.split("~")[0]),
					}}>
					<TypeTooltip text="終盤"></TypeTooltip>
				</div>
			</div>
		);
	}

	function CornerGraph() {
		// `ranageList` contains datas of corners and straights
		// Each element is a range like [range, course_type]
		// For example, ["0 ~ 100", "straight1"]
		let rangeList = [];
		// Exclude hills
		mylib.objToArray(course).forEach(element => {
			const [key, value] = element;
			if (!key.includes("hill")) {
				// console.log(value);
				value.forEach(v => {
					rangeList = rangeList.concat([[v, key]]);
				});
			}
		});
		// Sort the range list
		rangeList.sort((a, b) => {
			const startA = parseInt(a[0].split("~"));
			const startB = parseInt(b[0].split("~"));
			return startA - startB;
		});

		// console.log(rangeList);
		return (
			<div
				className={styles.graph_row + " bottom"}
				style={{ borderTop: "5px #396362 solid" }}>
				{rangeList.map((element, index) => {
					const [range, type] = element;
					return (
						<div
							className={styles.graph_item}
							style={{
								backgroundColor: `var(--${type}-color)`,
								flexGrow: getLength(range),
							}}>
							<TypeTooltip type={type}></TypeTooltip>
							<DistanceTooltip
								range={range}
								show={index != rangeList.length - 1}></DistanceTooltip>
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div className={styles.course_graph}>
			<HillGraph></HillGraph>
			<PhaseGraph></PhaseGraph>
			<CornerGraph></CornerGraph>
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
			{text}
		</button>
	);
	return button;
}
