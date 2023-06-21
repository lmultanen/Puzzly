import { configureStore, combineReducers } from '@reduxjs/toolkit';
import imageSlice from './slices/imageSlice';
import userSlice from './slices/userSlice';
import logger from 'redux-logger';

const rootReducer = combineReducers({
    user: userSlice,
    image: imageSlice
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