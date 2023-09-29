import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Outlet, Navigate } from "react-router-dom"


const ProtectedUser = () => {
    const {isLogged} = useContext(AuthContext)
  return <>
    {
        isLogged ? <Outlet/> : <Navigate to='/login'/>
    }
  
  </>
}

export default ProtectedUser
