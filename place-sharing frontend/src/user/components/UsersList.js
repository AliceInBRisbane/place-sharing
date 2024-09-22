import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import UserItem from './UserItem';
import './UsersList.css';

const UsersList = props => {

  if(props.item.length ===0){
    return(

        <div className='center'>
          <Card>
            <h2>No User found!</h2>
          </Card>
          
        </div>

    )
  }


  else return (
    <ul className="users-list">
      {
        props.item.map(user=>{
          return(<UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          username={user.username}
          placeCount={user.places.length} 
          />)
          
          
        })
      }
    </ul>
  );
};

export default UsersList;
