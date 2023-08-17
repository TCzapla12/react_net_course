import { Navigate } from "react-router-dom";

export default function RedirectToLandingPage(){
    return <Navigate to="/" replace />
}