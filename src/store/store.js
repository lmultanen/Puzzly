import { configureStore, combineReducers } from '@reduxjs/toolkit';
import imageSlice from './slices/imageSlice';
import userSlice from './slices/userSlice';
import adminSlice from './slices/adminSlice';
import logger from 'redux-logger';

const rootReducer = combineReducers({
    user: userSlice,
    image: imageSlice,
    admin: adminSlice
})

export default configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        if (process.env.NODE_ENV === 'production') {
          return getDefaultMiddleware();
        } else {
          return getDefaultMiddleware().concat(logger);
        }
      },
})