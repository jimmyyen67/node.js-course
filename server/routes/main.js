const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
 */
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Nodejs Blog",
            description: "Simple Blog created with Nodejs, Express & Mongodb"
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ {$sort: { createdAt: -1 } } ])
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /post/:id
 * Post
 */
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug })
        const locals = {
            title: data.title,
            description: "Simple Blog created with Nodejs, Express & Mongodb"
        }
        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
})

/**
 * POST
 * Post - searchTerm
 */
router.post('/search', async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const data = await Post.find({
            $or: [
                { title: {$regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: {$regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });
        const locals = {
            title: "Search",
            description: "Simple Blog created with Nodejs, Express & Mongodb"
        }
        res.render('search', { locals, data });
    } catch (error) {
        console.log(error);
    }
})





router.get('/about', (req, res) => {
    res.render('about')
})

module.exports = router;


// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Learning Node.js",
//             body: "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine."
//         },
//         {
//             title: "Exploring MongoDB",
//             body: "MongoDB is a NoSQL database that provides great flexibility for developers."
//         },
//         {
//             title: "Understanding Async Programming",
//             body: "Asynchronous programming is essential in JavaScript for handling tasks efficiently."
//         },
//         {
//             title: "Introduction to Express.js",
//             body: "Express.js is a minimalistic framework for building web applications in Node.js."
//         },
//         {
//             title: "Working with REST APIs",
//             body: "REST APIs allow communication between clients and servers in a standardized way."
//         },
//         {
//             title: "Handling Authentication in Node.js",
//             body: "Implementing authentication in Node.js can be done using libraries like Passport.js."
//         },
//         {
//             title: "Building a Simple CRUD App",
//             body: "CRUD apps (Create, Read, Update, Delete) are fundamental to learning full-stack development."
//         },
//         {
//             title: "Using Mongoose for MongoDB",
//             body: "Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js."
//         },
//         {
//             title: "Introduction to Docker",
//             body: "Docker helps in containerizing applications, making them easier to manage and deploy."
//         },
//         {
//             title: "Deploying Node.js Apps on Heroku",
//             body: "Heroku is a cloud platform that allows you to easily deploy and manage your Node.js applications."
//         }
//     ]);
// }
// insertPostData();
