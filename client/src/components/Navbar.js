import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import {UserContext} from "../App";

const Navbar = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory();

    const [click, setClick] = React.useState(false);

    const handleClick = () => setClick(!click);
    const Close = () => setClick(false);

    const renderList = ()=>{
      if(state){
         return[
            <li className="first"><NavLink to="/profile">profile</NavLink></li>,
            <li className="last"><NavLink to="/createpost">PostPic</NavLink></li>,
            <li className="mlast"><NavLink to="/myfollowingpost">FollowPic</NavLink></li>,
            <li>
                 {/* <button className="HH" 
                 className="btn #c62828 red darken-3"
                  onClick={()=>{
                      localStorage.clear()
                      dispatch({type:"CLEAR"})
                      history.push("/signin")
                  }}>Logout</button> */}
                  <a className="llast"><i class="material-icons left" onClick={()=>{
                      localStorage.clear()
                      dispatch({type:"CLEAR"})
                      history.push("/signin")
                  }}>exit_to_app</i></a>
            </li>
            
         ] 
      }else{
         return[
            <li ><NavLink to="/signin">Signin</NavLink></li>,
            <li><NavLink to="/signup">Signup</NavLink></li> 
         ]
      }
    }
    return (
        <>
            <nav className="navli">
                <div className="nav-wrapper white">
                    <NavLink to={state?"/":"/signin"} className="brand-logo left">Instagram</NavLink>
                    <ul id="nav-mobile" className="right">
                       {renderList()}
                    </ul>
                </div>
            </nav>

        </>
    )
}
export default Navbar;