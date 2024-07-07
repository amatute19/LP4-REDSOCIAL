const router = require("express").Router();
const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");


//Update user
router.put("/:id", async(req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch (err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body, 
            });
            res.status(200).json("La cuenta ha sido actualizada");
        }catch(err){
            return res.status(500).json(err);
        }

    }else{
        return res.status(403).json("Solo tu puedes actualizar tu cuenta!!!")
    }
});


//Delete User
router.delete("/:id", async(req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("La cuenta ha sido eliminada correctamente");
        }catch(err){
            return res.status(500).json(err);
        }

    }else{
        return res.status(403).json("Solo tu puedes eliminar tu cuenta!!!")
    }
});

//Get User
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
    try{
        const user = userId 
        ? await User.findById(userId) 
        : await User.findOne({ username: username });
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other);
    }catch (err){
        res.status(500).json(err);
    }
});


//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

//Follow a User

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("Usuario Seguido");
        } else {
          res.status(403).json("Usted ya sigue este usuario");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("No puede seguirse usted mismo");
    }
  });

//Unfollow User

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("Ha dejado de seguir el usuario");
        } else {
          res.status(403).json("No sigues ha este usuario");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("No puedes seguirte a ti mismo");
    }
  });


module.exports = router;


