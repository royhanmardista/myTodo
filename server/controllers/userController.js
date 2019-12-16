const User = require('../models/user')
const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class userController {
    
    static findByEmail(req, res, next) {
        User.find({
                email : req.params.email
            })
            .then(users => {
                res.json(users)
            })
            .catch(next)
    }

    static findOne(req, res, next) {
        let {username, email, photo, _id} = req.user
        res.json({
            message : 'user found',
            user : {
                username,
                email,
                photo,
                _id
            }                        
        })
    } 
    
    static register(req, res, next) {
        const {email, username, password, photo, role} = req.body
        User.
            create({
                email,
                username,
                password,
                photo,
                role,
            })
            .then(user => {
                res.status(201).json({
                    message : `user succesfully created`
                })
            })
            .catch(next)
    }
    
    static login(req, res, next) {
        User.findOne({ 
            email : req.body.email
        })
        .then(user => {            
            if (user) { 
                let valid = comparePassword(req.body.password, user.password) 
                if ( valid ) {               
                    let token = generateToken(user)  
                    let {username, email, photo, _id} = user
                    res.json({
                        message : 'login succes',
                        token : token,
                        user : {
                            username,
                            email,
                            photo,
                            _id
                        }                        
                    })
                } else {                    
                    next({
                        status: 403,
                        message: 'Wrong Password'
                    })
                }
            } else {
                next({
                    status : 404,
                    message : 'user not found'
                })
            } 
        })
        .catch(next)
    }

    static loginGoogle(req, res, next) { 
        let { email, name, picture } = req.decoded
        User.findOne({
            email : email
        })
        .then( user => {
            let password = email+'tes'
            if (!user) {
                return User.create({
                    email, 
                    password,
                    username : name,
                    photo : picture})
            } else {
                return user
            }
        })
        .then(user => {      
            let {username, email, photo,  _id} = user      
            let token = generateToken(user)  
            res.json({
                status : 200,
                message : 'login success',
                token : token,
                user : {
                    username,
                    email,
                    photo,
                    _id
                }  
            })                     
        })
        .catch(next) 
                   
    }

    static loginFacebook(req, res, send) {
        req.decoded = JSON.parse(req.body.user)
        let { email, name, picture } = req.decoded
        User.findOne({
            email : email
        })
        .then( user => {
            let password = email+'tes'
            if (!user) {
                return User.create({email, password, username : name, photo : picture.url})
            } else {
                return user
            }
        })
        .then(user => {            
            let token = generateToken(user)  
            let {username, email, photo, membership} = user      
            res.json({
                status : 200,
                message : 'you are login',
                token : token,
                user : {
                    username,
                    email,
                    photo,
                }  
            })                     
        })
        .catch(next) 
    }
}

module.exports = userController