import { useRef, useEffect } from 'react';
import "../style/components/slider.css"

function Slider({ objects, renderItem }) {
    let slider = useRef();
    let noObjects = objects.length;

    useEffect(() => {
        const handleResize = () => {
            slider.current.scrollLeft = 0;
        }
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    function renderItems() {
        return objects.map((object, index) => {
            return (
            <div key={index} className='slider-item col-md-4 col-sm-6'>
                {renderItem(object)}
            </div>)
        })
    }

    function moveSlider(event) {
        let slide_width = document.querySelector('.slider-item').clientWidth;
        if (event.target.classList.contains("left"))
            slider.current.scrollLeft -= slide_width;
        else
            slider.current.scrollLeft += slide_width;
    }

    let common_classes = "controller fa-solid position-absolute rounded-circle d-flex justify-content-center align-items-center pointer transition primary-hover-bgcolor white-hover-color";
    return (
    <>
    <div className="main-slider overflow-auto position-relative">
        <div ref={slider} className="slider-container row flex-nowrap transition overflow-hidden">
            {renderItems()}
        </div>
        {<i onClick={moveSlider} className={`left fa-angle-left ${common_classes}`}></i>}
        {<i onClick={moveSlider} className={`right fa-angle-right ${common_classes}`}></i>}
    </div>
    </>
    );
};

export default Slider