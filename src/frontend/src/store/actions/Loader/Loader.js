export const addRequest = (store) => {
    store.setState({ loader: store.state.loader + 1 })
}
export const removeRequest = (store) => {
    store.setState({ loader: store.state.loader - 1 })
}
