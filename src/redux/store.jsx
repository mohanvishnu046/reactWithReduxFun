import { configureStore } from '@reduxjs/toolkit';
import jsonSlicer from './jsonSlicer';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage, // Can be replaced with sessionStorage if needed
  whitelist: ['review'], // Only persist the review slice
};

// Combine reducers if you have more in future
const rootReducer = combineReducers({
  review: jsonSlicer,
});

// Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export default store;
