export function formatDateAndTime() {
    let date = new Date();
    let day = date.getDate(); // automatically avoids leading zeros
    let month = date.toLocaleString('default', { month: 'short' }); 
    let dayOfWeek = date.toLocaleString('default', { weekday: 'short' })
    let formattedDate = `${dayOfWeek}, ${month} ${day}`;
  
    return formattedDate; 
  }
  export function linkCreationDate(d) {
    let date = new Date(d)
    let month = date.toLocaleString('default', { month: 'short'})
    let day = date.getDate()
    let year = date.getFullYear()
    let time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    let formattedDateAndTime = `${`${month} ${day}, ${year}  ${time}`}`
    return formattedDateAndTime
  }
  export function linkExpirationDate(d) {
    let date = new Date(d)
    let month = date.toLocaleString('default', { month: 'short'})
    let day = date.getDate()
    let year = date.getFullYear()
    let time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    let formattedDateAndTime = `${`${month} ${day}, ${year}, ${time}`}`
    return formattedDateAndTime
  }
