/**
 * Pro Golfer — Main JavaScript
 * Handles navigation, product modals, form validation,
 * scroll animations, and back-to-top functionality.
 *
 * @author Development Team
 * @version 1.0
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // NAVBAR — Scroll effect & active link
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  /**
   * Toggle navbar background on scroll
   */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /**
   * Highlight the active nav link based on scroll position
   */
  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    updateActiveLink();
    handleBackToTop();
  }, { passive: true });

  // ============================================
  // MOBILE MENU — Hamburger toggle
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');

  /**
   * Toggle mobile menu open/close
   */
  function toggleMobileMenu() {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ============================================
  // PRODUCT CARDS — Open detail modal
  // ============================================
  const productCards = document.querySelectorAll('.product-card');
  const productDetails = document.querySelectorAll('.product-detail');

  /**
   * Open a product detail modal
   * @param {string} productId - The product identifier
   */
  function openProductDetail(productId) {
    const detail = document.getElementById(`detail-${productId}`);
    if (detail) {
      detail.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Focus the close button for accessibility
      const closeBtn = detail.querySelector('.product-detail__close');
      if (closeBtn) closeBtn.focus();
    }
  }

  /**
   * Close a product detail modal
   * @param {HTMLElement} detail - The detail modal element
   */
  function closeProductDetail(detail) {
    detail.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach click and keyboard events to product cards
  productCards.forEach((card) => {
    const productId = card.getAttribute('data-product');

    card.addEventListener('click', () => openProductDetail(productId));

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProductDetail(productId);
      }
    });
  });

  // Close buttons in modals
  productDetails.forEach((detail) => {
    const closeBtn = detail.querySelector('.product-detail__close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeProductDetail(detail));
    }

    // Close on overlay click
    detail.addEventListener('click', (e) => {
      if (e.target === detail) {
        closeProductDetail(detail);
      }
    });

    // Close on Escape key
    detail.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProductDetail(detail);
      }
    });

    // Inquiry button inside modal — close modal and scroll to contact
    const inquiryBtn = detail.querySelector('.product-detail__inquiry');
    if (inquiryBtn) {
      inquiryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeProductDetail(detail);
        setTimeout(() => {
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    }
  });

  // Also close modals on Escape when focused anywhere
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      productDetails.forEach((detail) => {
        if (detail.classList.contains('active')) {
          closeProductDetail(detail);
        }
      });
    }
  });

  // ============================================
  // CONTACT FORM — Validation
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /**
   * Validate an individual form field
   * @param {HTMLElement} field - The form field to validate
   * @param {string} errorId - The ID of the error message element
   * @param {Function} validationFn - A function that returns true if valid
   * @returns {boolean}
   */
  function validateField(field, errorId, validationFn) {
    const errorEl = document.getElementById(errorId);
    const isValid = validationFn(field.value.trim());

    if (!isValid) {
      field.classList.add('error');
      if (errorEl) errorEl.classList.add('visible');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', errorId);
    } else {
      field.classList.remove('error');
      if (errorEl) errorEl.classList.remove('visible');
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }

    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const inquiryField = document.getElementById('inquiry');
      const messageField = document.getElementById('message');

      const isNameValid = validateField(nameField, 'nameError', (v) => v.length >= 2);
      const isEmailValid = validateField(emailField, 'emailError', (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      );
      const isInquiryValid = validateField(inquiryField, 'inquiryError', (v) => v !== '');
      const isMessageValid = validateField(messageField, 'messageError', (v) => v.length >= 10);

      if (isNameValid && isEmailValid && isInquiryValid && isMessageValid) {
        // Hide form fields and show success message
        const formGroups = contactForm.querySelectorAll('.form__group, .form__row, .form__submit');
        formGroups.forEach((el) => (el.style.display = 'none'));
        formSuccess.classList.add('visible');
      }
    });

    // Real-time validation on blur
    const formFields = contactForm.querySelectorAll('.form__input, .form__select, .form__textarea');
    formFields.forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.value.trim() !== '') {
          const errorId = field.id + 'Error';
          if (field.type === 'email') {
            validateField(field, errorId, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
          } else if (field.tagName === 'SELECT') {
            validateField(field, errorId, (v) => v !== '');
          } else if (field.id === 'message') {
            validateField(field, errorId, (v) => v.length >= 10);
          } else {
            validateField(field, errorId, (v) => v.length >= 2);
          }
        }
      });
    });
  }

  // ============================================
  // SCROLL ANIMATIONS — Intersection Observer
  // ============================================
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    animateElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    animateElements.forEach((el) => el.classList.add('animated'));
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('backToTop');

  /**
   * Show/hide back-to-top button based on scroll position
   */
  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // SMOOTH SCROLL — Offset for sticky nav
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const targetPosition = targetEl.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ============================================
  // INITIALIZE
  // ============================================
  handleNavbarScroll();
  handleBackToTop();
});
