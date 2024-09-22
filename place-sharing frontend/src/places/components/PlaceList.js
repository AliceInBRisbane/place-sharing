import React from 'react'
import PlaceItem from './PlaceItem'
import Card from '../../shared/components/UIElements/Card'
import './PlaceList.css'
import Button from '../../shared/components/FormElement/Button'

const PlaceList = (props) => {

    if( props.item.length===0){
    return (

        <div className='place-list center'>
          <Card>
            <h3 >No place found. Maybe Create One Now?</h3>
            <Button to='/places/new/'>Share place!</Button>
          </Card>
        </div>

    )

    }
  return (
    <ul className='place-list'>

     {
        props.item.map(place=>(<PlaceItem
            key={place.id} 
            id={place.id}
            title={place.title} 
            image={place.image} 
            description={place.description} 
            address={place.address} 
            creatorId={place.creator} 
            coordinates={place.location}
            onDelete={props.onDeletePlace}/>))
     }
    </ul>

  )
    
}

export default PlaceList