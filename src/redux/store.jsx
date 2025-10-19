import { configureStore } from '@reduxjs/toolkit';
import jsonSlicer from './jsonSlicer';

const store = configureStore({
  reducer: {
    review: jsonSlicer,
  },
});

export default store;
