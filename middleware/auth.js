
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

function checkAuthentication(req,res,next){
    let token=req.cookies['session-token']
    let user={}
    async function verify() {
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:CLIENT_ID
        })
        const payload=ticket.getPayload();
        user.name=payload.name;
        user.email=payload.email;
        console.log(payload)
    }
    verify().then(()=>{
       req.user=user
       next()
    }).catch((e)=>{
        res.redirect('/login')
    })
}

module.exports=checkAuthentication