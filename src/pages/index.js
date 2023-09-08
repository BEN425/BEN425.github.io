import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

import App from './_app'

export default function Home() {
  return (
    <>
      <Head>
        {/* Metadata */}
        <title>Uma Site</title>
        <meta name="description" content="Custom Umamusume Website by BEN425" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Import Google Fonts */}
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;200;300;400;500;600;700;800;900&display=swap');
        </style>

      </Head>
      <main>
        <div className={styles.title}>Uma Site</div>
        <hr></hr>
        <div></div>
      </main>
    </>
  )
}
