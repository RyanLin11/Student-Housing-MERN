var express = require('express');
var router = express.Router();
const UserModel = require('../models/user');
const PhotoModel = require('../models/photo');
const _ = require('lodash');
const {body, validationResult} = require('express-validator');

router.route('/')
  .get( // Returns a list of users
    async function(req, res) {
      const filters = _.pick(req.query, _.keysIn(UserModel.schema.paths));
      let users = await UserModel.find(filters);
      if(req.query.hasOwnProperty('sort')) {
        if(req.query.sort.charAt(0) == '-') {
          req.query.sort = req.query.sort.substring(1);
          users.sort((a, b) => a[req.query.sort] < b[req.query.sort]? 1: -1);
        } else {
          users.sort((a, b) => a[req.query.sort] < b[req.query.sort]? -1: 1);
        }
      }
      res.send(users);
    })
  .post( // Creating a user
    body('username').isLength({min:3}).bail().trim().escape().withMessage('Username must be at least 3 characters long').custom(value => {
      return UserModel.findOne({username: value}).then(user => {
          if(user) {
              return Promise.reject('Username is already in use');
          }
      })
    }),
    body('email').isEmail().bail().withMessage('Invalid Email').normalizeEmail().custom(value => {
        return UserModel.findOne({email: value}).then(user => {
            if(user) {
                return Promise.reject('E-mail already in use');
            }
        });
    }),
    body('password').escape().isLength({min: 6}).bail().withMessage('Password must be at least 6 characters long'),
    body('repassword').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    async function(req, res) {
      const validationErrors = validationResult(req);
      if(validationErrors.isEmpty()) {
        const user = UserModel(req.body);
        await user.save();
        res.status(201).send(user);
      } else {
        res.status(400).send(validationErrors.mapped());
      }
    })

router.param('id', async function(req, res, next, id) {
  try {
    const user = await UserModel.findById(id);
    if(user) {
        req.user = user;
    } else {
        next(new Error('Suite could not be found'));
    }
  } catch(error) {
      next(error);
  }
  next();
})

router.route('/:id')
  .get(async function(req, res) {
    res.status(200).send(req.user);
  })
  .put(
    async function(req, res) {
      if(req.files) {
        //If the user already has a photo, delete it
        if(req.user.photo) {
          req.user.photo.deleteOne();
        }
        //Upload new profile photo
        try {
          const photo = await PhotoModel.createWithData(req.files.photo);
          req.body.photo = photo._id;
        } catch (err) {
          console.log(err);
        }
      }
      const new_user = await UserModel.findByIdAndUpdate(req.user._id, req.body);
      res.send(new_user);
    })

router.post(
  '/login', 
  body('username').trim().escape().custom(async (value) => {
    const user = await UserModel.findOne({username: value});
    if (!user) {
      throw new Error('User not found.');
    }
  }),
  body('password').escape().custom((password, {req}) => {
      return UserModel.findOne({username: req.body.username}).then(async function(user) {
          if(user) {
              const result = await user.comparePassword(password);
              if(!result) {
                  return Promise.reject("Incorrect Password.");
              }
          } else {
              return Promise.reject("User not found.");
          }
      })
  }),
  async function(req, res, next) {
      const validationErrors = validationResult(req);
      if(validationErrors.isEmpty()) {
          const db_user = await UserModel.findOne({username: req.body.username});
          req.session.loggedIn = true;
          req.session.user_id = db_user._id;
          res.sendStatus(200);
      } else {
          res.status(400).send(validationErrors.mapped());
      }
  }
);

router.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    res.status(500).send(err);
  });
  res.status(200).send("Logout Successful");
});

module.exports = router;
