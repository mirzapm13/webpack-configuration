import Welcome from "../views/Welcome";
import Weather from "../views/Weather";
import { createBrowserRouter, Link, Navigate } from "react-router-dom";

const router = createBrowserRouter([
    {
        element: <MainRoute />,
        children: [
            {
                path: "/",
                element: <Navigate to="/welcome" />
            },
            {
                path: "/weather",
                element: <Weather />
            },
            {
                path: "/welcome",
                element: <Welcome />
            }
        ]
    },
]);

export default router