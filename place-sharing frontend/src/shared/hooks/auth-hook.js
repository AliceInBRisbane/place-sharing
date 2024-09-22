

import { useCallback ,useEffect,useState} from 'react';

let logoutTimer
export const useAuthHook = () => {
    const [token,setToken] =useState(false)
    const [userId,setuserId] = useState(false)
    const [expirationDate,setexpirationDate] = useState()
  
    const login =useCallback((uid,token,expirationDate)=>{
      setToken(token)
      setuserId(uid)
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime()+ 1000 *60*60)
      setexpirationDate(tokenExpirationDate )
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId:uid,
          token:token,
          expiration:tokenExpirationDate.toISOString()})
      )
   
    },[])
  
  
   
    const logout =useCallback(()=>{
      setToken(null)
      setuserId(null)
      setexpirationDate(null)
      localStorage.removeItem('userData')
    },[])
  
  
    useEffect(()=>{
      if(token && expirationDate){ 
        const remainingTime = expirationDate.getTime() - new Date().getTime()
        logoutTimer =setTimeout(logout,remainingTime)
      }else{
        clearTimeout(logoutTimer)
      }
  
    },[token,logout,expirationDate])
  
  
    useEffect(()=>{
      const storedData= JSON.parse(localStorage.getItem('userData'))
      if (
        storedData && 
        storedData.token && 
        new Date(storedData.expiration)>new Date()
      ){
       login(storedData.userId,storedData.token,new Date(storedData.expiration))
      }
     },[login])
  
  
  return {login,logout,userId,token}
}
