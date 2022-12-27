import React from "react";
import { db } from "../config/connection";
import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot, query, where,} from "firebase/firestore";

function Metrics(props) {
  const [projects, setProjects] = useState([]);
  const projectsCollectionRef = collection(db, "projects");
  const[myHours, setMyHours] = useState([]);
  let array = [];

  //FETCHING DATA FROM FIREBASE
  const getProjects = async () => {
    const data = await getDocs(projectsCollectionRef);
    setProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    for (let i = 0; i < projects.length; i++) {
      const q = query(collection(db, "hours"),where("project", "==", projects[i].name));
      let tot = 0;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        tot += calculateTime(doc.data().signIn, doc.data().signOut);
      });
        array.push({name: projects[i].name, tot: tot});
    }
    setMyHours(array);
  };

  useEffect(() => {
    const database = query(collection(db, "projects"));
    onSnapshot(database, () => {
      getProjects();
    });
  }, [props.showMetrics]);

  function calculateTime(signedIn, signedOut) {
    let started = signedIn.split(":");
    let startedHR = parseInt(started[0]);
    let startedMIN = parseInt(started[1]);
    let concluded = signedOut.split(":");
    let concludedHR = parseInt(concluded[0]);
    let concludedMIN = parseInt(concluded[1]);
    let tot = concludedHR * 60 + concludedMIN - (startedHR * 60 + startedMIN);
    return tot;
  }

  return (
    <div className={props.showMetrics ? "wrapper-metrics slideUp" : "wrapper-metrics slideDown" }>
      <div className="header-metrics">
        <h2> <i className="bi bi-sliders h2Sliders"></i> Settings </h2>
        <button onClick={()=> props.setShowMetrics()}> Close </button>
      </div>
      <button className="printBtn"> <i className="bi bi-printer"></i> Print </button>
        
      {myHours.map((row) => {
        return (
          <div className="row-metrics">
              <i className="bi bi-stopwatch iconTimer"></i>
              <h2> {row.name} </h2>
              <p> {(row.tot /60).toFixed(2)} hrs</p>
          </div>
        )
      })}
    </div>
  );
} 

export default Metrics;
