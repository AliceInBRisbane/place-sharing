const { v4: uuidv4 } = require('uuid');
const HttpError =require('../models/http-error.js')
const {validationResult} =require('express-validator')
const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken')


// let DUMMY_USERS = [{
//     id :'u1',
//     username:'Alice',
//     email:'alice@text.com',
//     password:'tester'

// }]



const getUsers = async (req,res,next)=>{

    
    // res.json({users:DUMMY_USERS})

    let users
    try{
        users = await User.find({},'-password')

    }catch(err){
        return next(new HttpError('Fetching users failed,please try again later',500))
    }
  res.json({users:users.map(u=>u.toObject({getters:true}))})
}

const signup = async (req,res,next)=>{

    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);

        const error = new HttpError("Invalid inputs passed, please check your data ",422)
        return next(error)
    }
    
    const {username,email,password} = req.body;
    // const hasUser = DUMMY_USERS.find(u=>u.email === email)
    let existingUser
    try{
        existingUser = await User.findOne({ email:email})
    }catch(err){
        const error = new HttpError('Signing up failed，please try again later.',500)
        return next(error)
    }
    

    // if (hasUser){
    //     throw new HttpError('Could not create user, email already exists.',422)
    // }
    if(existingUser){
        const error= new HttpError(
            'User exists already,please login instead.',
            422
        )
        return next(error)
    }

    let hashedPassword;
    try{
        hashedPassword =await bcrypt.hash(password,12)
    }catch(err){
        const error = new HttpError('Could not creat user,please try again later.',500)
        return next(error)
    }
    

    const createdUser = new User({
        username,
        email,
        image: req.file.path,
        password:hashedPassword,
        places:[]
      });

    // DUMMY_USERS.push(createdUser)

   try{
    await createdUser.save()

   }catch(err){
    const error = new HttpError('Signing up failed，please try again later!!',500)
    return next(error)

   }
   let token;
   try{
    token =jwt.sign({
    userId:createdUser.id,
    email:createdUser.email},
    process.env.JWT_KEY,
    { expiresIn:'1h' }
    )
}catch(err){
    const error = new HttpError('Signing up failed，please try again later!!',500)
    return next(error)
}
   
    res.status(201).json({userid: createdUser.id,email:createdUser.email,token:token});
};

const login = async(req, res, next)=>{

    const {email,password} =req.body;

    // const identifiedUser = DUMMY_USERS.find(u=>u.email === email)

    let identifiedUser 
    try{
        identifiedUser = await User.findOne({email:email})
    }catch(err){
        return next(new HttpError('Logging in failed,please try again later',500))
    }

    if (!identifiedUser  ){
       return next(new HttpError('Invalid credentials,could not log you in.',403))


    }
    let isValidPassword = false
    try{
        isValidPassword = await bcrypt.compare(password,identifiedUser.password)
    }catch(err){
        return next(new HttpError('Could not log you in, please check your credentials and try again.',500))

    }
    if (!isValidPassword){
        return next(new HttpError('Invalid credentials,could not log you in.',403))
    }

    let token;
    try{
     token =jwt.sign({
     userId:identifiedUser.id,
     email:identifiedUser.email},
     process.env.JWT_KEY,
     { expiresIn:'1h' }
     )
 }catch(err){
     const error = new HttpError('Logging in failed，please try again later!!',500)
     return next(error)
 }

    res.json({
        userId:identifiedUser.id,
        email:identifiedUser.email,
        token:token
    })

}

exports.getUsers = getUsers
exports.login = login
exports.signup = signup