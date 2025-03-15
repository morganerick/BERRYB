// Styles configuration
const styles = {
  heroSection: {
    background: 'linear-gradient(to right, #b31217, #6f0f96)',
    color: '#fff',
    padding: '60px 20px'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: 'auto'
  },
  listItem: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  listItemHover: {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  listItemActive: {
    transform: 'translateY(0)'
  }
};

// Apply styles programmatically
function applyStyles() {
  // Hero section styling
  const heroSection = document.querySelector('.hero-section');
  Object.assign(heroSection.style, styles.heroSection);

  // Container styling
  const container = document.querySelector('.container');
  Object.assign(container.style, styles.container);

  // List items styling and interactions
  const listItems = document.querySelectorAll('.hero-right li');
  listItems.forEach(item => {
    // Apply base styles
    Object.assign(item.style, styles.listItem);

    // Add hover effect
    item.addEventListener('mouseenter', () => {
      Object.assign(item.style, styles.listItemHover);
    });

    item.addEventListener('mouseleave', () => {
      Object.assign(item.style, styles.listItem);
    });

    // Add click effect
    item.addEventListener('mousedown', () => {
      Object.assign(item.style, styles.listItemActive);
    });

    item.addEventListener('mouseup', () => {
      Object.assign(item.style, styles.listItemHover);
    });
  });
}

// Handle responsive design
function handleResponsive() {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  function updateStyles(e) {
    const listItems = document.querySelectorAll('.hero-right li');
    const heroRight = document.querySelector('.hero-right');
    
    if (e.matches) {
      // Mobile styles
      listItems.forEach(item => {
        item.style.padding = '15px';
        item.style.textAlign = 'center';
      });
      
      heroRight.style.marginTop = '30px';
      heroRight.style.width = '100%';
    } else {
      // Desktop styles
      listItems.forEach(item => {
        item.style.padding = '20px';
        item.style.textAlign = 'left';
      });
      
      heroRight.style.marginTop = '0';
      heroRight.style.width = 'auto';
    }
  }

  // Initial check
  updateStyles(mediaQuery);
  
  // Add listener for viewport changes
  mediaQuery.addListener(updateStyles);
}

// Lazy loading implementation
function initializeLazyLoading() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.tagName === 'IMG') {
          el.src = el.dataset.src;
        }
        el.classList.add('loaded');
        obs.unobserve(el);
      }
    });
  }, options);

  const lazyElements = document.querySelectorAll('.lazy');
  lazyElements.forEach(el => observer.observe(el));
}

// Form handling
function initializeFormHandling() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Simple validation
      if (form.classList.contains('contact-form')) {
        if (!data.fullname || !data.email || !data.message) {
          alert('Please fill in all fields');
          return;
        }
      }
      
      // Here you would typically send the data to a server
      console.log('Form submitted:', data);
      form.reset();
    });
  });
}

// Add feature circle animation and drag functionality
function initializeFeatures() {
  const features = document.querySelectorAll('.feature');
  let draggedFeature = null;
  let initialX = 0;
  let initialY = 0;
  let currentX = 0;
  let currentY = 0;

  features.forEach(feature => {
    // Initial random position animation
    feature.style.transform = 'scale(0)';
    setTimeout(() => {
      feature.style.transform = 'scale(1)';
    }, Math.random() * 500);

    // Floating animation
    setInterval(() => {
      if (!feature.classList.contains('dragging')) {
        feature.style.transform = `translate(${Math.sin(Date.now() / 1000) * 5}px, ${Math.cos(Date.now() / 1000) * 5}px)`;
      }
    }, 50);

    // Drag start
    feature.addEventListener('dragstart', (e) => {
      draggedFeature = feature;
      feature.classList.add('dragging');
      
      // Store initial position
      const rect = feature.getBoundingClientRect();
      initialX = e.clientX - rect.left;
      initialY = e.clientY - rect.top;
      
      // Set drag image (optional)
      const dragImage = feature.cloneNode(true);
      dragImage.style.opacity = '0';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, initialX, initialY);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    });

    // Drag end
    feature.addEventListener('dragend', () => {
      feature.classList.remove('dragging');
      draggedFeature = null;
    });
  });

  // Handle drag over container
  const container = document.querySelector('.features');
  
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (draggedFeature) {
      // Calculate new position
      currentX = e.clientX - initialX - container.getBoundingClientRect().left;
      currentY = e.clientY - initialY - container.getBoundingClientRect().top;
      
      // Keep within container bounds
      const containerRect = container.getBoundingClientRect();
      const featureRect = draggedFeature.getBoundingClientRect();
      
      currentX = Math.max(0, Math.min(currentX, containerRect.width - featureRect.width));
      currentY = Math.max(0, Math.min(currentY, containerRect.height - featureRect.height));
      
      // Apply new position
      draggedFeature.style.position = 'absolute';
      draggedFeature.style.left = `${currentX}px`;
      draggedFeature.style.top = `${currentY}px`;
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  applyStyles();
  handleResponsive();
  initializeLazyLoading();
  initializeFormHandling();
  initializeFeatures();
});