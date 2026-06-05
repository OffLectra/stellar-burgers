import { RootState } from '@services/store';

// Ингредиенты
export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

// Конструктор
export const selectConstructorItems = (state: RootState) => ({
  bun: state.burgerConstructor.bun,
  ingredients: state.burgerConstructor.ingredients
});
export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

// Пользователь
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) =>
  state.user.error ?? undefined;

// Лента
export const selectFeeds = (state: RootState) => state.feeds;
export const selectFeedsOrders = (state: RootState) => state.feeds.orders;
export const selectFeedsTotal = (state: RootState) => state.feeds.total;
export const selectFeedsTotalToday = (state: RootState) =>
  state.feeds.totalToday;
export const selectFeedsLoading = (state: RootState) => state.feeds.loading;
export const selectFeedsError = (state: RootState) => state.feeds.error;

// Заказы пользователя
export const selectUserOrders = (state: RootState) => state.orders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.orders.loading;
export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
