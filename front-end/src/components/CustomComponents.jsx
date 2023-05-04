import React from 'react'
import "../style/components/custom_components.css"

export function Heading({content, margin, colors}) {
    return (
        <div className="section-header mb-5">
            <h1 className={`header-text fit-content mx-${margin} mt-0`} style={{color: colors.contentColor}}>
                {content}
            </h1>
            <hr className={`styled-hr mx-${margin}`} style={{backgroundColor: colors.hrBackground}}/>
        </div>
    )
}

export function ToggleButton({func, background, width,height, spansWidth}) {
    return (
        <div className='toggle d-md-none pointer d-flex justify-content-center align-items-center rounded-circle' onClick={func} style={{backgroundColor: background, width: width, height: height}}>
            <div style={{width:spansWidth}}>
                <span className='d-block bg-white w-100 position-relative transition'></span>
                <span className='d-block bg-white w-100 position-relative transition'></span>
                <span className='d-block bg-white w-100 position-relative transition'></span>
            </div>
        </div>
    )
}
