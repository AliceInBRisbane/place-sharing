import React, { useEffect ,useState} from 'react';

import UsersList from '../components/UsersList';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  // const USERS = [
  //   {
  //     id: 'u1',
  //     username: 'Max Schwarz',
  //     image:
  //       'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  //     places: 3
  //   }
  // ];

 const {isloading,error,sendRequest,clearError} = useHttpClient()
  const [loadedUsers,setloadedUsers] =useState();


  useEffect(()=>{
    const fetchUsers=async ()=>{
      
      try{
        const  responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users')
        
        setloadedUsers(responseData.users)
    
      }catch(error){
     
       
      }
    
    }
    fetchUsers();
  },[sendRequest])



 return (
 <React.Fragment>
  <ErrorModal error={error} onClear={clearError}/>
  {isloading && (
    <div className='center'>
      <LoadingSpinner/>
    </div>
  )}
 {!isloading && loadedUsers && <UsersList item={loadedUsers}/>}
 </React.Fragment>
 )
};

export default Users;
