const checkAuthentication=require('./middleware/auth')
require('dotenv').config()
const express=require('express')
const app=express()

const cookieParser = require('cookie-parser')
//Google auth
const {OAuth2Client}=require('google-auth-library')
const CLIENT_ID='414210390205-vp9gucn8uo5seokut45p7el0fac9p3c1.apps.googleusercontent.com'
const client=new OAuth2Client(CLIENT_ID)

const PORT=process.env.PORT || 5000

app.set('view engine','ejs')
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))


app.get('/',(req,res)=>{
   res.send('Hello')
})

app.get('/dashboard',checkAuthentication,(req,res)=>{
      let user=req.user
      res.render('dashboard',{user})
})

app.get('/protected',checkAuthentication,(req,res)=>{
    res.render('protected.ejs')
})

//removes cookie and redirects to the logout route
app.get('/logout',(req,res)=>{
     res.clearCookie('session-token')
     res.redirect('/login')
})

app.get('/login',(req,res)=>{
   res.render('login')
})

app.post('/login',(req,res)=>{
    let token=req.body.token
   // console.log(token)
    async function verify() {
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:CLIENT_ID
        })
        const payload=ticket.getPayload();
        //const userid=payload('sub')
        //payload : JSON with all details of the Emailid
        console.log(payload)
    }
    verify().then(()=>{
        res.cookie('session-token',token)
        res.send('sucess')
    }).catch(console.error)
})



app.listen(PORT,()=>{console.log('Listening on port 5000')})