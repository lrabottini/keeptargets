const toFormattedDate = (date) => {
    let [d, m, y] = date.split(/[\/: ]/).map(v => parseInt(v))

    console.log(d)
    console.log(m)
    console.log(y)

    const newDate = new Date(y, m - 1, d)
    
    console.log(newDate)
    return newDate
}

export { toFormattedDate }