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
            let email = document.getElementById("email");
            email.addEventListener("input", () => {
              let emailBox = document.querySelector(".emailBox")
              let emailText = document.querySelector(".emailText")
              const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/
          
              if (email.value.match(emailPattern)) {
                emailBox.classList.add("valid")
                emailBox.classList.remove("invalid")
                emailText.innerHTML = "Your Email Address in Valid"
              } else {
                emailBox.classList.add("invalid")
                emailBox.classList.remove("valid")
                emailText.innerHTML = "Must be a valid email address."
              }
            });
          
            password.addEventListener("input", () => {
              let passBox = document.querySelector(".passBox")
              let passText = document.querySelector(".passText")
              const passPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
          
              if (password.value.match(passPattern)) {
                passBox.classList.add("valid")
                passBox.classList.remove("invalid")
                passText.innerHTML = "Your Password in Valid"
              } else {
                passBox.classList.add("invalid")
                passBox.classList.remove("valid")
                passText.innerHTML =
                  "Your password must be at least 8 characters as well as contain at least one uppercase, one lowercase, and one number."
              }
            })
          }
           function matchTest() {
              let password = document.getElementById("password")
              let passText = document.querySelector(".passText")
              let pass = password.value
              let confirmPass = repeatPassword.value
          
              if (pass !== confirmPass) {
                passText.innerHTML = "Your Password dnt match"
                return false
              } else {
                passText.innerHTML = "Your Password match"
              }
            }
            let repeatPassword = document.getElementById("re-password")
            repeatPassword.addEventListener("keyup", (e) => {
              matchTest()
          })
        </script>    
     <div class="form">
       <form id="register-form" action="#">
          <ul class="form-container">
            <li>
              <h2>Create Account</h2>
            </li>
            <li>
              <label for="name">Name</label>
              <input type="name" name="name" id="name" required />
            </li>
            <li>
              <label for="email" class="emailBox">Email</label>
              <input type="email" name="email" id="email" required />
              <span class="emailText" color="black"></span>
            </li>
            <li>
              <label for="password" class="passBox">Password</label>
              <input type="password" id="password" name="password" class="password" required />
              <span class="passText" color="black" ></span>
            </li>
            <li>
              <label for="re-password">Re-Enter Password</label>
              <input type="password" id="re-password" name="re-password" class="re-password" required />
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
