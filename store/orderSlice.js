import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.orders = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOrder } = orderSlice.actions;

export default orderSlice.reducer;
