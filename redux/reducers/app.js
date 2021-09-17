let initState = {};

const app = (state = initState, action) => {
  switch (action.type) {
    case 'saveToken':
      return {...state, token: action.data};
    // case 'getToken':
    //   return state.token;
    // case 'saveUserInfo':
    //   return {...state, userInfo: action.data};
    case 'saveWS':
      return {...state, ws: action.data};
    default:
      return state;
  }
};

export default app;
