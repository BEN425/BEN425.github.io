import Head from "next/head";
import Link from "next/link";

import styles from "@/styles/Home.module.css";

export default function Home() {
	const intro_text =
		"Uma Site 是以一人製作出來的賽馬娘資訊網站，會不定時更新。如果作者有時間的話未來可能新增更多功能。如果資訊有錯誤也歡迎提出更正。";

	return (
		<>
			<Head>
				<title>Uma Site</title>
				<meta
					name="description"
					content="Custom Umamusume Website by BEN425"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link
					rel="icon"
					href="/favicon.ico"
				/>
			</Head>

			<main style={{ margin: "10px" }}>
				{/* Top Row */}
				<div className={`${styles.top_row} row`}>
					<div className={`${styles.icon} ${styles.col}`}></div>
					<div className={`${styles.title} ${styles.col}`}>Uma Site</div>
					<div
						className={`${styles.intro} ${styles.col}`}
						style={{ display: "none" }}>
						<div className={styles.sns_row}>
							<div className={styles.about}>簡介</div>
							<div style={{ flexGrow: 1 }}></div> {/* Placeholder */}
							<button
								className={styles.sns_button}
								id={styles.gamer_button}>
								巴哈姆特
							</button>
						</div>
						<div>{intro_text}</div>
					</div>
				</div>

				{/* Main Section */}
				<div className="main">
					<div className={styles.grid_title_container}>
						<div className={styles.title_line}></div>
						<div className={styles.grid_title}>功能一覽</div>
						<div className={styles.title_line}></div>
					</div>
					<div className={styles.grid_container}>
						<GridItem
							title="支援卡查詢"
							image="/icon/SSR.png"
							link="/support_card"></GridItem>
						<GridItem
							title="賽馬娘查詢"
							image="/icon/Chara.png"
							link="/chara"></GridItem>
						<GridItem
							title="技能查詢"
							image="/icon/Skill.png"
							link="/skill"></GridItem>
						<GridItem
							title="競賽查詢"
							image="/icon/Race.png"
							link="/race"></GridItem>
						{/* <GridItem title="測試" link="/test"></GridItem> */}
					</div>
				</div>

				<div
					className="main"
					style={{ marginTop: "20px" }}>
					<div className={styles.grid_title_container}>
						<div className={styles.title_line}></div>
						<div className={styles.grid_title}>關於網站</div>
						<div className={styles.title_line}></div>
					</div>

					<div className={styles.text}>
						此網站是作者個人興趣加上學習目的才製作出來的網站，會不定期更新及修正錯誤。
					</div>
					<div className={styles.text}>資料來源：</div>
					<div>
						<a
							href="https://wiki.biligame.com/umamusume/%E9%A6%96%E9%A1%B5"
							className={styles.link}>
							賽馬娘 BiliWiki
						</a>
					</div>
					<div>
						<a
							href="https://xn--gck1f423k.xn--1bvt37a.tools/"
							className={styles.link}>
							Utools
						</a>
					</div>
					<div>
						<a
							href="https://zh.moegirl.org.cn/zh-tw/%E8%B5%9B%E9%A9%AC%E5%A8%98_Pretty_Derby/%E8%AF%91%E5%90%8D%E5%AF%B9%E7%85%A7%E8%A1%A8"
							className={styles.link}>
							萌娘百科
						</a>
					</div>
				</div>
			</main>
		</>
	);
}

function GridItem({ title, image, link }) {
	return (
		<Link
			className={styles.grid_item}
			href={link}>
			<img
				src={image}
				height="48px"></img>
			<div>{title}</div>
		</Link>
	);
}
