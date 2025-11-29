import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: '' as string,
mail: '' as string,
tokens: 1000 as number,
date: '' as string,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setuser(state, action) {
const {id, mail, tokens, date} = action.payload
state.id = id
state.id = mail
state.id = tokens
state.id = date
    }
  }

});

export const { setuser } = userSlice.actions;
export default userSlice.reducer;
