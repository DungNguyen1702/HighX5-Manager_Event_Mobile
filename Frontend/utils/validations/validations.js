export const isValidEmail = (stringEmail) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(stringEmail)
}

export const isValidPassword = (stringPassword) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(stringPassword)
}

export const isValidPhoneNumber = (stringNumber) => {
    return /^\d{9,}$/.test(stringNumber)
}

export const isValidUsername = (stringUsername) => {
    return stringUsername.length >= 5
}
