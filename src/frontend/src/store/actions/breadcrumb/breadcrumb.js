export const setBreadcrumb = (store, breadcrumb) => {
    /*let breadcrumb = store.state.breadcrumb;
    if (level === 0) breadcrumb = [nuevaEntrada];
    else {
        while (breadcrumb.length > level) {
            breadcrumb.pop()
        }
        breadcrumb.push(nuevaEntrada)
    }*/
    store.setState({ breadcrumb: breadcrumb })
}