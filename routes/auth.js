const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin")
const Post = require("../models/postSchema")


router.post("/signup", (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(500).json({ error: "user already exists with that email" })
            }

            bcrypt.hash(password, 12)
                .then((hashedpassword) => {
                    const user = new User({
                        name,
                        email,
                        password: hashedpassword,
                        pic
                    })
                    user.save()
                        .then((user) => {
                            res.json({ message: "saved successfully" })
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).json({ error: err });
                        })
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });

        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post("/signin", (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then((doMatch) => {
                    if (doMatch) {
                        // res.json({ message: "successfully signed in" })
                        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({
                            token,
                            user: { _id, name, email, followers, following, pic }
                        })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                }).catch((err) => {
                    console.log(err);
                })
        })
})


router.get("/user/:id", requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
        }).catch(err => {
            console.log(err);
            return res.status(402).json({ error: "User not found" })
        })
})

router.put("/follow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    }
    )
})

router.put("/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    }
    )
})
router.put("/updatepic", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "pic cannot post" })
            }
            res.json(result)
        })
})


module.exports = router;