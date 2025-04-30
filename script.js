// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      window.scrollTo({
        top: targetSection.offsetTop - 70,
        behavior: "smooth",
      });
    });
  });

  // Call-to-action button click event
  const ctaButton = document.getElementById("cta-button");

  ctaButton.addEventListener("click", function () {
    const aboutSection = document.querySelector("#about");

    window.scrollTo({
      top: aboutSection.offsetTop - 70,
      behavior: "smooth",
    });
  });

  // Form submission handling
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Simple validation
    if (name && email && message) {
      // In a real application, you would send this data to a server
      console.log("Form submitted:", { name, email, message });

      // Show success message
      alert("Thank you for your message! We will get back to you soon.");

      // Reset form
      contactForm.reset();
    } else {
      alert("Please fill in all fields.");
    }
  });

  // Image lazy loading
  const galleryImages = document.querySelectorAll(".gallery-item img");

  // Create an intersection observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute("src");

        // Add a class that triggers a fade-in animation
        img.classList.add("fade-in");

        // Stop observing the image
        observer.unobserve(img);
      }
    });
  });

  // Observe each gallery image
  galleryImages.forEach((img) => {
    imageObserver.observe(img);
  });

  // Add a scroll-based animation for sections
  const sections = document.querySelectorAll("section");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Mobile navigation toggle (for smaller screens)
  // You would need to add a mobile menu button in your HTML
  const mobileMenuButton = document.createElement("button");
  mobileMenuButton.classList.add("mobile-menu-button");
  mobileMenuButton.innerHTML = "☰";

  const nav = document.querySelector("nav");
  nav.appendChild(mobileMenuButton);

  mobileMenuButton.addEventListener("click", function () {
    const navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("active");
  });

  // Detect if user is on a mobile device and add a class to the body
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    document.body.classList.add("mobile-device");
  }

  // Add some dynamic copyright year
  const currentYear = new Date().getFullYear();
  const copyrightElement = document.querySelector(".footer-bottom p");
  copyrightElement.textContent = `© ${currentYear} My Website. All rights reserved.`;
});

// Add some animations with CSS classes
const addAnimationCSS = () => {
  const style = document.createElement("style");
  style.textContent = `
        .fade-in {
            animation: fadeIn 0.5s ease-in forwards;
        }
        
        section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            .mobile-menu-button {
                display: block;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .nav-links {
                position: absolute;
                top: 60px;
                left: 0;
                right: 0;
                background-color: #fff;
                flex-direction: column;
                align-items: center;
                padding: 20px 0;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
                transform: translateY(-150%);
                transition: transform 0.3s ease;
            }
            
            .nav-links.active {
                transform: translateY(0);
            }
            
            .nav-links li {
                margin: 10px 0;
            }
        }
        
        @media (min-width: 769px) {
            .mobile-menu-button {
                display: none;
            }
        }
    `;
  document.head.appendChild(style);
};

// Call the function to add animation CSS
addAnimationCSS();
