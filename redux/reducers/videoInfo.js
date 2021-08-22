let initState = {};

const videoUrl = (state = initState, action) => {
  switch (action.type) {
    case 'saveVideoInfo':
      return {...state, ...action.data};
    default:
      return state;
  }
};

export default videoUrl;
