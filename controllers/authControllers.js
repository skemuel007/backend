
// import user model package
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');

module.exports.signup = (req, res) => {
    const {name, email, password } = req.body;

    User.findOne({email})
        .then(user => {
            if ( user )
                return res.status(400).json({
                    status : false,
                    message: 'User already exists',
                    data: null
                })

            // if no user with this email, create a user object
            const newUser =  new User({name, email, password});

            // create a salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err)
                        throw err;
                    newUser.password = hash;
                    // save the users details
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                {id: user._id },
                                config.get('jwtsecret'),
                                {expiresIn: 3600},
                                (err, token) => {
                                    if ( err)
                                        throw err;
                                    res.status(201).json({
                                            status: true,
                                            message: 'User registration successful',
                                            data: {
                                                id: user._id,
                                                email: user.email,
                                                name: user.name,
                                                token: token
                                            }
                                        });
                                }

                            )
                        });
                });
            });
        });
}

module.exports.login =  async (req, res) => {
    // destructuring of request
    const { email, password } = req.body;

    User.findOne({email})
        .then(user => {
            if ( !user ) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid credentials',
                    data: null
                });
            }

            // validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch)
                        return res.status(401).json(
                            {
                                status: false,
                                message: 'Invalid credentials',
                                data: null
                            });
                    // create jwt token
                    jwt.sign(
                        { id: user._id },
                        config.get('jwtsecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err)
                                throw err;
                            res.json({
                                status: true,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    )
                });
        });
}

module.exports.get_user = (req,res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user =>
            res.json(
                {
                    status: true,
                    message: user != null ? 'User record found' : 'No such user',
                    data: user
                })
        );
}
