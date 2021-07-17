import React, { useEffect, useState } from "react";
import M from "materialize-css";
import { useHistory } from "react-router";
const CreatePost = () => {
    const history = useHistory();
    const [title, settitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then((res) => res.json()).then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                } else {
                    M.toast({ html: "Created post successfully", classes: "#43a047 green darken-1" })
                    history.push("/");
                }
            }).catch(err => {
                console.log(err);
            })

        }
    }, [url])


    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instagram-clone")
        data.append("cloud_name", "deknzj1yw")
        fetch("https://api.cloudinary.com/v1_1/deknzj1yw/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })


    }



    return (
        <div className="card input-filled" style={{
            margin: "30px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input type="text" value={title} onChange={(e) => settitle(e.target.value)} placeholder="title" />
            <input type="text" value={body} onChange={(e) => setBody(e.target.value)} placeholder="body" />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={postDetails}>Submit Post</button>

        </div>
    )
}
export default CreatePost;