import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const sectionsRef = {
    home: useRef(null),
    portfolio: useRef(null),
    about: useRef(null),
    services: useRef(null),
    contact: useRef(null),
  };

  const navigateToSection = (slug) => {
    sectionsRef[slug].current.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(slug);
  };

  // Simple placeholder image data - using solid colors for "images"
  const images = [
    { id: 1, category: 'portraits', src: 'bg-red-900', alt: 'Portrait of a woman looking at the camera' },
    { id: 2, category: 'landscape', src: 'bg-green-900', alt: 'Majestic mountains at sunset' },
    { id: 3, category: 'events', src: 'bg-blue-900', alt: 'Concert crowd cheering' },
    { id: 4, category: 'portraits', src: 'bg-yellow-900', alt: 'Close-up of a child smiling' },
    { id: 5, category: 'landscape', src: 'bg-purple-900', alt: 'Foggy forest in the morning' },
    { id: 6, category: 'events', src: 'bg-indigo-900', alt: 'Wedding ceremony outdoors' },
    { id: 7, category: 'portraits', src: 'bg-pink-900', alt: 'Fashion model posing' },
    { id: 8, category: 'landscape', src: 'bg-teal-900', alt: 'Desert landscape with cacti' },
  ];

  const categories = ['All', 'Portraits', 'Landscape', 'Events'];
  const [filter, setFilter] = useState('All');

  const filteredImages = filter === 'All'
    ? images
    : images.filter(img => img.category === filter.toLowerCase());

  const openLightbox = (image) => {
    setCurrentImage(image);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
  };

  const Lightbox = ({ image, onClose }) => {
    if (!image) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
        onClick={onClose}
      >
        <div className="relative max-w-4xl max-h-full overflow-hidden rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className={`w-[80vw] h-[80vh] flex items-center justify-center text-white text-4xl ${image.src}`}>
            <span className="sr-only">Image: {image.alt}</span>
            <span className="text-white text-2xl font-bold">Project {image.id} Detail</span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 transition-colors"
            aria-label="Close Lightbox"
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  const testimonials = [
    { quote: "John's work is exceptional, capturing moments with unparalleled artistry. Truly a master of his craft.", author: "Sarah L., Art Director" },
    { quote: "The photographs exceeded our expectations. Professional, creative, and a pleasure to work with.", author: "Michael R., Marketing Agency" },
    { quote: "Every image tells a story. We're thrilled with the results and will definitely collaborate again.", author: "Emily C., Private Client" },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-[#B0B0B0] font-sans">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#121212] shadow-lg py-4 border-b border-[#1E1E1E]">
        <nav className="container mx-auto px-4 flex justify-between items-center">
          <a href="#" onClick={() => navigateToSection('home')} className="text-white text-3xl font-serif tracking-wide">
            John Doe Photography
          </a>
          <ul className="flex space-x-6">
            {['home', 'portfolio', 'about', 'services', 'contact'].map((slug) => (
              <li key={slug}>
                <button
                  onClick={() => navigateToSection(slug)}
                  className={`capitalize text-lg transition-colors duration-300
                    ${activeSection === slug ? 'text-[#A52A2A] font-bold' : 'text-[#B0B0B0] hover:text-white'}`}
                >
                  {slug}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        {/* Home Section - Hero Showcase */}
        <section ref={sectionsRef.home} id="home" className="relative h-screen flex items-center justify-center bg-[#1E1E1E] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90"></div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
              Capturing Moments, Crafting Stories
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10">
              Unveiling the art of high-end photography, where every frame is a masterpiece.
            </p>
            <button
              onClick={() => navigateToSection('portfolio')}
              className="bg-[#A52A2A] text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-opacity-80 transition-colors duration-300"
            >
              View Portfolio
            </button>
          </div>
        </section>

        {/* Home Section - Featured Projects */}
        <section className="py-20 bg-[#121212]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif text-white text-center mb-16">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.slice(0, 3).map((img) => (
                <div key={img.id} className="relative group overflow-hidden rounded-lg shadow-xl" onClick={() => openLightbox(img)}>
                  <div className={`w-full h-80 ${img.src} flex items-center justify-center text-white text-3xl font-bold`}>
                    <span className="sr-only">Featured image: {img.alt}</span>
                    Project {img.id}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xl font-semibold">View Details</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <button
                onClick={() => navigateToSection('portfolio')}
                className="bg-transparent border border-[#A52A2A] text-[#A52A2A] py-3 px-8 rounded-full text-lg font-semibold hover:bg-[#A52A2A] hover:text-white transition-colors duration-300"
              >
                Explore All Projects
              </button>
            </div>
          </div>
        </section>

        {/* Home Section - Client Testimonials */}
        <section className="py-20 bg-[#1E1E1E]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif text-white text-center mb-16">What Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-[#121212] p-8 rounded-lg shadow-xl border border-[#1E1E1E] text-center">
                  <p className="text-lg italic mb-6 text-[#B0B0B0]">"{testimonial.quote}"</p>
                  <p className="font-semibold text-white">- {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Home Section - Call to Action */}
        <section className="py-20 bg-[#121212] text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif text-white mb-6">Ready to Elevate Your Visual Story?</h2>
            <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto mb-10">
              Let's create stunning imagery that captivates your audience and achieves your vision.
            </p>
            <button
              onClick={() => navigateToSection('contact')}
              className="bg-[#A52A2A] text-white py-4 px-10 rounded-full text-xl font-semibold hover:bg-opacity-80 transition-colors duration-300"
            >
              Get In Touch
            </button>
          </div>
        </section>


        {/* Portfolio Section */}
        <section ref={sectionsRef.portfolio} id="portfolio" className="py-20 bg-[#1E1E1E]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif text-white text-center mb-16">Our Portfolio</h2>

            {/* Gallery Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`py-2 px-6 rounded-full text-lg font-semibold transition-colors duration-300
                    ${filter === cat ? 'bg-[#A52A2A] text-white' : 'bg-[#121212] text-[#B0B0B0] hover:bg-[#A52A2A] hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Image Grid Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((img) => (
                <div key={img.id} className="relative group overflow-hidden rounded-lg shadow-xl cursor-pointer" onClick={() => openLightbox(img)}>
                  <div className={`w-full h-64 ${img.src} flex items-center justify-center text-white text-2xl font-bold`}>
                    <span className="sr-only">Portfolio image: {img.alt}</span>
                    Project {img.id}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                    <p className="text-white text-xl font-semibold mb-2">{img.category.charAt(0).toUpperCase() + img.category.slice(1)}</p>
                    <p className="text-white text-sm">Click to View</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section ref={sectionsRef.about} id="about" className="py-20 bg-[#121212]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-serif text-white text-center mb-16">About John Doe</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="w-full h-96 bg-[#A52A2A] rounded-lg shadow-xl flex items-center justify-center text-white text-3xl font-bold">
                  <span className="sr-only">Portrait of John Doe</span>
                  John Doe
                </div>
              </div>
              <div className="md:order-1">
                <h3 className="text-3xl font-serif text-white mb-6">Photographer Bio</h3>
                <p className="mb-4 text-[#B0B0B0] leading-relaxed">
                  John Doe is an internationally recognized photographer with over 15 years of experience
                  specializing in fine art, commercial, and editorial photography. His distinctive style
                  is characterized by a meticulous eye for detail, dramatic lighting, and a profound
                  ability to capture the essence of his subjects.
                </p>
                <p className="mb-4 text-[#B0B0B0] leading-relaxed">
                  Originally from [City, Country], John's passion for photography began at a young age,
                  leading him to pursue formal training at [University/Academy Name]. He believes in creating
                  timeless images that evoke emotion and tell compelling stories.
                </p>
              </div>
            </div>

            <div className="mt-20">
              <h3 className="text-3xl font-serif text-white mb-6 text-center">Artist Statement</h3>
              <p className="text-xl italic text-center text-[#B0B0B0] leading-relaxed max-w-3xl mx-auto">
                "My photography is an exploration of light, shadow, and the unspoken narratives within.
                I aim to transcend the ordinary, revealing the extraordinary beauty and depth that often
                goes unnoticed. Each photograph is a journey, an invitation to pause, reflect, and connect."
              </p>
            </div>

            <div className="mt-20">
              <h3 className="text-3xl font-serif text-white mb-8 text-center">Awards & Publications</h3>
              <ul className="list-disc list-inside text-lg text-[#B0B0B0] space-y-3 max-w-2xl mx-auto">
                <li>Winner, International Photography Awards (IPA) - Fine Art Category, 2022</li>
                <li>Featured in "Contemporary Photographers Magazine," Issue 45, 2023</li>
                <li>Exhibited at [Gallery Name], [City], 2021</li>
                <li>Recipient of the [Award Name] for Editorial Excellence, 2020</li>
              </ul>
            </div>

            <div className="mt-20 text-center">
              <h3 className="text-3xl font-serif text-white mb-8">Behind the Scenes</h3>
              <p className="text-lg text-[#B0B0B0] max-w-3xl mx-auto">
                A glimpse into the creative process, from conceptualization to the final print.
                I meticulously plan each shoot, paying attention to every detail to ensure a
                flawless execution and a captivating end result. It's a blend of technical
                precision and artistic intuition.
              </p>
              {/* Could add a small grid of abstract "behind the scenes" images here */}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={sectionsRef.services} id="services" className="py-20 bg-[#1E1E1E]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif text-white text-center mb-16">Our Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {['Fine Art Prints', 'Commercial Photography', 'Event Coverage', 'Portrait Sessions', 'Editorial Shoots', 'Consultation & Workshops'].map((service, index) => (
                <div key={index} className="bg-[#121212] p-8 rounded-lg shadow-xl border border-[#1E1E1E] text-center group">
                  <h3 className="text-2xl font-serif text-white mb-4">{service}</h3>
                  <p className="text-lg text-[#B0B0B0] mb-6">
                    {service === 'Fine Art Prints' && 'Museum-quality prints for collectors and enthusiasts.'}
                    {service === 'Commercial Photography' && 'Stunning visuals for brands, products, and advertising.'}
                    {service === 'Event Coverage' && 'Capturing the essence and excitement of your special occasions.'}
                    {service === 'Portrait Sessions' && 'Elegant and personalized portraits that reflect your unique personality.'}
                    {service === 'Editorial Shoots' && 'Compelling imagery for magazines, online publications, and media.'}
                    {service === 'Consultation & Workshops' && 'Share expertise through personalized consultations and immersive workshops.'}
                  </p>
                  <button className="text-[#A52A2A] group-hover:text-white font-semibold transition-colors duration-300">
                    Learn More &rarr;
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <h3 className="text-3xl font-serif text-white mb-8">Custom Project Inquiry</h3>
              <p className="text-lg text-[#B0B0B0] max-w-3xl mx-auto mb-8">
                Have a unique vision? We specialize in tailoring our services to meet bespoke
                project requirements. Reach out to discuss your ideas and get a personalized quote.
              </p>
              <button
                onClick={() => navigateToSection('contact')}
                className="bg-[#A52A2A] text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-opacity-80 transition-colors duration-300"
              >
                Start a Custom Project
              </button>
            </div>

            <div className="mt-20">
              <h3 className="text-3xl font-serif text-white mb-8 text-center">Frequently Asked Questions</h3>
              <div className="max-w-3xl mx-auto space-y-4">
                {[{q: "How do I book a session?", a: "Simply fill out our contact form or give us a call to discuss your needs and schedule a date."}, {q: "What are your pricing structures?", a: "Pricing varies based on the scope and complexity of the project. We offer customized quotes after a brief consultation."}, {q: "Do you travel for assignments?", a: "Yes, we are available for assignments both nationally and internationally. Travel fees may apply."}].map((item, index) => (
                  <details key={index} className="bg-[#121212] p-6 rounded-lg shadow-md border border-[#1E1E1E]">
                    <summary className="text-xl font-semibold text-white cursor-pointer hover:text-[#A52A2A] transition-colors">
                      {item.q}
                    </summary>
                    <p className="mt-4 text-lg text-[#B0B0B0] leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={sectionsRef.contact} id="contact" className="py-20 bg-[#121212]">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-serif text-white text-center mb-16">Get In Touch</h2>

            {/* Contact Form */}
            <form className="bg-[#1E1E1E] p-10 rounded-lg shadow-xl border border-[#1E1E1E]">
              <div className="mb-6">
                <label htmlFor="name" className="block text-white text-lg font-semibold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 bg-[#121212] border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A52A2A] text-white"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-white text-lg font-semibold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 bg-[#121212] border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A52A2A] text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-white text-lg font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full p-3 bg-[#121212] border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A52A2A] text-white"
                  placeholder="Inquiry Subject"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-white text-lg font-semibold mb-2">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full p-3 bg-[#121212] border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A52A2A] text-white"
                  placeholder="Your message or project details..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[#A52A2A] text-white py-3 px-10 rounded-full text-xl font-semibold hover:bg-opacity-80 transition-colors duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>

            <div className="mt-20 text-center">
              <h3 className="text-3xl font-serif text-white mb-8">Studio Location & Hours</h3>
              <p className="text-lg text-[#B0B0B0] mb-4">
                123 Artistry Avenue, Creative City, CA 90210
              </p>
              <p className="text-lg text-[#B0B0B0]">
                Monday - Friday: 9:00 AM - 6:00 PM <br />
                Saturday: By Appointment Only <br />
                Sunday: Closed
              </p>
            </div>

            <div className="mt-20 text-center">
              <h3 className="text-3xl font-serif text-white mb-8">Connect With Us</h3>
              <div className="flex justify-center space-x-6 text-white text-3xl">
                <a href="#" aria-label="Facebook" className="hover:text-[#A52A2A] transition-colors">F</a> {/* Placeholder for icon */}
                <a href="#" aria-label="Instagram" className="hover:text-[#A52A2A] transition-colors">I</a> {/* Placeholder for icon */}
                <a href="#" aria-label="Twitter" className="hover:text-[#A52A2A] transition-colors">T</a> {/* Placeholder for icon */}
                <a href="#" aria-label="LinkedIn" className="hover:text-[#A52A2A] transition-colors">L</a> {/* Placeholder for icon */}
              </div>
            </div>

            <div className="mt-20 text-center">
              <h3 className="text-3xl font-serif text-white mb-8">Direct Contact</h3>
              <p className="text-lg text-[#B0B0B0] mb-2">
                Email: <a href="mailto:info@johndoephoto.com" className="text-white hover:text-[#A52A2A] transition-colors">info@johndoephoto.com</a>
              </p>
              <p className="text-lg text-[#B0B0B0]">
                Phone: <a href="tel:+15551234567" className="text-white hover:text-[#A52A2A] transition-colors">+1 (555) 123-4567</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] py-10 border-t border-[#121212]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-[#B0B0B0] mb-4">&copy; {new Date().getFullYear()} John Doe Photography. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-[#B0B0B0] text-2xl">
            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">F</a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">I</a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">T</a>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxOpen && <Lightbox image={currentImage} onClose={closeLightbox} />}
    </div>
  );
};

export default App;
