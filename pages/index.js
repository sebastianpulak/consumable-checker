import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import btoa from 'btoa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown'
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [membersArray, setMembersArray] = useState();
  const [destructionArray, setDestructionArray] = useState();
  const [runesArray, setRunesArray] = useState();
  const [potsArray, setPotsArray] = useState();
  const [healthstoneSeedArr, setHealthstoneSeedArr] = useState();
  const [token, setToken] = useState();
  const [allReports, setAllReports] = useState();
  const [allReports2, setAllReports2] = useState();
  const [allReports3, setAllReports3] = useState();
  const [choosenLog, setChoosenLog] = useState();
  const [choosenSingleLog, setChoosenSingleLog] = useState();
  const [choosenSingleEncounter, setChoosenSingleEncounter] = useState();
  const [choosenSingleLogEncounter, setChoosenSingleLogEncounter] = useState();
  const [reportsArray, setReportsArray] = useState();
  const [showText, setShowText] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [client, setClient] = useState();
  const [secret, setSecret] = useState();
  const [finishedLoading, setFinishedLoading] = useState();
  const [checked, setChecked] = useState(true);
  const [encountersArray, setEncountersArray] = useState();
  const [isLoadingEncounters, setIsLoadingEncounters] = useState(false);
  const [hasteSortedByTotal, setHasteSortedByTotal] = useState(true);
  const [destructionSortedByTotal, setDestructionSortedByTotal] = useState(true);
  const [HSSortedByTotal, setHSSortedByTotal] = useState(true);
  const [manaSortedByTotal, setManaSortedByTotal] = useState(true);
  const [runeSortedByTotal, setRuneSortedByTotal] = useState(true);


  const resetData = () => {
    setMembersArray(undefined); 
    setReportsArray(undefined); 
    setEncountersArray(undefined); 
    setChoosenSingleLogEncounter(undefined); 
    setChoosenSingleEncounter(undefined);
    setHasteSortedByTotal(true);
    setDestructionSortedByTotal(true);
    setHSSortedByTotal(true);
    setManaSortedByTotal(true);
    setRuneSortedByTotal(true);
  }

  const includeExcludePTR = () => {
    if(checked === true){
      setAllReports(allReports2);
    } else {
      setAllReports(allReports2);
    }
    setChecked(!checked)
  } 

  const changeSort = (name) => {
    let temp = [];
    switch(name){
      case "destruction":
        temp = destructionArray;
        if(destructionSortedByTotal === true){
          temp.sort((firstItem, secondItem) => (secondItem.totalDestruction/secondItem.totalEncounters) - (firstItem.totalDestruction/firstItem.totalEncounters));
          setDestructionSortedByTotal(false);
          setDestructionArray(temp);
          break;
        } else {
          temp.sort((firstItem, secondItem) => secondItem.totalDestruction - firstItem.totalDestruction);
          setDestructionSortedByTotal(true);
          setDestructionArray(temp);
          break;
        }
      case "haste":
        temp = membersArray;
        if(hasteSortedByTotal === true){
          temp.sort((firstItem, secondItem) => (secondItem.totalHaste/secondItem.totalEncounters) - (firstItem.totalHaste/firstItem.totalEncounters));
          setHasteSortedByTotal(false);
          setMembersArray(temp);
          break;
        } else {
          temp.sort((firstItem, secondItem) => secondItem.totalHaste - firstItem.totalHaste);
          setHasteSortedByTotal(true);
          setMembersArray(temp);
          break;
        }
      case "mana":
        temp = potsArray;
        if(manaSortedByTotal === true){
          temp.sort((firstItem, secondItem) => (secondItem.totalManaPot/secondItem.totalEncounters) - (firstItem.totalManaPot/firstItem.totalEncounters));
          setManaSortedByTotal(false);
          setPotsArray(temp);
          break;
        } else {
          temp.sort((firstItem, secondItem) => secondItem.totalManaPot - firstItem.totalManaPot);
          setManaSortedByTotal(true);
          setPotsArray(temp);
          break;
        }
      case "rune":
        temp = runesArray;
        if(runeSortedByTotal === true){
          temp.sort((firstItem, secondItem) => (secondItem.totalRune/secondItem.totalEncounters) - (firstItem.totalRune/firstItem.totalEncounters));
          setRuneSortedByTotal(false);
          setRunesArray(temp);
          break;
        } else {
          temp.sort((firstItem, secondItem) => secondItem.totalRune - firstItem.totalRune);
          setRuneSortedByTotal(true);
          setRunesArray(temp);
          break;
        }
      case "hs":
        temp = healthstoneSeedArr;
        if(HSSortedByTotal === true){
          temp.sort((firstItem, secondItem) => (secondItem.totalHealthstoneSeed/secondItem.totalEncounters) - (firstItem.totalHealthstoneSeed/firstItem.totalEncounters));
          setHSSortedByTotal(false);
          setHealthstoneSeedArr(temp);
          break;
        } else {
          temp.sort((firstItem, secondItem) => secondItem.totalHealthstoneSeed - firstItem.totalHealthstoneSeed);
          setHSSortedByTotal(true);
          setHealthstoneSeedArr(temp);
          break;
        }
      default:
        return;
    }
    return;
  }

  const handleSelect = (e) => {
    let temp = [];
    for (let i = 0; i < allReports.length; i++) {
      temp.push({ code: allReports[i].code, title: allReports[i].title, startTime: allReports[i].startTime })
      if (allReports[i].code === e){
        setChoosenLog(allReports[i].title + " " + formatDate(allReports[i].startTime));
        break;
      } 
    }
    setReportsArray(temp);
    setChoosenSingleLog(undefined);
    setChoosenSingleLogEncounter(undefined);
    setEncountersArray(undefined); 
    setChoosenSingleEncounter(undefined);
    document.getElementById("name").value = "";
    document.getElementById("codeEncounter").value = "";
  }

  const handleSingleSelect = (e) => {    
    
    let temp = [];
    for (let i = 0; i < allReports.length; i++) {
      if (allReports[i].code === e) {
        setChoosenSingleLog(allReports[i].title + " " + formatDate(allReports[i].startTime));
        temp.push({ code: allReports[i].code, title: allReports[i].title, startTime: allReports[i].startTime });
        break;
      }
    }
    console.log(temp);
    setReportsArray(temp);
    setChoosenLog(undefined);
    setChoosenSingleLogEncounter(undefined);
    setEncountersArray(undefined);
    setChoosenSingleEncounter(undefined);
    document.getElementById("name").value = "";
    document.getElementById("codeEncounter").value = "";
  }

  const handleSelectEncounter = (e) => {
    let encounterObj = encountersArray.find(obj => obj.uniqueID === parseInt(e));
    console.log(encounterObj);

    setChoosenSingleEncounter(encounterObj);

    setChoosenLog(undefined);
    setChoosenSingleLog(undefined);
    document.getElementById("name").value = "";
    document.getElementById("codeEncounter").value = "";
  }

  const handleInputCodeEncounters = async (e) => {
    document.getElementById("name").value = "";
    setChoosenLog(undefined);
    setChoosenSingleLog(undefined);
    setEncountersArray(undefined);    
    setIsLoadingEncounters(true);

    let temp = [];
    let tempEncounterArr = [];
    setChoosenSingleLogEncounter(e);

    const encounters = await fetch('/api/encounters?' + new URLSearchParams({
      code: e,
      token: token
    }).toString());

    const encountersJson = await encounters.json();
    if (encountersJson.message === "An error occurred.") {
      setReportsArray(undefined);
      setEncountersArray(undefined);
      setIsLoading(false);
      setIsLoadingEncounters(false);
      alert("Report not found, enter correct code");
      return;
    }
    const encountersFights = encountersJson.reportData.report.fights;
    console.log(encountersJson);
    for (let i = 0; i < encountersFights.length; i++) {
      if (encountersFights[i].encounterID !== 0) {
        tempEncounterArr.push({id: encountersFights[i].encounterID, title: encountersFights[i].name, logStartTime: encountersFights[i].startTime, endTime: encountersFights[i].endTime, startTime: encountersFights[i].startTime, uniqueID: encountersFights[i].id})
      }
    }


    setChoosenSingleEncounter(undefined);
    setEncountersArray(tempEncounterArr);
    setIsLoadingEncounters(false);
  }

  const handleSingleSelectEncounter = async (e) => {
    document.getElementById("name").value = "";
    setChoosenLog(undefined);
    setChoosenSingleLog(undefined);
    setEncountersArray(undefined);    
    setIsLoadingEncounters(true);

    console.log("REPORTS ARR" + reportsArray);
    let temp = [];
    let tempEncounterArr = [];
    for (let i = 0; i < allReports.length; i++) {
      if (allReports[i].code === e) {
        setChoosenSingleLogEncounter(allReports[i].title + " " + formatDate(allReports[i].startTime));
        temp.push({ code: allReports[i].code, title: allReports[i].title, startTime: allReports[i].startTime });
        break;
      }
    }

    const encounters = await fetch('/api/encounters?' + new URLSearchParams({
      code: temp[0].code,
      token: token
    }).toString());

    const encountersJson = await encounters.json();
    const encountersFights = encountersJson.reportData.report.fights;
    console.log(encountersFights);
    for (let i = 0; i < encountersFights.length; i++) {
      if (encountersFights[i].encounterID !== 0) {
        tempEncounterArr.push({id: encountersFights[i].encounterID, title: encountersFights[i].name, startTime: encountersFights[i].startTime, endTime: encountersFights[i].endTime, uniqueID: encountersFights[i].id, logStartTime: temp[0].startTime})
      }
    }


    //setChoosenSingleEncounter(undefined);
    setEncountersArray(tempEncounterArr);
    console.log(tempEncounterArr);
    setReportsArray(temp);
    console.log(temp);
    setIsLoadingEncounters(false);
  }

  const formatDate = (unixDate) => {
    const miliseconds = unixDate;
    const date = new Date(miliseconds);
    const humanDateFormat = date.toLocaleString('en-GB',  {year: 'numeric', month: 'numeric', day: 'numeric'});
    return humanDateFormat;
  }

  const formatEncounterDate = (unixDate, encounterUnixDate, endTime) => {
    console.log(unixDate, encounterUnixDate, endTime)
    if(unixDate < 99999999){
      const miliseconds = endTime - unixDate;
      const date = new Date(miliseconds);
      const humanDateFormat = date.toLocaleString('en-GB',  {minute: 'numeric', second: 'numeric'});
      return humanDateFormat;
    }
    const miliseconds = unixDate + encounterUnixDate;
    const date = new Date(miliseconds);
    const humanDateFormat = date.toLocaleString('en-GB',  {hour: 'numeric', minute: 'numeric'});
    return humanDateFormat;
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
    setChoosenSingleLogEncounter(undefined);
    setChoosenSingleEncounter(undefined);
    setEncountersArray(undefined);
    document.getElementById("codeEncounter").value = "";
  }

  const handleEncounterOnChange = async (event) => {
    if (event.target.value === "" || event.target.value.length !== 16) {
      setReportsArray(undefined);
      setChoosenLog(undefined);
      setChoosenSingleLog(undefined);
      setChoosenSingleLogEncounter(undefined);
      setChoosenSingleEncounter(undefined);
      setEncountersArray(undefined);
      document.getElementById("name").value = "";
      return;
    }
    
    let temp = [];

    temp.push({ code: event.target.value })
    setReportsArray(temp);
    console.log(temp);
    
    setChoosenLog(undefined);
    setChoosenSingleLog(undefined);
    handleInputCodeEncounters(event.target.value);
  }

  const handleGetGuildReports = async () => {
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

    const allGuildReports = guildReportsJson.reportData.reports.data;

    let guildsArray = [];
    let guildsArray2 = [];
    for(let i = 0; i < allGuildReports.length; i++){
      if(allGuildReports[i].zone?.id !== 1010 && allGuildReports[i].zone !== null){
        guildsArray.push(allGuildReports[i])
      }
    }
    for(let i = 0; i < allGuildReports.length; i++){
      if(allGuildReports[i].zone !== null){
        guildsArray2.push(allGuildReports[i])
      }
    }
    setAllReports3(guildsArray);
    setAllReports2(guildsArray2);
    setAllReports(guildsArray2);
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

  const handleEncounterSubmit = async (event) => {

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

      console.log(json);
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


    const tempMembersArray = allMembersArr.filter((v, i, a) => a.findIndex(t => (t.raider.name === v.raider.name)) === i);


    for (let i = 0; i < tempMembersArray.length; i++) {
      hastePotArr.push({ member: tempMembersArray[i].raider, totalHaste: 0});
      runesArr.push({ member: tempMembersArray[i].raider, totalRune: 0});
      destructionPotArr.push({ member: tempMembersArray[i].raider, totalDestruction: 0});
      manaPotsArr.push({ member: tempMembersArray[i].raider, totalManaPot: 0, totalMajorManaPot: 0});
      hsSeedsArr.push({ member: tempMembersArray[i].raider, totalHealthstoneSeed: 0});
    }

    for (let i = 0; i < reportsArray.length; i++) {


      const hastePot = await fetch('/api/hastePot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const destructionPot = await fetch('/api/destructionPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const darkRune = await fetch('/api/darkRune?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const demonicRune = await fetch('/api/demonicRune?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const manaPot = await fetch('/api/manaPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const healthstone = await fetch('/api/healthstone?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const nightmareSeed = await fetch('/api/nightmareSeed?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const sscManaPot = await fetch('/api/sscManaPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const tkManaPot = await fetch('/api/tkManaPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const majorManaPot = await fetch('/api/majorManaPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
        encounterID: choosenSingleEncounter.id,
        startTime: choosenSingleEncounter.startTime,
        endTime: choosenSingleEncounter.endTime
      }).toString());

      const hastePotJson = await hastePot.json();
      const destructionPotJson = await destructionPot.json();
      const demonicRuneJson = await demonicRune.json();
      const darkRuneJson = await darkRune.json();
      const manaPotJson = await manaPot.json();
      const healthstoneJson = await healthstone.json();
      const nightmareSeedJson = await nightmareSeed.json();
      const sscManaPotJson = await sscManaPot.json();
      const tkManaPotJson = await tkManaPot.json();
      const majorManaPotJson = await majorManaPot.json();

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
        if (sscManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalManaPot = sscManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalManaPot
        }
        if (tkManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalManaPot = tkManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalManaPot
        }
        if (majorManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalMajorManaPot = majorManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalMajorManaPot
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

      let encountersAmount = 0;

      const allMembers = await fetch('/api/reportMembers?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token
      }).toString());

      const encounters = await fetch('/api/encounters?' + new URLSearchParams({
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
      
      const encountersJson = await encounters.json();
      encountersJson.reportData.report.fights.map((e) => {
          if(e.encounterID !==0){
            encountersAmount++;
          }
      })

      
      


      let members = json.reportData.report.table.data.entries;

      for (let i = 0; i < members.length; i++) {
        allMembersArr.push({ raider: members[i], totalRaids: 0, totalEncounters: encountersAmount });
      }
    }

    for (let i = 0; i < allMembersArr.length; i++) {
      let counter = 0;
      let sumEncounters = 0;
      for (let j = 0; j < allMembersArr.length; j++) {
        if (allMembersArr[i].raider.name === allMembersArr[j].raider.name) counter++
        if (allMembersArr[i].raider.name === allMembersArr[j].raider.name) sumEncounters = allMembersArr[j].totalEncounters + sumEncounters
      }
      allMembersArr[i].totalRaids = counter;
      allMembersArr[i].totalEncounters = sumEncounters;
    }

    const tempMembersArray = allMembersArr.filter((v, i, a) => a.findIndex(t => (t.raider.name === v.raider.name)) === i);


    for (let i = 0; i < tempMembersArray.length; i++) {
      hastePotArr.push({ member: tempMembersArray[i].raider, totalHaste: 0, totalRaids: tempMembersArray[i].totalRaids, totalEncounters: tempMembersArray[i].totalEncounters });
      runesArr.push({ member: tempMembersArray[i].raider, totalRune: 0, totalRaids: tempMembersArray[i].totalRaids, totalEncounters: tempMembersArray[i].totalEncounters });
      destructionPotArr.push({ member: tempMembersArray[i].raider, totalDestruction: 0, totalRaids: tempMembersArray[i].totalRaids, totalEncounters: tempMembersArray[i].totalEncounters });
      manaPotsArr.push({ member: tempMembersArray[i].raider, totalManaPot: 0, totalMajorManaPot: 0, totalRaids: tempMembersArray[i].totalRaids, totalEncounters: tempMembersArray[i].totalEncounters });
      hsSeedsArr.push({ member: tempMembersArray[i].raider, totalHealthstoneSeed: 0, totalRaids: tempMembersArray[i].totalRaids, totalEncounters: tempMembersArray[i].totalEncounters });
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

      const sscManaPot = await fetch('/api/sscManaPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
      }).toString());

      const tkManaPot = await fetch('/api/tkManaPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
      }).toString());

      const majorManaPot = await fetch('/api/majorManaPot?' + new URLSearchParams({
        code: reportsArray[i].code,
        token: token,
      }).toString());

      const hastePotJson = await hastePot.json();
      const destructionPotJson = await destructionPot.json();
      const demonicRuneJson = await demonicRune.json();
      const darkRuneJson = await darkRune.json();
      const manaPotJson = await manaPot.json();
      const healthstoneJson = await healthstone.json();
      const nightmareSeedJson = await nightmareSeed.json();
      const sscManaPotJson = await sscManaPot.json();
      const tkManaPotJson = await tkManaPot.json();
      const majorManaPotJson = await majorManaPot.json();

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
        if (sscManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalManaPot = sscManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalManaPot
        }
        if (tkManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalManaPot = tkManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalManaPot
        }
        if (majorManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name)) {
          e.totalMajorManaPot = majorManaPotJson.reportData.report.table.data.entries.find(element => element.name === e.member.name).total + e.totalMajorManaPot;
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
          {choosenSingleEncounter ? 
          <h5 className={styles.headLineConsume}>
            Consumables used in: {reportsArray.map((e, i) =>
            <div key={`DIV_${e.code}_${i}`}>
            <div key={`DIV2_${e.code}_${i}`}>
            RAID: <a key={`RAID_${e.code}_${i}`} rel="noreferrer" href={`https://classic.warcraftlogs.com/reports/${e.code}`} target="_blank">{e.title}</a>
            </div>
            ENCOUNTER: <a key={`ENCOUNTER_${e.code}_${i}`} rel="noreferrer" href={`https://classic.warcraftlogs.com/reports/${e.code}#fight=${choosenSingleEncounter.uniqueID}`} target="_blank">{choosenSingleEncounter.title + " " + formatEncounterDate(choosenSingleEncounter.logStartTime, choosenSingleEncounter.startTime, choosenSingleEncounter.endTime)}</a>
            </div> )}
            </h5>
            
            : reportsArray.length > 1 ?
            <h5 className={styles.headLineConsume}>Consumables used in {reportsArray.length} raids from {formatDate(reportsArray[reportsArray.length-1].startTime)} to {formatDate(reportsArray[0].startTime)}: {reportsArray.map((e) => <a key={e.code} rel="noreferrer" href={`https://classic.warcraftlogs.com/reports/${e.code}`} target="_blank">{e.title}, </a>)}</h5>
            :
            <h5 className={styles.headLineConsume}>Consumables used in {reportsArray.length} raid: {reportsArray.map((e) => <a key={e.code} rel="noreferrer" href={`https://classic.warcraftlogs.com/reports/${e.code}`} target="_blank">{e.title}, </a>)}</h5>
      }
        </div>
        : <></>
      }
      <main className={styles.main}>
        {!loggedIn ? 
          <div style={{display: 'flex', justifyContent: 'center'}}>
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
                     type="submit">{isLoading ? <Spinner animation="border" variant="dark" /> : 'Login'}</button>
                </form>
              </div> :
              <div className={styles.spinner}>
                <Spinner animation="border" variant="dark" />

              </div>}

          </div>
          :
          <div style={membersArray && runesArray && potsArray && healthstoneSeedArr ? {display: 'flex', justifyContent: 'center', flexDirection:'column'}: {display: 'flex', justifyContent: 'center'} }>
            {membersArray && runesArray && potsArray && healthstoneSeedArr ?
              (
                <div>
                  <div className={styles.column}>
                    <button onClick={() => changeSort("haste")} className={styles.consumableName}>Haste potion:</button>
                    {
                      membersArray.map((e) =>
                        (e.member.type === "Hunter" || (e.member.type === "Warrior" && e.member?.talents[2]?.guid < 30) || (e.member.type === "Shaman" && e.member?.talents[1]?.guid > 30) || e.member.type === "Rogue" || (e.member.type === "Druid" && e.member?.talents[1]?.guid > 30))
                          ? <p className={styles.text} key={`hasteKey${e.member.name}`} style={e.totalHaste > 0 ? { color: "green" } : { color: "red" }}><b>{e.member.name}: {e.totalHaste}{e.totalEncounters ? " in " +  e.totalEncounters + " || " +  Math.round((e.totalHaste/e.totalEncounters) * 100) / 100 : ""}</b></p> :
                          <></>
                      )
                    }
                  </div>

                  <div className={styles.column}>
                  <button onClick={() => changeSort("rune")} className={styles.consumableName}>Dark runes:</button>
                    {
                      runesArray.map((e) =>
                        (e.member.type === "Hunter" || (e.member.type === "Shaman") || (e.member.type === "Druid" && e.member?.talents[2]?.guid > 30) || (e.member.type === "Druid" && e.member?.talents[0]?.guid > 30) || e.member.type === "Priest" || e.member.type === "Paladin" || e.member.type === "Warlock")
                          ? <p className={styles.text} key={`runesKey${e.member.name}`} style={e.totalRune > 0 ? { color: "green" } : { color: "red" }}><b>{e.member.name}: {e.totalRune}{e.totalEncounters ? " in " +  e.totalEncounters + " || " +  Math.round((e.totalRune/e.totalEncounters) * 100) / 100 : ""}</b></p> :
                          <></>
                      )
                    }
                  </div>

                  <div className={styles.column}>
                  <button onClick={() => changeSort("mana")} className={styles.consumableName}>Mana pots:</button>
                    {
                      potsArray.map((e) =>
                        (e.member.type !== "Warrior" && e.member.type !== "Rogue")
                          ? <p className={styles.text} key={`potsKey${e.member.name}`} style={e.totalManaPot > 0 ? { color: "green" } : { color: "red" }}><b>{e.member.name}: {e.totalManaPot}{e.totalMajorManaPot ? `(+${e.totalMajorManaPot})` : ""}{e.totalEncounters ? " in " +  e.totalEncounters + " || " +  Math.round((e.totalManaPot/e.totalEncounters) * 100) / 100 : ""}</b></p> :
                          <></>
                      )
                    }
                  </div>

                  <div className={styles.column}>
                  <button onClick={() => changeSort("hs")} className={styles.consumableName}>HS/Seeds:</button>
                    {
                      healthstoneSeedArr.map((e) =>
                        (e.totalHealthstoneSeed > 0) ?
                          <p className={styles.text} key={`hsKey${e.member.name}`} style={{ color: "green" }}><b>{e.member.name}: {e.totalHealthstoneSeed}{e.totalEncounters ? " in " +  e.totalEncounters + " || " +  Math.round((e.totalHealthstoneSeed/e.totalEncounters) * 100) / 100 : ""}</b></p> : <></>
                      )
                    }
                  </div>

                  <div className={styles.column}>
                  <button onClick={() => changeSort("destruction")} className={styles.consumableName}>Destruction potion:</button>
                    {
                      destructionArray.map((e) =>
                        ((e.member.type === "Paladin" && e.member?.talents[1]?.guid > 30) || e.member.type === "Warlock" || e.member.type === "Mage" || (e.member.type === "Priest" && e.member?.talents[2]?.guid > 30) || (e.member.type === "Druid" && e.member?.talents[0]?.guid > 30) || (e.member.type === "Shaman" && e.member?.talents[0]?.guid > 30))
                          ? <p className={styles.text} key={`destKey${e.member.name}`} style={e.totalDestruction > 0 ? { color: "green" } : { color: "red" }}><b>{e.member.name}: {e.totalDestruction}{e.totalEncounters ? " in " +  e.totalEncounters + " || " +  Math.round((e.totalDestruction/e.totalEncounters) * 100) / 100 : ""}</b></p> :
                          <></>
                      )
                    }
                  </div>


                  <button className={styles.button} onClick={() => resetData()}>Back</button>
                </div>
              )
              : (
                <div className={styles.selectSection}>
                <div className={styles.card}>
                  <h2>Check reports/single report</h2>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formElement}>
                      <label htmlFor="name">Code: </label>
                      <input className={styles.input} onChange={handleOnChange} id="name" type="text" placeholder="logs/reports/{code}" autoComplete="off" maxLength="16"/>
                    </div>
                    <div className="dropdown w-100">
                      <Dropdown id="dropdown" onSelect={handleSelect} className="w-100">
                        <Dropdown.Toggle className="w-100" variant="secondary" id="dropdown-basic">
                          {choosenLog ? choosenLog : "Choose up to which log"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          {allReports ? allReports.map((e) =>
                            <Dropdown.Item key={`dropdownKey${e.code}`} eventKey={e.code}><div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}><p style={{textAlign: 'left'}}>{e.title}</p> <p style={{alignItems: 'flex-end',textAlign: 'right'}}>{formatDate(e.startTime)}</p></div></Dropdown.Item>
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
                            <Dropdown.Item key={`dropdownKey${e.code}`} eventKey={e.code}><div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}><p style={{textAlign: 'left'}}>{e.title}</p> <p style={{alignItems: 'flex-end',textAlign: 'right'}}>{formatDate(e.startTime)}</p></div> </Dropdown.Item>
                          ) : <></>}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check onChange={() => includeExcludePTR()} type="checkbox" label="Include PTR" />
                    </Form.Group>
                    <button className="btn btn-outline-dark" disabled={isLoading || reportsArray === undefined}
                      type="submit">{isLoading ? <Spinner animation="border" variant="dark" /> : 'Search!'}</button>
                  </form>
                </div>

                <div className={styles.card2}>
                  <h2>Check single encounter</h2>
                  <form onSubmit={handleEncounterSubmit} className={styles.form}>
                    <div className={styles.formElement}>
                      <label htmlFor="codeEncounter">Code: </label>
                      <input className={styles.input} onChange={handleEncounterOnChange} id="codeEncounter" type="text" placeholder="logs/reports/{code}" autoComplete="off" maxLength="16"/>
                    </div>
                    <div className="dropdown w-100">
                      <Dropdown id="dropdown" onSelect={handleSingleSelectEncounter} className="w-100">
                        <Dropdown.Toggle className="w-100" variant="secondary" id="dropdown-basic">
                          {choosenSingleLogEncounter ? choosenSingleLogEncounter : "Choose log"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          {allReports ? allReports.map((e) =>
                            <Dropdown.Item key={`dropdownKey${e.code}`} eventKey={e.code}><div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}><p style={{textAlign: 'left'}}>{e.title}</p> <p style={{alignItems: 'flex-end',textAlign: 'right'}}>{formatDate(e.startTime)}</p></div></Dropdown.Item>
                          ) : <></>}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div className="dropdown w-100">
                      <Dropdown id="dropdown" onSelect={handleSelectEncounter} className="w-100">
                        <Dropdown.Toggle className="w-100" variant="secondary" id="dropdown-basic">
                          { isLoadingEncounters ? <Spinner animation="border" variant="dark" size="sm" /> :
                          choosenSingleEncounter ? choosenSingleEncounter.title + " " + formatEncounterDate(choosenSingleEncounter.logStartTime, choosenSingleEncounter.startTime, choosenSingleEncounter.endTime) : "Choose encounter"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                          {encountersArray ? encountersArray.map((e) =>
                            <Dropdown.Item key={`dropdownKey${e.uniqueID}`} eventKey={e.uniqueID}><div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}><p style={{textAlign: 'left'}}>{e.title}</p> <p style={{alignItems: 'flex-end',textAlign: 'right'}}>{formatEncounterDate(e.logStartTime, e.startTime, e.endTime)}</p></div> </Dropdown.Item>
                          ) : <></>}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check onChange={() => includeExcludePTR()} type="checkbox" label="Include PTR" />
                    </Form.Group>
                    <button className="btn btn-outline-dark" disabled={isLoading || reportsArray === undefined}
                      type="submit">{isLoading ? <Spinner animation="border" variant="dark" /> : 'Search!'}</button>
                  </form>
                </div>
                </div>
              )
            } </div>
        } 
      </main>
    </div>
  )
}