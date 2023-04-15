import React from 'react'
import "../style/components/custom_components.css"

export function Heading({content, margin}) {
    return (
        <div className="section-header mb-5">
            <h1 className={`header-text primary-color fit-content mx-${margin}`}>
                {content}
            </h1>
            <hr className={`styled-hr mx-${margin}`}/>
        </div>
    )
}

