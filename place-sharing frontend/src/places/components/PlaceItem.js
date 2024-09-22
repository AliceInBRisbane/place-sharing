import React, { useState,useContext } from 'react'
import Card from '../../shared/components/UIElements/Card'
import './PlaceItem.css'
import Button from '../../shared/components/FormElement/Button'
import Modal from '../../shared/components/UIElements/Modal'
import Map from '../../shared/components/UIElements/Map'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

const PlaceItem = (props) => {

  const {isloading,error,sendRequest,clearError} =useHttpClient()
  const auth = useContext(AuthContext)
  const[ismapShow,setismapShow]=useState(false)
  const[showDeleteModal,setshowDeleteModal] = useState(false)

 const  mapShowHandler =()=>{
  setismapShow(true)
 }
 const  mapCancelHandler =()=>{
  setismapShow(false)
 }

 const showDeleteHandler =()=>{
  setshowDeleteModal(true)
 }
 const confirmDeleteHandler =async()=>{
 
  setshowDeleteModal(false)
  try{
   await sendRequest(
    process.env.REACT_APP_BACKEND_URL+`/places/${props.id}`,
    'DELETE',
    null,
    {
      Authorization:"Bearer "+auth.token
    });
   props.onDelete(props.id);
  }catch(err){

  }
  

 }
 const cancelDeleteHandler =()=>{
  setshowDeleteModal(false)

 }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
    <Modal
    show={ismapShow}
    onCancel={mapCancelHandler}
    header={props.address}
    contentClass="place-item__modal-content"
    footerClass="place-item__modal-actions"
    footer={<Button onClick ={mapCancelHandler} >CLOSE</Button>}
    >
      <div className="map-container">
           <Map center={props.coordinates} zoom={16} />
        </div>
    </Modal >
    <Modal
    show={showDeleteModal}
    onCancel={cancelDeleteHandler}
    header="Are you sure?"
    contentClass="place-item__modal-content"
    footerClass="place-item__modal-actions"
    footer={  <React.Fragment>
      <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
      <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
      </React.Fragment>
  }>
     <p className='center'>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>

    </Modal>
    <li className='place-item'>
      <Card className='place-item__content'>
        {isloading && <LoadingSpinner asOverlay={true}/>}
    <div className='place-item__image'>
        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title}/>
    </div>
    <div className='place-item__info'>
        <h2>{props.title}</h2>
        <h3>{props.address}</h3>
        <h3>{props.location}</h3>
        <p>{props.description}</p>

    </div>
    <div className='place-item__actions'>
      <Button inverse onClick={mapShowHandler}>VIEW ON MAP</Button>
      {auth.userId===props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
      {auth.userId===props.creatorId && <Button danger onClick={showDeleteHandler}>DELETE</Button>}
    

    </div>
    </Card>
    </li>
    </React.Fragment>
  )
}

export default PlaceItem