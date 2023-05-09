import React, { memo, useRef } from 'react'
import "../style/components/custom_components.css"

function Heading({ content, margin, colors , hrWidth}) {
    return (
        <div className="section-header  mb-5">
            <h1 className={`header-text h1-sm fit-content mx-${margin} mt-0`} style={{color: colors.contentColor}}>
                {content}
            </h1>
            <hr className={`styled-hr mx-${margin}`} style={{backgroundColor: colors.hrBackground, width:hrWidth}}/>
        </div>
    )
}

Heading.defaultProps = {
    colors: {
        contentColor: "#313131",
        hrBackground: "#c49f55",
    }
}

function ToggleButton({ func, background, linesColor }) {
    const toggleButton = useRef()
    function handleClick(event) {
        event.stopPropagation()
        toggleButton.current.classList.toggle('clicked');
        func();
    }
    return (
        <div ref={toggleButton} className='toggle p-1 d-md-none pointer d-flex justify-content-center align-items-center rounded-circle' style={{backgroundColor:background}} onClick={handleClick}>
            <div className='w-100 h-100'>
                <div className='w-100 position-relative transition my-1' style={{backgroundColor: linesColor? linesColor: 'white'}}></div>
                <div className='w-100 position-relative transition my-1' style={{backgroundColor: linesColor? linesColor: 'white'}}></div>
                <div className='w-100 position-relative transition my-1' style={{backgroundColor: linesColor? linesColor: 'white'}}></div>
            </div>
        </div>
    )
}
const memoizedToggleButton = memo(ToggleButton, (prevProps, nextProps)=>true);
const memoizedHeading = memo(Heading, (prevProps, nextProps)=>prevProps===nextProps? true: false);
export {memoizedToggleButton as ToggleButton, Heading}