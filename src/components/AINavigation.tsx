import React, { useState } from "react";
import './AINavigation.css'
import  { ReactComponent as CoatIcon } from '../assets/coat.svg'

const AINavigation: React.FC = () => {
    const [selected, setSelected] = useState(-1);

    const toggleSelected = (index: number) => {
        setSelected(index);
    }
    //a list of navigation items
    //each have one image and one text
    //the image is a svg icon and above the text
    //the text is the name of the navigation item
    return (
        <div className='navigation-container'>
            <div className={`navigation-item${selected === 0 ? ' selected' : ''}`}
                onClick={() => toggleSelected(0)}
            >
                <CoatIcon className="navigation-item-img"/>
                <span className='navigation-item-text'>设计</span>
            </div>
        </div>
    )

}

export default AINavigation;