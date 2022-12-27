import { db } from "./config/connection";
import { useState, useEffect } from "react";

import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  addDoc,
  onSnapshot,
  query,
  where,
  setDoc,
  startAfter,
  orderBy,
} from "firebase/firestore";
import "./App.css";

import Header from "./components/Header";
import UserInformation from "./components/UserInformation";
import Switch from "react-switch";
import Splash from "./components/Splash";

function App() {
  const [projects, setProjects] = useState([]);
  const projectsCollectionRef = collection(db, "projects");

  const [currentProject, setCurrentProject] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState("Diego Espinosa");
  const [isWorking, setIsWorking] = useState(false);
  const [hoursID, setHoursID] = useState("");

  const [name, setName] = useState("Name LastName");
  const [position, setPosition] = useState("Position");
  const [startedAt, setStartedAt] = useState();

  function getCurrentDate(separator = "-") {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date}`;
  }
  // let getCurrentTime() = new Date().toLocaleTimeString("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  // });

  function getCurrentTime(){
    return  new Date().getHours() + ':' + new Date().getMinutes();
  }
 

  //FETCHING DATA FROM FIREBASE
  const getProjects = async () => {
    const data = await getDocs(projectsCollectionRef);
    setProjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    const database = query(collection(db, "projects"), orderBy("name", "desc"));
    onSnapshot(database, () => {
      getProjects();
    });
  }, []);

  const signIn = async (projectName) => {
    const startedWorking = doc(db, "employees", "Diego Espinosa");
    await updateDoc(startedWorking, { startedWorking: getCurrentTime() });
    setStartedAt(getCurrentTime());

    const collectionRef = collection(db, "hours");
    let payload = {
      date: getCurrentDate(),
      employee: currentEmployee,
      project: projectName,
      signIn: getCurrentTime(),
      signOut: getCurrentTime(),
    };
    const docRef = await addDoc(collectionRef, payload);

    const removeWorking = doc(db, "employees", "Diego Espinosa");
    await updateDoc(removeWorking, { hoursID: docRef.id });

  };

  const signOut = async () => {
    const signOut = doc(db, "hours", hoursID);
    await updateDoc(signOut, { signOut: getCurrentTime() });
    console.log(getCurrentTime());
  };

  const checkIsWorking = async () => {
    const q = query(
      collection(db, "employees"),
      where("name", "==", "Diego Espinosa")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setName(doc.data().name);
      setPosition(doc.data().position);
      setCurrentProject(doc.data().working);
      setHoursID(doc.data().hoursID);
      setStartedAt(doc.data().startedWorking);
      doc.data().working == "" ? setIsWorking(false) : setIsWorking(true);
    });
  };
  useEffect(() => {
    const database = query(collection(db, "employees"));
    onSnapshot(database, () => {
      checkIsWorking();
    });
  }, []);

  const toggled = async (projectName) => {
    if (isWorking) {
      const removeWorking = doc(db, "employees", "Diego Espinosa");
      await updateDoc(removeWorking, { working: "" });
      await updateDoc(removeWorking, { hoursID: "" });
      signOut();
    } else {
      const setWorking = doc(db, "employees", "Diego Espinosa");
      await updateDoc(setWorking, { working: projectName });
      signIn(projectName);
    }
  };

  useEffect(()=>{
    checkIsWorking();
  },[startedAt])


  return (
    <div className="App">
      <Splash />
      <Header />
      {
        startedAt ? <UserInformation name={name} position={position} isWorking={isWorking} projectName={currentProject} startedAt={startedAt} hoursID={hoursID}
      /> : null
      }

      {projects.map((project) => {
        return (
          <div className="row">
            {project.name}
            <Switch
              onChange={() => toggled(project.name)}
              checked={currentProject == project.name ? true : false}
              onColor={"#F16533"}
              checkedIcon={false}
              uncheckedIcon={false}
              disabled={
                isWorking && currentProject != project.name ? true : false
              }
              offColor={"#aaa"}
            />
          </div>
        );
      })}
    </div>
  );
}

export default App;
