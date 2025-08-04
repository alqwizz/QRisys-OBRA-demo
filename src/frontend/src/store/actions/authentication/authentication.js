export const setUserSession = (store, userSession) => {
    store.setState({ userSession: userSession });
}
export const removeUserSession = (store) => {
    store.setState({ userSession: null });
}
export const hasPermission = (store) => (permisosCodes) => {
    const session = store.state.userSession
    if (session && session.permisos)
        return session.permisos.find(x => {
            if (Array.isArray(permisosCodes)) return permisosCodes.includes(x.codigo);
            else if (typeof permisosCodes === 'string') return x.codigo === permisosCodes;
            return false;
        }) ? true : false;
    return false;
}