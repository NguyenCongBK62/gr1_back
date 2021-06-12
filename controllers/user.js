const bcrypt = require('bcrypt-nodejs');
const db = require('../databaseConfic');

const signIn = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json('incorrect form submission');
    }
    await db.select('email', 'password').from('account')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].password);
        if(isValid){
            return db.select('*').from('account')
            .where('email', '=', email)
            .then(account => {
                res.json(account[0]);
            })
            .catch(err => res.status(400).json('unable to get user'));
        }else{
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'));
}

const signUp = async (req, res) => {
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
            return res.json(account[0]);
        }).catch(err => res.status(400).json('not submit'));
}

const secret = async (req, res) => {
    console.log('secret')
}
module.exports = {
    signIn,
    signUp,
    secret
}