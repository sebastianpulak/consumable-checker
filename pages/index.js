import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import btoa from 'btoa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown'
import Spinner from 'react-bootstrap/Spinner';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();
  const [result2, setResult2] = useState();
  const [result3, setResult3] = useState();
  const [membersArray, setMembersArray] = useState();
  const [destructionArray, setDestructionArray] = useState();
  const [runesArray, setRunesArray] = useState();
  const [potsArray, setPotsArray] = useState();
  const [healthstoneSeedArr, setHealthstoneSeedArr] = useState();
  const [token, setToken] = useState();
  const [allReports, setAllReports] = useState();
  const [choosenLog, setChoosenLog] = useState();
  const [choosenSingleLog, setChoosenSingleLog] = useState();
  const [reportsArray, setReportsArray] = useState();
  const [showText, setShowText] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [client, setClient] = useState();
  const [secret, setSecret] = useState();
  const [finishedLoading, setFinishedLoading] = useState();

  const handleSelect = (e) => {
    console.log(allReports);
    setChoosenLog(e);
    let temp = [];
    for (let i = 0; i < allReports.length; i++) {
      temp.push({ code: allReports[i].code, title: allReports[i].title })
      if (allReports[i].title === e) break;
    }
    setReportsArray(temp);
    setChoosenSingleLog(undefined);
    document.getElementById("name").value = "";
  }

  const handleSingleSelect = (e) => {
    setChoosenSingleLog(e);
    let temp = [];
    for (let i = 0; i < allReports.length; i++) {
      if (allReports[i].title === e) {
        temp.push({ code: allReports[i].code, title: allReports[i].title });
        break;
      }
    }
    setReportsArray(temp);
    setChoosenLog(undefined);
    document.getElementById("name").value = "";
  }

  const handleOnChange = (event) => {
    if (event.target.value === "") {
      setReportsArray(undefined);
      return;
    }
    let temp = [];
    temp.push({ code: event.target.value })
    setReportsArray(temp);
    setChoosenLog(undefined);
    setChoosenSingleLog(undefined);
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

  const getAccessToken = async (clientId, clientSecret) => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    console.log(storedToken);
    let storedToken2;

    if (storedToken === null || storedToken === undefined) {
      const authHeader = 'Basic ' +
        btoa(clientId + ':' +
          clientSecret);

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
        localStorage.setItem('token', json.access_token);
        localStorage.setItem('clientId', clientId);
        localStorage.setItem('clientSecret', clientSecret);
        console.log(json.access_token);
        storedToken2 = json.access_token;
        setToken(json.access_token);
      } else {
        alert("Can't find the user, make sure Client ID and Client Secret are correct.");
        document.getElementById("clientId").value = "";
        document.getElementById("clientSecret").value = "";
        setIsLoading(false);
        return;
      }
    }
    const guildReports = await fetch('/api/guildReports?' + new URLSearchParams({
      token: storedToken !== null ? storedToken : storedToken2
    }).toString());

    const guildReportsJson = await guildReports.json();
    console.log(guildReportsJson)
    const allGuildReports = guildReportsJson.reportData.reports.data;
    setAllReports(allGuildReports);
    setLoggedIn(true);
    setFinishedLoading(true);
    setIsLoading(false);
  }

  useEffect(async() => {
    const clientId = localStorage.getItem('clientId');
    const clientSecret = localStorage.getItem('clientSecret');
    console.log(finishedLoading);
    if (clientId !== null && clientSecret !== null) {
      await getAccessToken(clientId, clientSecret);
    }
    setFinishedLoading(true);
  }, [])

  const handleLoginOnChange = (event) => {
    console.log(event.target.id);
    if (event.target.id === "clientId") {
      setClient(event.target.value);
    } else {
      setSecret(event.target.value)
    }
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true)
    getAccessToken(client, secret);
  }

  const handleSubmit = async (event) => {

    event.preventDefault();


    setIsLoading(true);
    let hastePotArr = [];
    let destructionPotArr = [];
    let allMembersArr = [];
    let runesArr = [];
    let manaPotsArr = [];
    let hsSeedsArr = [];

    for (let i = 0; i < reportsArray.length; i++) {
      const allMembers = await fetch('/api/reportMembers?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const json = await allMembers.json();
      if (json.message === "An error occurred.") {
        alert("Report not found, enter correct code");
        setReportsArray(undefined);
        setIsLoading(false);
        return;
      }
      let members = json.reportData.report.table.data.entries;

      for (let i = 0; i < members.length; i++) {
        allMembersArr.push({ raider: members[i], totalRaids: 0 });
      }
    }

    for (let i = 0; i < allMembersArr.length; i++) {
      let counter = 0;
      for (let j = 0; j < allMembersArr.length; j++) {
        if (allMembersArr[i].raider.name === allMembersArr[j].raider.name) counter++
      }
      allMembersArr[i].totalRaids = counter;
    }

    const tempMembersArray = allMembersArr.filter((v, i, a) => a.findIndex(t => (t.raider.name === v.raider.name)) === i);


    for (let i = 0; i < tempMembersArray.length; i++) {
      hastePotArr.push({ member: tempMembersArray[i].raider, totalHaste: 0, totalRaids: tempMembersArray[i].totalRaids });
      runesArr.push({ member: tempMembersArray[i].raider, totalRune: 0, totalRaids: tempMembersArray[i].totalRaids });
      destructionPotArr.push({ member: tempMembersArray[i].raider, totalDestruction: 0, totalRaids: tempMembersArray[i].totalRaids });
      manaPotsArr.push({ member: tempMembersArray[i].raider, totalManaPot: 0, totalRaids: tempMembersArray[i].totalRaids });
      hsSeedsArr.push({ member: tempMembersArray[i].raider, totalHealthstoneSeed: 0, totalRaids: tempMembersArray[i].totalRaids });
    }

    for (let i = 0; i < reportsArray.length; i++) {
      const hastePot = await fetch('/api/hastePot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const destructionPot = await fetch('/api/destructionPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const darkRune = await fetch('/api/darkRune?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const demonicRune = await fetch('/api/demonicRune?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const manaPot = await fetch('/api/manaPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const healthstone = await fetch('/api/healthstone?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const nightmareSeed = await fetch('/api/nightmareSeed?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const hastePotJson = await hastePot.json();
      const destructionPotJson = await destructionPot.json();
      const demonicRuneJson = await demonicRune.json();
      const darkRuneJson = await darkRune.json();
      const manaPotJson = await manaPot.json();
      const healthstoneJson = await healthstone.json();
      const nightmareSeedJson = await nightmareSeed.json();


      hastePotArr.map((e) => {
        if (hastePotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalHaste = hastePotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalHaste;
        }
      })
      runesArr.map((e) => {
        if (demonicRuneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalRune = demonicRuneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalRune
        }
        if (darkRuneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalRune = darkRuneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalRune
        }
      })

      destructionPotArr.map((e) => {
        if (destructionPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalDestruction = destructionPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalDestruction;
        }
      })

      manaPotsArr.map((e) => {
        if (manaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalManaPot = manaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalManaPot
        }
      })

      hsSeedsArr.map((e) => {
        if (healthstoneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalHealthstoneSeed = healthstoneJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalHealthstoneSeed
        }
        if (nightmareSeedJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalHealthstoneSeed = nightmareSeedJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalHealthstoneSeed
        }
      })
    }
    runesArr.sort((firstItem, secondItem) => secondItem.totalRune - firstItem.totalRune);
    hastePotArr.sort((firstItem, secondItem) => secondItem.totalHaste - firstItem.totalHaste);
    destructionPotArr.sort((firstItem, secondItem) => secondItem.totalDestruction - firstItem.totalDestruction);
    manaPotsArr.sort((firstItem, secondItem) => secondItem.totalManaPot - firstItem.totalManaPot);
    hsSeedsArr.sort((firstItem, secondItem) => secondItem.totalHealthstoneSeed - firstItem.totalHealthstoneSeed);
    setMembersArray(hastePotArr);
    setDestructionArray(destructionPotArr);
    setRunesArray(runesArr);
    setPotsArray(manaPotsArr);
    setHealthstoneSeedArr(hsSeedsArr);
    setShowText(true);
    setIsLoading(false);

  }

  return (

    <div className={styles.container}>
      <Head>
        <title>Consumable checker</title>
        <meta name="description" content="Consumable checker for Classic Wacraftlogs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://s.abcnews.com/images/US/JuvenileSeal_1618395587590_hpMain_16x9_992.jpg" />

      </Head>
      {membersArray ?
        <div className={styles.centerText}>
          <h1>Consumables used in {reportsArray.length} raids: {reportsArray.map((e) => <a key={e.code} rel="noreferrer" href={`https://classic.warcraftlogs.com/reports/${e.code}`} target="_blank">{e.title}, </a>)}</h1>
        </div>
        : <></>
      }
      <main className={styles.main}>
        {!loggedIn ? 
          <div>
            {finishedLoading ?
              <div className={styles.card}>
                <form onSubmit={handleLoginSubmit} className={styles.form}>
                  <div className={styles.formElement}>
                    <label htmlFor="name">Client id: </label>
                    <input className={styles.input} onChange={handleLoginOnChange} id="clientId" type="text" placeholder="Client id" autoComplete="off" />
                  </div>
                  <div className={styles.formElement}>
                    <label htmlFor="name">Client secret: </label>
                    <input className={styles.input} onChange={handleLoginOnChange} id="clientSecret" type="text" placeholder="Client secret" autoComplete="off" />
                  </div>

                  <button className="btn btn-outline-dark" disabled={isLoading || client === undefined || secret === undefined}
                    type="submit">{isLoading ? 'Loading...' : 'Login'}</button>
                </form>
              </div> :
              <div className={styles.spinner}>
                <Spinner animation="border" variant="dark" />

              </div>}

          </div>
          :
          <div>
            {membersArray && runesArray && potsArray && healthstoneSeedArr ?
              (
                <div>
                  <div className={styles.column}>
                    <h3>Haste potion:</h3>
                    {
                      membersArray.map((e) =>
                        (e.member.type === "Hunter" || (e.member.type === "Warrior" && e.member?.talents[2]?.guid < 30) || (e.member.type === "Shaman" && e.member?.talents[1]?.guid > 30) || e.member.type === "Rogue" || (e.member.type === "Druid" && e.member?.talents[1]?.guid > 30))
                          ? <p key={`hasteKey${e.member.name}`} style={e.totalHaste > 0 ? { color: "green" } : { color: "red" }}><b>({e.totalRaids}/{reportsArray.length}) {e.member.name}: {e.totalHaste}</b></p> :
                          <></>
                      )
                    }
                  </div>

                  <div className={styles.column}>
                    <h3>Dark runes:</h3>
                    {
                      runesArray.map((e) =>
                        (e.member.type === "Hunter" || (e.member.type === "Shaman") || (e.member.type === "Druid" && e.member?.talents[2]?.guid > 30) || (e.member.type === "Druid" && e.member?.talents[0]?.guid > 30))
                          ? <p key={`runesKey${e.member.name}`} style={e.totalRune > 0 ? { color: "green" } : { color: "red" }}><b>({e.totalRaids}/{reportsArray.length}) {e.member.name}: {e.totalRune}</b></p> :
                          <></>
                      )
                    }
                  </div>

                  <div className={styles.column}>
                    <h3>Mana pots:</h3>
                    {
                      potsArray.map((e) =>
                        (e.member.type !== "Warrior" && e.member.type !== "Rogue")
                          ? <p key={`potsKey${e.member.name}`} style={e.totalManaPot > 0 ? { color: "green" } : { color: "red" }}><b>({e.totalRaids}/{reportsArray.length}) {e.member.name}: {e.totalManaPot}</b></p> :
                          <></>
                      )
                    }
                  </div>

                  <div className={styles.column}>
                    <h3 className={styles.headline}>HS/Seeds:</h3>
                    {
                      healthstoneSeedArr.map((e) =>
                        (e.totalHealthstoneSeed > 0) ?
                          <p key={`hsKey${e.member.name}`} style={{ color: "green" }}><b>({e.totalRaids}/{reportsArray.length}) {e.member.name}: {e.totalHealthstoneSeed}</b></p> : <></>
                      )
                    }
                  </div>

                  <div className={styles.column}>
                    <h3>Destruction potion:</h3>
                    {
                      destructionArray.map((e) =>
                        ((e.member.type === "Paladin" && e.member?.talents[1]?.guid > 30) || e.member.type === "Warlock" || e.member.type === "Mage" || (e.member.type === "Priest" && e.member?.talents[2]?.guid > 30) || (e.member.type === "Druid" && e.member?.talents[0]?.guid > 30) || (e.member.type === "Shaman" && e.member?.talents[0]?.guid > 30))
                          ? <p key={`destKey${e.member.name}`} style={e.totalDestruction > 0 ? { color: "green" } : { color: "red" }}><b>({e.totalRaids}/{reportsArray.length}) {e.member.name}: {e.totalDestruction}</b></p> :
                          <></>
                      )
                    }
                  </div>


                  <button className={styles.button} onClick={() => { setMembersArray(undefined); setReportsArray(undefined) }}>Back</button>
                </div>
              )
              : (
                <div className={styles.card}>
                  <h2>Check consumables usage, enter report code below</h2>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formElement}>
                      <label htmlFor="name">Code: </label>
                      <input className={styles.input} onChange={handleOnChange} id="name" type="text" placeholder="logs/reports/{code}" autoComplete="off" />
                    </div>
                    <div className="dropdown w-100">
                      <Dropdown id="dropdown" onSelect={handleSelect} className="w-100">
                        <Dropdown.Toggle className="w-100" variant="secondary" id="dropdown-basic">
                          {choosenLog ? choosenLog : "Choose up to which log"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          {allReports ? allReports.map((e) =>
                            <Dropdown.Item key={`dropdownKey${e.code}`} eventKey={e.title}>{e.title}</Dropdown.Item>
                          ) : <></>}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div className="dropdown w-100">
                      <Dropdown id="dropdown" onSelect={handleSingleSelect} className="w-100">
                        <Dropdown.Toggle className="w-100" variant="secondary" id="dropdown-basic">
                          {choosenSingleLog ? choosenSingleLog : "Choose single log"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          {allReports ? allReports.map((e) =>
                            <Dropdown.Item key={`dropdownKey${e.code}`} eventKey={e.title}>{e.title}</Dropdown.Item>
                          ) : <></>}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <button className="btn btn-outline-dark" disabled={isLoading || reportsArray === undefined}
                      type="submit">{isLoading ? 'Loading...' : 'Search!'}</button>
                  </form>
                </div>
              )
            } </div>
        } 
      </main>
    </div>
  )
}
