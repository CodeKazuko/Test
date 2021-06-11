const Footer = {
  render: async () => {
    return `
    <footer class="footer">
      <div class="footer-left">
        <img src="../img/icon.png">
      </div> 
      <div class="footer-right">
        <li class="features">
           <h2>Useful Links</h2>
             <ul class="box">
               <li><a href="/#/about">About Us</a></li>
               <li><a href="/#/contact">Contact Us</a></li> 
             </ul>
        </li>
      </div>
      <div class="footer-bottom">
        <p>All rights reserved by &copy;2020 </p>
      </div>
    </footer>`
  },
  after_render: async () => {},
}

export default Footer
