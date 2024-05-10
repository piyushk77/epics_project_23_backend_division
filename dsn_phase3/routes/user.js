// if you want to have user route handle separately you can use this
// const { Router } = require("express");
// const router = Router();
// const userMiddleware = require("../middleware/user");
// const { User } = require("../db");
// const { default: mongoose } = require("mongoose");

// // User Routes
// router.post('/signup', (req, res) => {
//     // Implement user signup logic
//     const username = req.body.username;
//     const password = req.body.password;
//     User.create({
//         username, 
//         password
//     })
//     res.json({
//         message: "User created successfully"
//     })
// });



// router.post('/login', async (req, res) => {
//     // Implement user login logic
//     const username = req.body.username;
//     const password = req.body.password;
//     await User.findOne({
//         username:username,
//         password:password
//     })
//     .then(function(value) {
//         if (value) {
//             res.json({
//                 message: 'User logged in successfully'
//             })
//         } else {
//             res.status(403).json({
//                 msg: "User doesnt exist"
//             });
//         }
//     });
// })

// module.exports = router