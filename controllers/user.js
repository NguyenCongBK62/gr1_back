const bcrypt = require('bcrypt-nodejs');
const db = require('../databaseConfig');
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('../configs');
const encodedToken = (id) => {
    return JWT.sign({
        iss: 'Nguyen Cong',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, JWT_SECRET)
}

const authGoogle = async (req, res) => {
    // res.setHeader('Authorization', token);
    return res.status(200).json({ userName: req.user.username, accessToken: encodedToken(req.user.id)});
}

const signIn = async (req, res, next) => {
    // const { email, password } = req.body;
    // if(!email || !password){
    //     return res.status(400).json('incorrect form submission');
    // }
    // await db.select('email', 'password').from('account')
    // .where('email', '=', email)
    // .then(data => {
    //     const isValid = bcrypt.compareSync(password, data[0].password);
    //     if(isValid){
    //         return db.select('*').from('account')
    //         .where('email', '=', email)
    //         .then(account => {
    //             res.setHeader('Authorization' ,encodedToken(account[0].id));
    //             return res.status(200).json({success: true});
    //         })
    //         .catch(err => res.status(400).json('unable to get user'));
    //     }else{
    //         res.status(400).json('wrong credentials')
    //     }
    // })
    // .catch(err => res.status(400).json('wrong credentials'));
    // res.setHeader('Authorization' ,encodedToken(req.user.id));
    return res.status(200).json({ userName: req.user.username, accessToken: encodedToken(req.user.id)});
}

const signUp = async (req, res, next) => {
    const {email, username, password, role} = req.body;
    if(!email || !username || !password){
        return res.status(400).json('incorrect form submission');
    }

    const foundAccount = await db('account').select('*').where('email', '=', email);

    if(foundAccount[0]){
        return res.status(403).json('Email da dang ki');
    }

    const hash = bcrypt.hashSync(password);
        db('account').insert({
            username: username,
            password: hash,
            email: email,
            role: role
        }).returning('*').then(account => {
            return res.status(200).json({userName: account[0].username, accessToken: encodedToken(account[0].id)});
        }).catch(err => res.status(400).json('not submit'));
}

const secret = async (req, res) => {
    return res.status(200).json({ userName: req.user.username, accessToken: encodedToken(req.user.id)});
}
module.exports = {
    signIn,
    signUp,
    secret,
    authGoogle
}
