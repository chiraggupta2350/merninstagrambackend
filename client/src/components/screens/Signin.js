import React,{useContext, useState} from "react";
import { NavLink,useHistory } from "react-router-dom";
import M from "materialize-css";
import {UserContext} from "../../App";

const Signin = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const postData = () => {
    
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
          return  M.toast({html:"Invalid email",classes:"#c62828 red darken-3"})
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((res) => res.json()).then(data => {
            console.log(data)
            if(data.error){
                M.toast({html:data.error,classes:"#c62828 red darken-3"})
            }else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"signin successfully",classes:"#43a047 green darken-1"})
                history.push("/");
            }
        }).catch(err=>{
            console.log(err);
        })

    }
    return (
        <div className="mycard input-field">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={postData}>Login</button>
                <h5>
                    <NavLink to="/signup">Dont have an account ?</NavLink>
                </h5>
            </div>
        </div>
    )
}
export default Signin;