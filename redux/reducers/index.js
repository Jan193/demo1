import {combineReducers} from 'redux';
import app from './app';
import videoInfo from './videoInfo';
import videoList from './videoList';

export default combineReducers({
  app,
  videoInfo,
  videoList,
});
