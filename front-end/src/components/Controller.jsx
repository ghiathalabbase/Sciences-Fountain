import { Button } from "./CustomComponents";
function Controller({ currentObject, objectsCount, func, color }) {
    const ELEMENTSCOUNT = 9;
    const SIDEBUTTONSCOUNT = 3;
    const SEPARATOR = "...";
    function controllerElements() {
        let elements = [];
        if (objectsCount < ELEMENTSCOUNT) {
            for (let index = 0; index < objectsCount; index++) {
                elements.push(index);
            }
        } else {
            if (currentObject < SIDEBUTTONSCOUNT || currentObject > objectsCount - 1 - SIDEBUTTONSCOUNT) {
                for (let index = 0; index < objectsCount; ) {
                    if (index === 4) {
                        elements.push(SEPARATOR);
                        index = objectsCount - 1 - SIDEBUTTONSCOUNT;
                    } else {
                        elements.push(index);
                        index++;
                    }
                }
            } else {
                elements.push(0, SEPARATOR);
                for (let index = currentObject - 2; index <= currentObject + 2; index++) {
                    elements.push(index);
                }
                elements.push(SEPARATOR, objectsCount - 1);
            }
        }
        console.log(elements);
        return elements;
    }
    return (
        <div className="d-flex justify-content-center align-items-center gap-1 p-2 text-center w-100 ">
            <Button handleClick={() => currentObject > 0 && func(currentObject - 1)} content={"السابق"} style={{ backgroundColor: color, color: "#fff" }} m />
            {controllerElements().map((element, index) => {
                return typeof element === "number" ? (
                    <Button
                        style={element === currentObject ? { backgroundColor: color, color: "#fff" } : {}}
                        key={index}
                        handleClick={() => func(element)}
                        content={element + 1}
                    />
                ) : (
                    <span key={index}>{element}</span>
                );
            })}
            <Button handleClick={() => currentObject < objectsCount - 1 && func(currentObject + 1)} content={"التالي"} style={{ backgroundColor: color, color: "#fff" }} />
        </div>
    );
}

export default Controller;
