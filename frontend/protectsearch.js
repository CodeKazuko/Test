/* eslint-disable prefer-const */
// eslint-disable-next-line no-unused-vars
function textOnly(){
    // eslint-disable-next-line prefer-const
    // scans search bar text 
    let str = document.getElementById("q").value
    if(!(/^[a-zA-Z]+$/.test(str))){
      // stopping user from typing numbers and special character for products 
      document.getElementById('q').value = ""
      // eslint-disable-next-line no-alert
      alert("Stop typing numbers and special character!")
      document.getElementById('q').value = ""}
  }