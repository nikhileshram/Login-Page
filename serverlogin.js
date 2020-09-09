const express = require('express')
const fs = require('fs')
const { urlencoded } = require('body-parser')
const filename = './logindb.json'
const bcrypt = require('bcrypt')
const validator = require('email-validator')

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/create', function showfile(req, res){
    res.sendFile(__dirname + '/createlogin.html')
})

app.get('/login', function showfile(req,res){
    res.sendFile(__dirname + '/login.html')
})

app.post('/signup', async (req,res) => {
    var data = JSON.parse(fs.readFileSync(filename))
    var user = req.body
    var c=0
    for(let i=0; i<data.users.length;i++){
        if(data.users[i].email===user.email){
            c=1
        }
    }
    if (validator.validate(user.email) === true) {
        if (c == 0) {
            const hash = await bcrypt.hash(user.password, 10)
            user.password = hash
            data.users.push(user)
            fs.writeFile(filename, JSON.stringify(data, null, '\t'), (err) => {
                res.send('User has been added')
            })
        }
        else {
            res.send('User Already Exists plz try different email')
        }
    }
    else{
        res.send("email invalid")
    }
})

app.post('/signin', async (req,res) => {
    var data = JSON.parse(fs.readFileSync(filename))
    var user = req.body
    var c=0
    for(let i=0;i<data.users.length;i++){
        if(data.users[i].email===user.email){
            const hash = await bcrypt.compare(user.password, data.users[i].password)
            if(hash){
                c=1
            }
        }
    }
    if(c==1){
        res.send('You have login successfully')
    }
    else{
        res.send('Either of your email and password were incorrect. Plz refresh and try again!')
    }
})


app.listen(3333)