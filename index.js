//Libraries
const path = require('path');
const express = require('express');
const multer  = require('multer');
const { check, checkSchema, validationResult } = require('express-validator');

//Setup defaults for script
const app = express();
const storage = multer.diskStorage({
    //Logic where to upload file
    destination: function (request, file, callback) {
        callback(null, 'uploads/')
    },
    //Logic to name the file when uploaded
    filename: function (request, file, callback) {
      callback(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ 
    storage: storage,
    //Validation for file upload
    fileFilter: (request, file, callback) => {
        const allowedFileMimeTypes = ["image/png", "image/jpg", "image/jpeg",];
        callback(null, allowedFileMimeTypes.includes(file.mimetype));
    }
});
const port = 80 //Default port to http server

//The * in app.* needs to match the method type of the request
app.post(
    '/', 
    //Should be the name of the 'file' field in the request
    upload.fields([{name: 'file', maxCount: 1}]), 
  
    check('Favorite Pokemon', 'Please enter a Pokemon name.').isLength({min: 1}),

    check('Favorite Starter', "Please pick a starter Pokemon")
    .isIn(['Squirtle', 'Charmander', 'Bulbasaur']),

    check('Favorite Gen','Please pick a generation.').isLength({min: 1, max: 9}),

    check('First Played Game', "Please enter a Pokemon game.").isLength({min: 1}),

    check('Experience', 'Please select an option')
        .isIn(['I have played barely if any Pokemon at all', 'I have played it before casually as a kid', 'I love Pokemon games and still play them today']),
    
        checkSchema({
        'file': {
            custom: {
                options: (value, {req, path}) => !!req.files[path],
                errorMessage: 'Please upload file.',
            },
        },
    }),
    (request, response) => {
        //Validate request; If there any errors, send 400 response back
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                });
        }

        //Default response object
        response
            .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
            .json({message: 'Request fields and files are valid.'});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})