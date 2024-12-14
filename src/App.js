import './App.css';
import MainPage from "./components/MainPage";
import {useEffect, useState} from "react";

function App() {
    const [activeTheme, setActiveTheme] = useState(localStorage.getItem("theme")?localStorage.getItem("theme"):"PIXEL");

    useEffect(() => {
        if (localStorage.getItem("theme")) {
            setActiveTheme(localStorage.getItem("theme"));
        }else{
            localStorage.setItem("theme","PIXEL");
            setActiveTheme("PIXEL");
        }
    }, []);

    const selectTheme = (theme) =>{
        localStorage.setItem("theme", theme);
        setActiveTheme(theme);
    }
    const getTheme = () =>{
        switch(activeTheme){
            case "PIXEL":
                return "pixel-style"
            case "DARK_FANTASY":
                return "dark-fantasy-style"
            default:
                return "regular-style"
        }
    }
  return (
    <div className={getTheme()}>
      <MainPage selectTheme={selectTheme}/>
    </div>
  );
}

export default App;
