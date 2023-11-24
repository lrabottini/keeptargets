const toFormattedDate = (date) => {
    let [d, m, y] = date.split(/[\/: ]/).map(v => parseInt(v))
    return new Date(y, m - 1, d)
}

export { toFormattedDate }