const ContactUsScreen = {
  render: async () => {
    return `
            <section class="section">
              <div class="content">
                <h2>Contact Us</h2>
                <p>Pls contact using this address and contact or write in.</p>
              </div>  
              <div class="container">
                <div class="contactInfo">
                  <div class="box">
                    <div class="icon"><i class="fa fa-map-marker" aria-hidden="true"></i></div>
                    <div class="text">
                      <h3>Address</h3>
                      <p>1 Ang Mo Kio, <br>Ind Pk, 2A,<br>#04-09</p>
                    </div>  
                  </div>
                  <div class="box">
                    <div class="icon"><i class="fa fa-phone" aria-hidden="true"></i></div>
                    <div class="text">
                       <h3>Phone</h3>
                         <p>62586359</p>
                    </div>  
                  </div>
                  <div class="box">
                    <div class="icon"><i class="fa fa-envelope" aria-hidden="true"></i></div>
                    <div class="text">
                       <h3>Email</h3>
                         <p>Reviva@gmail.com</p>
                    </div>  
                  </div> 
                </div>
              </div>
            </section>
        `

  },
  after_render: async () => {},
}

export default ContactUsScreen
