
const alphabet = "ABCCDEFGHIJKLMNOPQRSTUVWXYZ"

function getInitials(name) {
    const initials =  name.split(' ')
    let firstInital = initials[0][0].toUpperCase()
    let secondInitial
    if(initials.length > 1 && initials[1] !== '') {
      secondInitial = initials[1][0].toUpperCase()
    } else {
      secondInitial = alphabet[Math.floor(Math.random() * 26)] 
    }
    
    return firstInital + secondInitial
  }
  module.exports = { getInitials }