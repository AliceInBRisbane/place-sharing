import React, { useEffect, useState } from 'react'
import PlaceList from '../components/PlaceList';
import {useParams} from 'react-router-dom'
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// const DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
//     address: '20 W 34th St, New York, NY 10001',
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584
//     },
//     creator: 'u1'
//   },
//   {
//     id: 'p2',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
//     address: '20 W 34th St, New York, NY 10001',
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584
//     },
//     creator: 'u2'
//   }
// ];

const UserPlaces = () => {

const {isloading,error,sendRequest,clearError} = useHttpClient()
const [loadedPlaces,setloadedPlaces] = useState()
  
  const userId = useParams().userId
  // const loadPlaces = DUMMY_PLACES.filter(place => place.creator === userId)


  useEffect(()=>{

    const fetchPlaces = async ()=>{ 
    try{
      const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`)
      setloadedPlaces(responseData.places)
    }catch(err){

    }}
    fetchPlaces()
  },[sendRequest,userId])
 
  const placeDeletedHandler =(deletedPlaceId)=>{
    setloadedPlaces(prevPlaces=>prevPlaces.filter(place=>place.id !== deletedPlaceId))
  }

  return (
  <React.Fragment>
  <ErrorModal error={error} onClear={clearError}/>
  {isloading && (
  <div className='certer'>
  <LoadingSpinner asOverlay={true}/>
  </div>
  )}
 {!isloading && loadedPlaces && <PlaceList item={loadedPlaces} onDeletePlace={placeDeletedHandler}></PlaceList>} 
  </React.Fragment>
  )
}

export default UserPlaces