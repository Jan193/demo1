let initState = {};

const app = (state = initState, action) => {
  switch (action.type) {
    case 'saveToken':
      return {...state, token: action.data};
    default:
      return state;
  }
};

export default app;
