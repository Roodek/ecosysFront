import './App.css';
import MainPage from "./components/MainPage";
import {useState} from "react";

function App() {
    const [activeTheme, setActiveTheme] = useState(localStorage.getItem("theme")?localStorage.getItem("theme"):"REGULAR");

    const selectTheme = (theme) =>{
        localStorage.setItem("theme", theme);
        setActiveTheme(theme);
    }
    const getTheme = () =>{
        switch(activeTheme){
            case "PIXEL":
                return "pixel-style"
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
