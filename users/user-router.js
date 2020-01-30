const router = require('express').Router();
const db = require('./user-model');
const bcript = require('bcryptjs');
const Auth = require('../auth/restricted-middleware')

router.get('/',Auth, (req, res) => {
    db.find()
        .then(users => {
            if (users) {
                res.status(200).json({Users: users});
            } else {
                res.status(404).json({message: 'There are no users.'});
            }
        })
        .catch(error => {
            console.log('get all users error', error);
            res.status(500).json({message: 'Was not able to get users from database.'});
        });
});

router.post('/register', (req, res) => {
    const newUser = req.body;
    bcript.hash(newUser.password, 10)
        .then(hashed => {
            newUser.password = hashed;
            db.add(newUser)
                .then(user => {
                    if (user) {
                        res.status(201).json(user);
                    } else {
                        res.status(500).json({message: 'That user was not added.'});
                    }
                })
                .catch(error => {
                    console.log('add a user error', error);
                    res.status(500).json({message: 'There was an error adding to the database.'});
                });
        });

});

router.post('/login', (req, res) => {
    const creds = req.body;
    db.findBy(creds.username)
        .then(user => {
            if (user && bcript.compareSync(creds.password, user.password)) {
                res.status(200).json({message: `Welcome, ${user.username}`});
            } else {
                res.status(401).json({message: 'Please provide valid credentials.'});
            }
        })
        .catch(error => {
            console.log('login error', error);
            res.status(500).json({message: 'There was a database error logging in.'});
        });
});

module.exports = router;