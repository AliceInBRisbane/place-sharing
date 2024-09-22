import React, { useEffect, useRef, useState } from 'react'
import './ImageUpload.css'
import Button from './Button'


const ImageUpload = (props) => {

    const filePickerRef =useRef()
    const [file,setfile] =useState();
    const [previewUrl,setpreviewUrl]=useState()
    const [isValid,setisValid] =useState(false)

    useEffect(()=>{

        if(!file){
            return
        }
        const fileReader =new FileReader()
        fileReader.onload=()=>{
        setpreviewUrl(fileReader.result)
        // console.log(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    },[file])

    const pickedHandler =(event)=>{
        let pickedFile
        let fileIsValid = isValid
    if(event.target.files && event.target.files.length===1 ){
       pickedFile = event.target.files[0]
        setfile(pickedFile)
        setisValid(true);
        fileIsValid= true
        // console.log(pickedFile);
    }else{
        setisValid(false)
        fileIsValid = false
    }
    props.onInput(props.id,pickedFile,fileIsValid)
    }
    

    const pickImageHandler= (event)=>{
        filePickerRef.current.click()
    }
  return (
    <div className="form-control">
       <input
       ref={filePickerRef}
       type='file'
       id={props.id}
       style={{display:'none'}}
       accept='.jpg,.png,.jpeg'
       onChange={pickedHandler}
      
       />
    <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          { previewUrl && <img src={previewUrl} alt='Preview'/>}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>PICK IMAGE</Button>
        </div>
        {!isValid && <p>{props.errorText}</p>}
    </div>

  )
}

export default ImageUpload