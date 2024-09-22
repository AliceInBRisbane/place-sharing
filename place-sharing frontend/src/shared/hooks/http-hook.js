import {useState,useCallback,useRef,useEffect} from "react";


export const useHttpClient =(props)=>{

    const[isloading,setisloading] =useState(false)
    const[error,setError] = useState(false)


    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback( async (
        url, 
        method="GET",
         body=null,
         headers={}
       
        ) =>{
        setisloading(true);
        const HttpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(HttpAbortCtrl)

        try{
            const response = await fetch(url,{
                method:method,
                headers:headers,
                body:body,
                signal:HttpAbortCtrl.signal
            })

            const responseData = await response.json()

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl=>reqCtrl !== HttpAbortCtrl
            )

            if(!response.ok){
              throw new Error(responseData.message)
            }
            setisloading(false)
            return responseData
       
        }catch(error){
         
           
            setError(error.message)
            setisloading(false)
            throw error;
        }


    },[])

const clearError = ()=>{
    setError(null)
}

useEffect(()=>{
    return ()=>{
        activeHttpRequests.current.forEach(abortCtrl=>abortCtrl.abort())
    }
},[])

return {
    isloading:isloading,
    error:error,
    sendRequest:sendRequest,
    clearError:clearError
}
}

