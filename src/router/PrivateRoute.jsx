// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAdminLoginMutation } from '../redux/features/auth/login';

// const PrivateRoute = ({children}) => {
//     const location = useLocation()
//     const { user} =  useAdminLoginMutation()
    
//      if(user){
//          return children;
//      }
//       return <Navigate to="/" state={{from:location}} replace/>
   
// };

// export default PrivateRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const location = useLocation()
    const user =  JSON.parse(localStorage.getItem('user'))
    
     if(user){
         return children;
     }
      return <Navigate to="/" state={{from:location}} replace/>
   
};

export default PrivateRoute;