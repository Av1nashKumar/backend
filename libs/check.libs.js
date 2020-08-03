let trim = (x) => {
    let value = String(x)
    return value.replace(/\s/g, "")
}

let isEmpty = (value) => {
    if (value === null || value === undefined || trim(value) === '' || trim(value).length === 0) {
        return true
    } else {
        return false
    }
}

/**
 * exporting functions.
 */
module.exports = {
    trim: trim,
    isEmpty: isEmpty
}