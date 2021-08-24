import {combineReducers} from 'redux';
import videoInfo from './videoInfo';
import videoList from './videoList';

export default combineReducers({
  videoInfo,
  videoList,
});
