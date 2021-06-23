const Users = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.userRegistration =  async (req,res) => {
    try{
        const {name, email, password} = req.body;

        const user = await Users.findOne({email})
        if(user) return res.status(400).json({msg: "Email already exists"})

        if(password.length < 6) return res.status(400).json({msg: "Password is at leat 6 characters long."})


        //Password Encryption
        const passwordHash = await bcrypt.hash(password, 10)
        //res.json({password, passwordHash})

        const newUser = new Users({
            name, email, password:passwordHash
        })

        //res.json(newUser)

        // Save Data
         await newUser.save()

        // Then create jsonwebtoken to authentication
        const accesstoken = createAccessToken({id: newUser._id})
        const refreshtoken = createRefreshToken({id: newUser._id})

        console.log("refresh",refreshtoken)

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7*24*60*60*1000 // 7d
        })
        res.json({accesstoken})

        //res.json({msg:"Registered!!"})

    } catch(err) {
        return res.status(500).json({msg: err.message})
    } 
}   

exports.userLogin = async(req,res) => {
    try{

        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(404).json({msg:"Please add email or password."})
        }

        const user = await Users.findOne({email})
        if(!user) return res.status(400).json({msg: "User does not exist."})

        const isMatch = await bcrypt.compare(password, user.password)
       if(isMatch){    
            const token = jwt.sign({_id:user},process.env.ACCESS_TOKEN_SECRET)
            const {_id,name,email} = user
           // res.json({token, user:{_id,name,email}});
            //res.json({message:"Login Successfully."})
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})
    
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })
            res.json({accesstoken})
        }else{
            return res.status(404).json({msg :"Invalid Email or Password."})
        }


    } catch(err) {
        return res.status(500).json({msg: err.message})
    }

}

exports.userLogout = async(req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/user/refresh_token'})
        return res.json({msg: 'Logged out'})

    } catch(err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.getUser = async(req,res) => {
    try {

       const user = await Users.findById(req.user.id).select('-password')
        if(!user) return res.status(400).json({msg: "USer does not exist."})
        res.json(user)
    } catch(err) {    
        return res.status(500).json({msg: err.message})
    }
}


exports.refreshToken = (req,res) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        //console.log("refresh",req.cookie.refreshtoken)
        //res.json({rf_token});

       if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
            if(err) return res.status(400).json({msg: "Please Login or Register"})

            const accesstoken = createAccessToken({id: user.id})

            res.json({user, accesstoken})
        })

    } catch(err) {    
        return res.status(500).json({msg: err.message})
    }
}


const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}
