/* eslint-disable no-useless-escape */
import { redirectUser, isLoggedIn, showLoading, showMessage, hideLoading } 
from '../utils.js'
import { register } from '../api.js'
import { setUserInfo } from '../localStorage.js'

const RegisterScreen = {
  after_render: () => {
    if (isLoggedIn()) {
      redirectUser()
      return
    }

    document.getElementById('register-form').addEventListener('submit', 
    async (e) => {
        e.preventDefault()
        showLoading()
        const data = await register({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        })
        hideLoading()
        if (data.error) {
          showMessage(data.error)
        } else {
          setUserInfo(data)
          redirectUser()
        }
      })
  },
  render: () => `
  <script type="text/javascript"> 
  window.onload = function() {
  let email = document.getElementById("email")
  let password = document.getElementById("password")
  
  
  email.addEventListener('input',()=>{
    let emailBox = document.querySelector('.emailBox')
    let emailText = document.querySelector('.emailText')
    const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/

    if(email.value.match(emailPattern)){
      emailBox.classList.add('valid')
      emailBox.classList.remove('invalid')
      emailText.innerHTML = "Your Email Address in Valid"
      alert("Your Email Address in Valid")
    }else{
      emailBox.classList.add('invalid')
      emailBox.classList.remove('valid')
      emailText.innerHTML = "Must be a valid email address."
      alert("Your Email Address in invalid")
    }
   })
   
  password.addEventListener('input',()=>{
      let passBox = document.querySelector('.passBox');
      let passText = document.querySelector('.passText');
      const passPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

      if(password.value.match(passPattern)){
         passBox.classList.add('valid');
         passBox.classList.remove('invalid');
         passText.innerHTML = "Your Password in Valid"; 
         alert("Your Password is Valid")
      }else{
         passBox.classList.add('invalid');
         passBox.classList.remove('valid');
         passText.innerHTML = "Your password must be at least 8 characters as well as contain at least one uppercase, one lowercase, and one number."; 
         alert("Your Password is invalid")
    }
  })   

  function matchTest(){
    let password = document.querySelector('password').value
    let confirmPassword = document.querySelector('re-password').value
    
    if(password != confirmPassword)
      alert("Password don't match. Please try again.")
      return false
    }
    else if(password == confirmPassword){
      alert("Password match")
    }
  }
}
</script>    
      <div class="form">
        <form id="register-form">
          <ul class="form-container">
            <li>
              <h2>Create Account</h2>
            </li> 
            <li>
              <label for="name">Name</label>
              <input
                type="name"
                name="name" 
                required
                id="name" />
            </li>
            <li>
              <label for="email">Email</label>
              <input 
                type="email"
                name="email"
                id="email"   
                required />
            </li>
            <li>
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required        
                onkeyup="matchTest()"
                />
            </li>
            <li>
              <label for="re-password">Re-Enter Password</label>
              <input
                type="password"
                id="re-password"
                name="re-password"
                required            
                />
            </li>
            <li>
              <button type="submit" class="primary">
                Register
              </button>
            </li>
            <li>
              <div>Already have an account? <a href="/#/signin"> Sign-In </a>
              </div>
            </li>
          </ul>
        </form>
      </div>`,
}
export default RegisterScreen
