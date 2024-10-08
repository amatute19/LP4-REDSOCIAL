const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // Generar nueva password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Crear nuevo usuario
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            desc: req.body.desc,
            imgId: req.body.imgId,
            city: req.body.city,
            from: req.body.from,
            relationship: req.body.relationship
        });

        // Guardar usuario y responder 
        const user = await newUser.save();
        return res.status(200).json(user);
    } catch (err) {
        
        res.status(500).json({ err });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("User not found");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json("Password incorrect");
        }

        return res.status(200).json(user);
    } catch (err) {        
        res.status(500).json({ err });
    }
});

module.exports = router;
