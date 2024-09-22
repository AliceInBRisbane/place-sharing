import React,{useState,useContext} from 'react'
import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElement/Input'
import {useForm } from '../../shared/hooks/form-hook'
import {VALIDATOR_EMAIL,VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import Button from '../../shared/components/FormElement/Button'
import { AuthContext } from '../../shared/context/auth-context'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import {useHttpClient} from '../../shared/hooks/http-hook'

import './Auth.css'
import ImageUpload from '../../shared/components/FormElement/ImageUpload'

const Auth = (props) => {

  const auth = useContext(AuthContext)

const [ isLoginMode,setisLoginMode] = useState(true)
const {isloading,error,sendRequest,clearError} =useHttpClient()

const submitAuthHandler= async event =>{
    event.preventDefault()
    console.log(formState.inputs);
    
    if(isLoginMode){
      try{
     const responseData =  await sendRequest(
      process.env.REACT_APP_BACKEND_URL+'/users/login',
      "POST",
      JSON.stringify({
      email:formState.inputs.email.value,
      password:formState.inputs.password.value
       }),
      {
        'Content-Type':'application/json'
      },
      
      );
      auth.login(responseData.userId ,responseData.token);
     }catch(err){

     } 
  
    }else{
      
      try{ 
        const formData = new FormData();
        formData.append('username',formState.inputs.username.value)
        formData.append('email',formState.inputs.email.value)
        formData.append('password',formState.inputs.password.value)
        formData.append('image',formState.inputs.image.value)
      const responseData = await sendRequest(
    process.env.REACT_APP_BACKEND_URL+'/users/signup',
     "POST",
    formData
   
    )
   
  
    auth.login(responseData.userId,responseData.token);
  }catch(error){
   
  }
  }
    
   
}


const [formState,inputHandler,setFormData ]=useForm(
  {
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  },
  false
);

const switchSignupHandler = () => {
  if (!isLoginMode) {
    setFormData(
      {
        ...formState.inputs,
        username: undefined,
        image: undefined
      
      },
      formState.inputs.email.isValid && formState.inputs.password.isValid
    );
  } else {
    setFormData(
      {
        ...formState.inputs,
        username: {
          value: '',
          isValid: false
        },
        image:{
          value: null,
          isValid : false
        }
      },
      false
    );
  }
  setisLoginMode(prevMode => !prevMode);
};




  return ( 
    <React.Fragment>
   <ErrorModal error ={error} onClear={clearError}/>
  <Card className='authentication'>
    {isloading && <LoadingSpinner asOverlay={true}/>}
    <h2>Login Required</h2>
    <hr/>
    <form  onSubmit={submitAuthHandler}>
      {!isLoginMode && (<Input
       type='text' 
       id='username'
       label='Username' 
       validators={[VALIDATOR_REQUIRE()]}
       element='input' 
       errorText="Please enter a valid Username."
       onInput={inputHandler}
       />)}
        {!isLoginMode && (
        <ImageUpload center id="image" onInput={inputHandler} errorText='Please provide an image.'/>
        )}
      
            <Input 
            type='email' 
            id='email'
            label='E-mail' 
            validators={[VALIDATOR_EMAIL()]}
            element='input' 
            errorText="Please enter a valid Email address."
            onInput={inputHandler}>
             </Input>
             <Input 
            type='password' 
            id='password'
            label='Password' 
            validators={[VALIDATOR_MINLENGTH(7)]}
            element='input' 
            errorText="Please enter a valid Password,at least 7 characters."
            onInput={inputHandler}>
             </Input>

             <Button type="submit" disabled={ !formState.isValid } onClick={submitAuthHandler}>
             {isLoginMode?'LOGIN':'SIGNUP'}
             </Button>
           
            </form>
            <Button inverse  onClick={switchSignupHandler}>
              {isLoginMode?'SWITCH TO SIGNUP':'SWITCH TO LOGIN'}
             </Button>
        </Card>
        </React.Fragment>
 
  )
}

export default Auth