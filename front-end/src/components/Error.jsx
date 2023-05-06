import { useRouteError } from "react-router-dom";

export default function Error() {
    const error = useRouteError();
    console.log(error)
    return (
        <>
            <div className="error">
                <h1>{error.statusText} {error.status}</h1>
                <p>{error.data}</p>
            </div>
        </>
    )
} 