import { useRef, useEffect } from 'react';
import "../style/components/slider.css"

function Slider({ objects, renderItem }) {
    let slider = useRef();
    let shownSlider = useRef()
    let noObjects = objects.length;

    useEffect(() => {
        let right_controller = document.querySelector(".right")
        let left_controller = document.querySelector(".left")
        const handleResize = () => {
            slider.current.scrollLeft = 0;
            right_controller.classList.add("disabled");
            left_controller.classList.remove("disabled");
            right_controller.classList.remove("primary-hover-bgcolor", "white-hover-color")
            left_controller.classList.add("primary-hover-bgcolor", "white-hover-color")
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

    function handleLeft(controller, slide_width, shown_slider_width, full_slider_width) {
        let current_scroll = slider.current.scrollLeft - slide_width;
        slider.current.scrollLeft -= slide_width;
        if (-current_scroll + shown_slider_width >= full_slider_width - 10) {
            controller.classList.add("disabled");
            controller.classList.remove("primary-hover-bgcolor", "white-hover-color")
        }
        else {
            let another_controller = document.querySelector(".right")
            another_controller.classList.remove("disabled");
            another_controller.classList.add("primary-hover-bgcolor", "white-hover-color")
        }
    }

    function handleRight(controller, slide_width) {
        let current_scroll = slider.current.scrollLeft + slide_width;
        slider.current.scrollLeft += slide_width;
        if (-current_scroll <= 10){
            controller.classList.add("disabled");
            controller.classList.remove("primary-hover-bgcolor", "white-hover-color")
        }
        else {
            let another_controller = document.querySelector(".left")
            another_controller.classList.remove("disabled");
            another_controller.classList.add("primary-hover-bgcolor", "white-hover-color")
        }
    }

    function moveSlider(event) {
        let full_slider_width = slider.current.scrollWidth;
        let shown_slider_width = shownSlider.current.clientWidth
        let slide_width = document.querySelector('.slider-item').clientWidth;
        let controller = event.target;

        if (controller.classList.contains("left")) {
            handleLeft(controller, slide_width, shown_slider_width, full_slider_width);
        }
        else {
            handleRight(controller, slide_width);
        }
    }

    let common_classes = "controller fa-solid position-absolute rounded-circle d-flex justify-content-center align-items-center pointer transition";
    return (
    <>
    <div ref={shownSlider} className="main-slider overflow-auto position-relative">
        <div ref={slider} className="slider-container row flex-nowrap transition overflow-hidden">
            {renderItems()}
        </div>
        {<i onClick={moveSlider} className={`left fa-angle-left ${common_classes} primary-hover-bgcolor white-hover-color`}></i>}
        {<i onClick={moveSlider} className={`right fa-angle-right disabled ${common_classes}`}></i>}
    </div>
    </>
    );
};

export default Slider