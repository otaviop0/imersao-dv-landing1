// Mobile Navigation Toggle
const mobileMenu = document.getElementById("mobile-menu")
const navMenu = document.getElementById("nav-menu")

mobileMenu.addEventListener("click", () => {
  mobileMenu.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Navbar scroll effect
const navbar = document.getElementById("navbar")
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Schedule tabs functionality
const tabButtons = document.querySelectorAll(".tab-button")
const daySchedules = document.querySelectorAll(".day-schedule")

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all tabs and schedules
    tabButtons.forEach((tab) => tab.classList.remove("active"))
    daySchedules.forEach((schedule) => schedule.classList.remove("active"))

    // Add active class to clicked tab
    button.classList.add("active")

    // Show corresponding schedule
    const targetDay = button.getAttribute("data-day")
    document.getElementById(targetDay).classList.add("active")
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 80 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated")
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".feature-card, .speaker-card, .timeline-item").forEach((el) => {
  el.classList.add("animate-on-scroll")
  observer.observe(el)
})

// Counter animation for stats
const animateCounters = () => {
  const counters = document.querySelectorAll(".stat-number")

  counters.forEach((counter) => {
    const target = Number.parseInt(counter.textContent.replace(/\D/g, ""))
    const duration = 2000 // 2 seconds
    const step = target / (duration / 16) // 60fps
    let current = 0

    const updateCounter = () => {
      current += step
      if (current < target) {
        counter.textContent = Math.floor(current) + counter.textContent.replace(/\d/g, "").replace(/\+/g, "")
        if (counter.textContent.includes("+")) {
          counter.textContent = Math.floor(current) + "+"
        } else if (counter.textContent.includes("h")) {
          counter.textContent = Math.floor(current) + "h"
        }
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = counter.textContent // Reset to original
      }
    }

    updateCounter()
  })
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters()
        heroObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 },
)

const heroSection = document.querySelector(".hero")
if (heroSection) {
  heroObserver.observe(heroSection)
}

// Form validation and submission (if you add a contact form later)
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// CTA button interactions
document.querySelectorAll(".btn-primary, .btn-secondary").forEach((button) => {
  button.addEventListener("click", (e) => {
    // Add ripple effect
    const ripple = document.createElement("span")
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
})

// Add ripple effect styles
const style = document.createElement("style")
style.textContent = `
    .btn-primary, .btn-secondary {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.remove("lazy")
      imageObserver.unobserve(img)
    }
  })
})

document.querySelectorAll("img[data-src]").forEach((img) => {
  imageObserver.observe(img)
})

// Performance optimization: Debounce scroll events
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Optimized scroll handler
const handleScroll = debounce(() => {
  // Any additional scroll-based functionality can go here
}, 10)

window.addEventListener("scroll", handleScroll)

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle")
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")

// Function to set theme
const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme)
  localStorage.setItem("theme", theme)

  // Update button icons
  const moonIcon = themeToggle.querySelector(".fa-moon")
  const sunIcon = themeToggle.querySelector(".fa-sun")

  if (theme === "dark") {
    moonIcon.style.display = "none"
    sunIcon.style.display = "inline-block"
  } else {
    moonIcon.style.display = "inline-block"
    sunIcon.style.display = "none"
  }
}

// Check for saved theme preference or use device preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme) {
  setTheme(savedTheme)
} else {
  setTheme(prefersDarkScheme.matches ? "dark" : "light")
}

// Toggle theme when button is clicked
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light"
  setTheme(currentTheme === "light" ? "dark" : "light")
})

// Listen for changes in system preference
prefersDarkScheme.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    setTheme(e.matches ? "dark" : "light")
  }
})

// Initialize theme toggle button state
window.addEventListener("DOMContentLoaded", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light"
  const moonIcon = themeToggle.querySelector(".fa-moon")
  const sunIcon = themeToggle.querySelector(".fa-sun")

  if (currentTheme === "dark") {
    moonIcon.style.display = "none"
    sunIcon.style.display = "inline-block"
  } else {
    moonIcon.style.display = "inline-block"
    sunIcon.style.display = "none"
  }
})
