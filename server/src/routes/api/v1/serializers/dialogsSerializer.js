export const dialogsForList = (dialogs) => {
    const serializedDialogs = dialogs.map(dialog => {
        return dialog.id
    })
    return serializedDialogs
}