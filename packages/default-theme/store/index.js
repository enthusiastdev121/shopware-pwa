export const state = () => ({
  cart: null,
  page: null,
  user: null,
  sessionContext: null,
  cartSidebarOpen: false,
})

export const mutations = {
  SET_CART(state, cart) {
    state.cart = cart
  },
  SET_PAGE(state, page) {
    state.page = page
  },
  SET_USER(state, user) {
    state.user = user
  },
  SET_SESSION_CONTEXT(state, sessionContext) {
    state.sessionContext = sessionContext
  },
  SET_CART_SIDEBAR_IS_OPEN(state, flag) {
    state.cartSidebarOpen = flag
  },
}

export const getters = {
  getCart: (state) => state.cart,
  getPage: (state) => state.page,
  getUser: (state) => state.user,
  getSessionContext: (state) => state.sessionContext,
  getIsCartSidebarOpen: (state) => state.cartSidebarOpen,
}
