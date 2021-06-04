const AboutScreen = {
  render: async () => {
    return `
            <section class="section">
                <h1> About Us </h1>
                <div class="wrapper">
                  <div class="content">
                    <h3>This online shop is to assist long term illness patients by selling it online and deliver to their house. With this, patients can stay at home safe and sound instead of risking going outside with a chance of getting Covid. For any further enquiry, click on the Contact us link in footer.</h3>
                  </div>
                </div>  
            </section>
        `
  },
  after_render: async () => {},
}

export default AboutScreen
