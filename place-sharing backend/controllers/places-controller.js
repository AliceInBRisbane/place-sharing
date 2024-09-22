const { v4: uuidv4 } = require('uuid');
const fs =require('fs')
const {validationResult} =require('express-validator')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')
const User =require('../models/user')
const mongoose = require('mongoose');

// let DUMMY_PLACES = [{
//     id :'p1',
//     title:'Empire State Building',
//     description:'One of the most famous sky scrapers in the world!',
//     location:{
//         lat: 40.7484474,
//         Lng: -73.9871516
//     },
//     address: '20 W 34th St, New York, NY 10001',
//     creator:'u1'
// }]

const getPlaceById = async (req,res,next)=>{
 
    const placeId = req.params.pid


    // const place = DUMMY_PLACES.find(p=>{
    //  return p.id === placeId
    // })

    let place
    try{
        place = await Place.findById(placeId);
    }catch(err){
        const error = new HttpError("Something went wrong, could not find a place.",500)
        return next(error)
    }
    
 
     if(!place){
        const error = new HttpError('Could not find a place for the provided id!',404)
        return next(error)
     
     }


  
     res.json({place:place.toObject({getters:true})});
 }
 
const getPlacesbyUserId = async (req,res,next)=>{

    const userId = req.params.uid
    // const places = DUMMY_PLACES.filter(p=>{
    //   return p.creator === userId
    // })

    let userwithPlaces
    try{
        userwithPlaces = await User.findById(userId).populate('places')
    }catch(error){
        const err = new HttpError('Fetching places failed ,please try again later',500)
        return next(err)
    }

    
    if(!userwithPlaces||userwithPlaces.places.length===0){
        return next(
            new HttpError('Could not find places for the provided user id.', 404)
          );
    }
    res.json({places:userwithPlaces.places.map(p=>p.toObject({getters:true}))});
}


const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
  
    const { title,description,address } = req.body;
  
    let coordinates;
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }

   const createdPlace = new Place({
    title,
    description,
    address,
    creator:req.userData.userId,
    location:coordinates,
    image:req.file.path

   })

   let user;
   try{
    user =   await User.findById(req.userData.userId)
   }catch(err){
    const error = new HttpError('Creating place failed, please try again later.',500)
    return next(error) 
  }

  if (!user){
    const error = new HttpError('Could not find user for provided id',500)
    return next(error)
  }

   console.log(user);

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session:sess });
        await sess.commitTransaction();
   
    } catch(err){
    const error  =new HttpError("Creating place failed, please try again later!",
    500)
    return next(error)
    }
  

//    DUMMY_PLACES.push(createdPlace)
   res.status(201).json({place:createdPlace})

}

const updatePlace =async (req,res,next)=>{

    const error = validationResult(req);
    if(!error.isEmpty()){
       const error= new HttpError("Invalid inputs passed, please check your data ",422)
       return next(error)
    }

    const {title,description} = req.body;
    const placeId = req.params.pid

    // const updatedPlace = {...DUMMY_PLACES.find(p=>p.id===placeId)} 

    // const placeIndex = DUMMY_PLACES.findIndex(p=>p.id ===placeId)

    let place
    try{
        place = await Place.findById(placeId)
    }catch(err){
        const error = new HttpError('Something went Wrong ,could not update the place.',500)
        return next(error)
    }

    if(place.creator.toString() !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to edit this place.',
            401
        )
        return next(error)
    }
    place.title= title
    place.description=description

    // DUMMY_PLACES[placeIndex]=updatedPlace
    try{
        await place.save()
    }catch(err){
        const error = new HttpError('Something went Wrong ,could not update the place.',500)
        return next(error)
    }

    res.status(200).json({palce: place.toObject({getters:true})})


}

const deletePlace = async(req,res,next)=>{

   
    const placeId = req.params.pid

    // if(!DUMMY_PLACES.find(p=>p.id===placeId)){
    //  throw new HttpError('Could not find a place for that id.',404)
    // }
    let place
    try{
        place = await Place.findById(placeId).populate('creator')
    }catch(err){
        const error = new HttpError('Something went Wrong ,could not delete the place.',500)
        return next(error)
    }


    // DUMMY_PLACES = DUMMY_PLACES.filter(p=>{
    //     return p.id !== placeId
    // })
    if(!place) {
        return next(new HttpError('Could not find place for this id.',404))
    }


    if(place.creator.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this place.',
            401
        )
        return next(error)
    }
    
    const imagePath = place.image
  
    try{

       const sess = await mongoose.startSession();
       sess.startTransaction();
       await place.deleteOne({session:sess});
       place.creator.places.pull(place)
       await place.creator.save({ session:sess });
       await sess.commitTransaction(); 

    }catch(err){
        const error = new HttpError('Something went Wrong ,could not delete the place.',500)
        return next(error)

    }
    fs.unlink(imagePath,(err)=>{
        console.log(err);

    })
    res.status(200).json({message:'Deleted Place.'})



}
exports.getPlaceById = getPlaceById
exports.getPlacesbyUserId = getPlacesbyUserId
exports.createPlace =  createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace




