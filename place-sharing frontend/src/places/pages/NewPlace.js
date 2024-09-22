import React, {useContext}from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Input from '../../shared/components/FormElement/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElement/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ImageUpload from '../../shared/components/FormElement/ImageUpload';
import './PlaceForm.css'






const NewPlace = () => {

  const auth = useContext(AuthContext)

  const {isloading,error,sendRequest,clearError} =useHttpClient()

//pass as innitiaInputs and initialFormValidity
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image:{
        value: null,
        isValid:false
      }
    },
    false
  );


const history = useHistory()

const placesubmitHandler =async (event)=>{
  event.preventDefault()
  console.log(formState.inputs);
  try{ 
    const formData = new FormData();
    formData.append('title',formState.inputs.title.value)
    formData.append('description',formState.inputs.description.value)
    formData.append('address',formState.inputs.address.value)
    formData.append('image',formState.inputs.image.value)
  await sendRequest(process.env.REACT_APP_BACKEND_URL +'/places',
  "POST",
  formData,
  {
    Authorization:"Bearer "+auth.token
  })
history.push('/')
}catch(err){

}

}
 
  return (
  <React.Fragment>
  <ErrorModal error={error} onClear={clearError}/>
  <form className='place-form' onSubmit={placesubmitHandler}>
    {isloading && <LoadingSpinner asOverlay={true}/>}
    <Input 
    id='title'
    element='input' 
    type='text' 
    label='Title' 
    validators={[VALIDATOR_REQUIRE()]}
    errorText="Please enter a valid title."
    onInput={inputHandler}
    />
    <Input 
    id='description'
    element='input' 
    type='textarea' 
    label='Description' 
    validators={[VALIDATOR_MINLENGTH(5)]}
    errorText="Please enter a valid description (at least 5 characters)."
    onInput={inputHandler}
    />
    <Input 
    id='address'
    element='input' 
    type='text' 
    label='Address' 
    validators={[VALIDATOR_REQUIRE()]}
    errorText="Please enter a valid Address."
    onInput={inputHandler}
    />
    <ImageUpload center  id="image" onInput={inputHandler} errorText='Please provide an image.'/>
    <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </React.Fragment>
  );
   
};

export default NewPlace;