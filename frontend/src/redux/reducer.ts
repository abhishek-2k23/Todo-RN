   // frontend/src/redux/reducers.ts

   import { combineReducers } from 'redux';
   import userReducer from '../redux/slices/user';

   const rootReducer = combineReducers({
     user: userReducer,
     // Add more reducers here
   });

   export default rootReducer;