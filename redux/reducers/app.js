let initState = {};

const app = (state = initState, action) => {
  switch (action.type) {
    case 'saveToken':
      return {...state, token: action.data};
    case 'getToken':
      return state.token;
    default:
      return state;
  }
};

export default app;
