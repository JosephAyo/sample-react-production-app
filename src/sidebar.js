import React from 'react';
import Sidebar from 'react-sidebar';
import { IconContext } from "react-icons";
import { GoThreeBars } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import './header.css';

const ThreeBarsIcon = ()=>{
    return(  
        <IconContext.Provider value={{  className: "three-bars" }}>
            <div>
                <GoThreeBars />
            </div>
        </IconContext.Provider>
    )
}

const CloseIcon = ()=>{
    return(  
        <IconContext.Provider value={{  className: "three-bars" }}>
            <div>
                <IoMdClose />
            </div>
        </IconContext.Provider>
    )
}
const SidebarComponent =(props)=>{
    console.log("props.open",props.open);
    return(
    <Sidebar
        sidebar=
        {
            <button  onClick={()=>props.openSideBar()}>
                <CloseIcon/>
            </button>
        }
        open={props.open}
        onSetOpen={props.onSetOpen}
        styles={{ sidebar: { background: "white" } }}
        >
        <button onClick={()=>props.openSideBar()} className="hamburger">
            <ThreeBarsIcon/>
        </button>
    </Sidebar>)
};

export default SidebarComponent