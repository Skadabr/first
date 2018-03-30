
export const getUserInfo = state => {
  const { _id, name, status, email, rate } = state.user;
  return { _id, name, status, email, rate }
}

export const isAuthenticated = state => !!state.user.token
