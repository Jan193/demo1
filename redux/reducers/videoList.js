let initState = [];

const videoUrl = (state = initState, action) => {
  switch (action.type) {
    case 'saveVideo':
      return [...state, action.data];
    default:
      return state;
  }
};

export default videoUrl;
