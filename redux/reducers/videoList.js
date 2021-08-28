let initState = {};

const videoList = (state = initState, action) => {
  switch (action.type) {
    case 'saveVideo':
      const id = action.data.fk_works_id;
      console.log('id:', id);
      // return [...state, action.data];

      const old = state[id] ? state[id] : [];
      const obj = {...state, [id]: [...old, action.data]};
      console.log('obj:', obj);
      return obj;
    case 'clearVideo':
      state[action.data.fk_works_id] = [];
      return {...state};
    default:
      return state;
  }
};

export default videoList;
