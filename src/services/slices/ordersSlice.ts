import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi, TNewOrder } from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const getOrdersThunk = createAsyncThunk(
  'orders/getOrders',
  getOrdersApi
);

export const orderBurgerThunk = createAsyncThunk(
  'orders/orderBurger',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response.order;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getOrders
      .addCase(getOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.error = action.error.message || '������ �������� �������';
        state.loading = false;
      })
      // orderBurger
      .addCase(orderBurgerThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
        state.orderRequest = false;
      })
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.error = action.error.message || '������ ���������� ������';
        state.orderRequest = false;
      });
  }
});

export const { clearOrderModal } = ordersSlice.actions;
export default ordersSlice.reducer;
