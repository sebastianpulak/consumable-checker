import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react';
import btoa from 'btoa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();
  const [result2, setResult2] = useState();
  const [result3, setResult3] = useState();
  const [membersArray, setMembersArray] = useState();
  const [runesArray, setRunesArray] = useState();
  const [potsArray, setPotsArray] = useState();
  const [healthstoneSeedArr, setHealthstoneSeedArr] = useState();
  const [token, setToken] = useState();
  const [allReports, setAllReports] = useState();
  const [choosenLog, setChoosenLog] = useState();

  const handleSelect=(e)=>{
    setChoosenLog(e);
  }

  const handleGetGuildReports = async () => {
    console.log(allReports);
    const guildReports = await fetch('/api/guildReports?' + new URLSearchParams({
      token: token
    }).toString());

    const guildReportsJson = await guildReports.json();
    console.log(guildReportsJson)
    const allGuildReports = guildReportsJson.reportData.reports.data;
    setAllReports(allGuildReports);
  }
  
  const getAccessToken = async () => {
    const storedToken = localStorage.getItem('token');
    const guildReports = await fetch('/api/guildReports?' + new URLSearchParams({
      token: storedToken
    }).toString());

    const guildReportsJson = await guildReports.json();
    console.log(guildReportsJson)
    const allGuildReports = guildReportsJson.reportData.reports.data;
    setAllReports(allGuildReports);
    setToken(storedToken);
    if(storedToken === null || storedToken === undefined){
      const authHeader = 'Basic ' +
      btoa("9457fdb3-9432-4298-abd1-f6f2f9703b13" + ':' +
           "53Iw9bTYpeWG1yW99Sb46FtXqHGsSltIWsuSqJMR");
  
    const response = await fetch(
      'https://www.warcraftlogs.com/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
  
    const json = await response.json();

    if (response.status === 200) {
      localStorage.setItem('token', JSON.stringify(json.access_token));
      console.log(JSON.stringify(json));
      setToken(storedToken);
    } else {
      throw new Error(
        'Response was not OK: ' +
        JSON.stringify(json ?? {})
      );
    }
    }
  }

  useEffect(()=> {
    getAccessToken();
  },[])

  const handleSubmit = async (event) => {

    let tempCode;
    event.preventDefault();
    allReports.map((e) => {
      if(e.title === choosenLog){
        tempCode = e.code;
      }
    })

    setIsLoading(true);

    const hastePot = await fetch('/api/hastePot?' + new URLSearchParams({
      code: event.target.name.value ? event.target.name.value : tempCode,
      token: token
    }).toString());

    const destructionPot = await fetch('/api/destructionPot?' + new URLSearchParams({
      code: event.target.name.value ? event.target.name.value : tempCode,
      token: token
    }).toString());

    const allMembers = await fetch('/api/reportMembers?' + new URLSearchParams({
      code: event.target.name.value ? event.target.name.value : tempCode,
      token: token
    }).toString());

    const darkRune = await fetch('/api/darkRune?' + new URLSearchParams({
      code: event.target.name.value ? event.target.name.value : tempCode,
      token: token
    }).toString());

    const demonicRune = await fetch('/api/demonicRune?' + new URLSearchParams({
      code: event.target.name.value ? event.target.name.value : tempCode,
      token: token
    }).toString());

    const manaPot = await fetch('/api/manaPot?' + new URLSearchParams({
      code: event.target.name.value ? event.target.name.value : tempCode,
      token: token
    }).toString());

    const healthstone = await fetch('/api/healthstone?' + new URLSearchParams({
      code: event.target.name.value ? event.target.name.value : tempCode,
      token: token
    }).toString());

    const nightmareSeed = await fetch('/api/nightmareSeed?' + new URLSearchParams({
      code: event.target.name.value ? event.target.name.value : tempCode,
      token: token
    }).toString());

    let arr = [];
    let arr2 = [];
    let manaPotArr = [];
    let hsSeedArr = [];
    const json = await allMembers.json();
    console.log(json);
    let members = json.reportData.report.table.data.entries;
    console.log(members)
    for(let i = 0;i < members.length; i++){
      arr.push({ member: members[i], totalHaste: 0, totalDestruction: 0, totalRune: 0});
      arr2.push({ member: members[i], totalHaste: 0, totalDestruction: 0, totalRune: 0});
      manaPotArr.push({ member: members[i], totalManaPot: 0});
      hsSeedArr.push({ member: members[i], totalHealthstoneSeed: 0});
    }
    console.log(arr);
    const hastePotJson = await hastePot.json();
    const destructionPotJson = await destructionPot.json();
    const demonicRuneJson = await demonicRune.json();
    const darkRuneJson = await darkRune.json();
    const manaPotJson = await manaPot.json();
    const healthstoneJson = await healthstone.json();
    const nightmareSeedJson = await nightmareSeed.json();

    arr.map((e) =>{
      hastePotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name) ? e.totalHaste = hastePotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total : 0;
      destructionPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name) ? e.totalDestruction = destructionPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total : 0;
    })

    arr2.map((e) =>{
      demonicRuneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name) ? e.totalRune = demonicRuneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalRune : 0;
      darkRuneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name) ? e.totalRune = darkRuneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalRune: 0;
    })

    manaPotArr.map((e) =>{
      manaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name) ? e.totalManaPot = manaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalManaPot : 0;
    })

    hsSeedArr.map((e) =>{
      healthstoneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name) ? e.totalHealthstoneSeed = healthstoneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalHealthstoneSeed : 0;
      nightmareSeedJson.reportData.report.table.data.entries.find(element => element.name === e.member.name) ? e.totalHealthstoneSeed = nightmareSeedJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalHealthstoneSeed : 0;
    })

    arr2.sort((firstItem, secondItem) => secondItem.totalRune - firstItem.totalRune);
    arr.sort((firstItem, secondItem) => secondItem.totalHaste - firstItem.totalHaste);
    arr.sort((firstItem, secondItem) => secondItem.totalDestruction - firstItem.totalDestruction);
    manaPotArr.sort((firstItem, secondItem) => secondItem.totalManaPot - firstItem.totalManaPot);
    hsSeedArr.sort((firstItem, secondItem) => secondItem.totalHealthstoneSeed - firstItem.totalHealthstoneSeed);
    
    setResult(json);
    setResult2(hastePotJson);
    setResult3(destructionPotJson);
    setMembersArray(arr);
    setRunesArray(arr2);
    setPotsArray(manaPotArr);
    setHealthstoneSeedArr(hsSeedArr)
    setIsLoading(false);
  }

  return  (
    
    <div className={styles.container}>
      <Head>
        <title>RPGLogs API Sample App</title>
        <meta name="description" content="A sample application to demonstrate usage of the RPGLogs v2 API." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://assets.rpglogs.com/img/warcraft/favicon.png" />
        
      </Head>
      {result2 && result && result3 ?
        <h1>Consumables used {}</h1> : <></>}
      <main className={styles.main}>

        {membersArray && runesArray && potsArray && healthstoneSeedArr?
          (
            <div>
              <div className={styles.column}>
                <h3>Haste potion:</h3>
                {
                membersArray.map((e) =>
                  (e.member.type === "Hunter" || (e.member.type === "Warrior" && e.member?.talents[2]?.guid < 30) || (e.member.type === "Shaman" && e.member?.talents[1]?.guid > 30) || e.member.type === "Rogue" || (e.member.type === "Druid" && e.member?.talents[1]?.guid > 30))
                  ?<p style={e.totalHaste > 0 ? { color: "green" } : {color: "red"}}><b>{e.member.name}: {e.totalHaste}</b></p> :
                  <></>
                )
              }
              </div>

              <div className={styles.column}>
                <h3>Dark runes:</h3>
                {
                runesArray.map((e) =>
                  (e.member.type === "Hunter"  || (e.member.type === "Shaman") || (e.member.type === "Druid" && e.member?.talents[2]?.guid > 30) || (e.member.type === "Druid" && e.member?.talents[0]?.guid > 30))
                  ?<p style={e.totalRune > 0 ? { color: "green" } : {color: "red"}}><b>{e.member.name}: {e.totalRune}</b></p> :
                  <></>
                )
              }
              </div>

              <div className={styles.column}>
                <h3>Mana pots:</h3>
                {
                potsArray.map((e) =>
                  (e.member.type !== "Warrior" && e.member.type !== "Rogue")
                  ?<p style={e.totalManaPot > 0 ? { color: "green" } : {color: "red"}}><b>{e.member.name}: {e.totalManaPot}</b></p> :
                  <></>
                )
              }
              </div>

              <div className={styles.column}>
                <h3 className={styles.headline}>HS/Seeds:</h3>
                {
                healthstoneSeedArr.map((e) =>
                (e.totalHealthstoneSeed > 0) ?
                  <p style={{ color: "green" }}><b>{e.member.name}: {e.totalHealthstoneSeed}</b></p> : <></>
                )
              }
              </div>

              <div className={styles.column}>
                <h3>Destruction potion:</h3>
                {
                membersArray.map((e) =>
                ((e.member.type === "Paladin" && e.member?.talents[1]?.guid > 30) || e.member.type === "Warlock" || e.member.type === "Mage" || (e.member.type === "Priest" && e.member?.talents[2]?.guid > 30) || (e.member.type === "Druid" && e.member?.talents[0]?.guid > 30) || (e.member.type === "Shaman" && e.member?.talents[0]?.guid > 30))
                  ?<p style={e.totalDestruction > 0 ? { color: "green" } : {color: "red"}}><b>{e.member.name}: {e.totalDestruction}</b></p> :
                  <></>
                )
              }
              </div>


              <button className={styles.button} onClick={() => setMembersArray(undefined)}>Back</button>
            </div>
          )
          : (
            <div className={styles.card}>
              <h2>Check consumables usage, enter report code below</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formElement}>
                  <label htmlFor="name">Code: </label>
                  <input className={styles.input} id="name" type="text" placeholder="Jvhrw9LRpjqTycg8" autoComplete="off" />
                </div>
              <div className="dropdown w-100">
                <Dropdown id="dropdown" onSelect={handleSelect}  className="w-100">
                  <Dropdown.Toggle className="w-100" variant="secondary" id="dropdown-basic">
                    {choosenLog ? choosenLog : "Choose log"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100">
                    {allReports ? allReports.map((e) => 
                      <Dropdown.Item eventKey={e.title}>{e.title}</Dropdown.Item>
                    ) : <></>} 
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <button type="button" className="btn btn-outline-dark" disabled={isLoading}
                  type="submit">{isLoading ? 'Loading...' : 'Search!'}</button>
              </form>
            </div>
          )
        }
      </main>
    </div>
  )
}
