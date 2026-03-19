/* === Ocean City Mansion — Shared Components & Scripts === */

/* ---- Header Component ---- */
function renderHeader() {
  var header = document.getElementById('site-header');
  if (!header) return;
  header.innerHTML = '\
    <div class="header-inner">\
      <nav class="nav-left" aria-label="Main navigation">\
        <div class="nav-dropdown">\
          <button class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">Stay</button>\
          <div class="nav-dropdown-menu" role="menu">\
            <a href="./rooms.html" role="menuitem">Rooms &amp; Suites</a>\
          </div>\
        </div>\
        <a href="./gather.html">Gather</a>\
        <a href="./offers.html">Offers</a>\
        <a href="./blog.html">Blog</a>\
        <a href="./faqs.html">FAQs</a>\
        <a href="./contact.html">Contact</a>\
        <a href="./creators.html">Creators</a>\
      </nav>\
      <div class="logo-center">\
        <a href="./index.html" aria-label="Ocean City Mansion - Home">\
          <span class="logo-text">Ocean City Mansion</span>\
        </a>\
      </div>\
      <div class="nav-right">\
        <a href="./book.html" class="btn-book-header">Book Now</a>\
      </div>\
      <button class="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">\
        <span></span><span></span><span></span>\
      </button>\
    </div>\
  ';

  // Mobile nav
  var mobileNav = document.querySelector('.mobile-nav');
  if (!mobileNav) {
    mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('role', 'navigation');
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    mobileNav.innerHTML = '\
      <a href="./rooms.html">Rooms &amp; Suites</a>\
      <a href="./gather.html">Gather</a>\
      <a href="./offers.html">Offers</a>\
      <a href="./blog.html">Blog</a>\
      <a href="./faqs.html">FAQs</a>\
      <a href="./contact.html">Contact</a>\
      <a href="./creators.html">Creators</a>\
      <a href="./book.html" class="btn-book-mobile">Book Now</a>\
    ';
    header.after(mobileNav);
  }

  // Mobile toggle
  var toggle = header.querySelector('.mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Scroll state
  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    if (scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Dropdown keyboard & hover
  var dropdowns = header.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(function(dd) {
    var trigger = dd.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        var isOpen = dd.classList.toggle('active');
        trigger.setAttribute('aria-expanded', isOpen);
      });
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', function(e) {
    dropdowns.forEach(function(dd) {
      if (!dd.contains(e.target)) {
        dd.classList.remove('active');
        var trig = dd.querySelector('.nav-dropdown-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ---- Footer Component ---- */
function renderFooter() {
  var footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = '\
    <div class="container">\
      <div class="footer-grid">\
        <div class="footer-brand">\
          <div class="logo-text">Ocean City Mansion</div>\
          <p>A 12-room boutique hotel in a restored 1898 Victorian mansion. Steps from the beach and boardwalk in Ocean City, NJ.</p>\
          <div class="footer-social">\
            <a href="https://www.instagram.com/oceancitymansion/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">\
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>\
            </a>\
          </div>\
        </div>\
        <div class="footer-col">\
          <h4>Stay</h4>\
          <a href="./rooms.html">Rooms, Suites &amp; Apartments</a>\
          <a href="./offers.html">Offers</a>\
          <a href="./book.html">Book Now</a>\
        </div>\
        <div class="footer-col">\
          <h4>Explore</h4>\
          <a href="./gather.html">Gather</a>\
          <a href="./blog.html">Blog</a>\
          <a href="./faqs.html">FAQs</a>\
          <a href="./contact.html">Contact</a>\
          <a href="./creators.html">Creators</a>\
          <a href="./privacy.html">Privacy Policy</a>\
          <a href="./terms.html">Terms of Service</a>\
        </div>\
        <div class="footer-col footer-newsletter">\
          <h4>Stay in Touch</h4>\
          <p>Get exclusive offers and Ocean City Mansion updates delivered to your inbox.</p>\
          <form class="footer-newsletter-form" onsubmit="handleNewsletter(event)">\
            <input type="email" placeholder="Email address" required aria-label="Email address">\
            <button type="submit">Join</button>\
          </form>\
          <div style="margin-top: var(--space-8);">\
            <h4>Contact</h4>\
            <a href="tel:6092335447" style="display:block;padding:2px 0">(609) 233-5447</a>\
            <a href="mailto:hello@ocmansion.com" style="display:block;padding:2px 0">hello@ocmansion.com</a>\
            <p style="font-size:var(--text-xs);color:var(--color-gray-500);margin-top:var(--space-2);">416 Central Avenue<br>Ocean City, NJ 08226</p>\
          </div>\
        </div>\
      </div>\
      <div class="footer-bottom">\
        <p>&copy; 2026 Ocean City Mansion. All rights reserved.</p>\
        <div class="footer-bottom-links">\
          <a href="./privacy.html">Privacy</a>\
          <a href="./terms.html">Terms</a>\
          <a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer">Created with Perplexity Computer</a>\
        </div>\
      </div>\
    </div>\
  ';
}

/* ---- Newsletter handler ---- */
function handleNewsletter(e) {
  e.preventDefault();
  var input = e.target.querySelector('input');
  var email = input.value;

  if (typeof klaviyoSubscribe === 'function') {
    klaviyoSubscribe({
      email: email,
      source: 'Footer Newsletter',
      listId: typeof _KLAVIYO_LIST_EMAIL !== 'undefined' ? _KLAVIYO_LIST_EMAIL : 'TE7gJq'
    }).catch(function(err) {
      console.error('Klaviyo newsletter error:', err);
    });
  }

  if (typeof shTrackNewsletterSignup === 'function') shTrackNewsletterSignup();

  input.value = '';
  var btn = e.target.querySelector('button');
  btn.textContent = 'Thanks!';
  setTimeout(function() { btn.textContent = 'Join'; }, 2000);
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  var elems = document.querySelectorAll('.fade-in');
  if (!elems.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elems.forEach(function(el) { observer.observe(el); });
  } else {
    elems.forEach(function(el) { el.classList.add('visible'); });
  }
}

/* ---- FAQ Accordion ---- */
function initFAQ() {
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function(item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', function() {
      var isOpen = item.classList.contains('open');
      items.forEach(function(other) {
        other.classList.remove('open');
        var oq = other.querySelector('.faq-question');
        var oa = other.querySelector('.faq-answer');
        if (oq) oq.setAttribute('aria-expanded', 'false');
        if (oa) oa.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---- Lazy Load ---- */
function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) return;
  var images = document.querySelectorAll('img[loading="lazy"]');
  if (!images.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    images.forEach(function(img) { observer.observe(img); });
  }
}

/* ---- Mews Distributor ---- */
var mewsDistributorApi = null;

function initMewsDistributor() {
  if (typeof Mews === 'undefined' || !Mews.Distributor) return;
  if (window.location.pathname.indexOf('book.html') !== -1) return;

  Mews.Distributor({
    configurationIds: ['02935563-ec28-43c3-af95-aab100b767c5'],
    openElements: '.distributor-open'
  }, function(api) {
    mewsDistributorApi = api;
  });
}

function initBookingBar() {
  var form = document.getElementById('booking-bar-form');
  if (!form) return;

  var today = new Date();
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  var checkinInput = document.getElementById('bb-checkin');
  var checkoutInput = document.getElementById('bb-checkout');

  if (checkinInput) {
    checkinInput.min = formatDateForInput(today);
    checkinInput.value = formatDateForInput(today);
  }
  if (checkoutInput) {
    checkoutInput.min = formatDateForInput(tomorrow);
    checkoutInput.value = formatDateForInput(tomorrow);
  }

  if (checkinInput) {
    checkinInput.addEventListener('change', function() {
      var checkinDate = new Date(checkinInput.value);
      var nextDay = new Date(checkinDate);
      nextDay.setDate(nextDay.getDate() + 1);
      checkoutInput.min = formatDateForInput(nextDay);
      if (new Date(checkoutInput.value) <= checkinDate) {
        checkoutInput.value = formatDateForInput(nextDay);
      }
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (mewsDistributorApi) {
      if (typeof shTrackBookingStarted === 'function') shTrackBookingStarted();
      var checkin = new Date(checkinInput.value);
      var checkout = new Date(checkoutInput.value);
      mewsDistributorApi.setStartDate(checkin);
      mewsDistributorApi.setEndDate(checkout);
      mewsDistributorApi.open();
    }
  });
}

function formatDateForInput(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function initReviewCarousel() {
  var track = document.getElementById('review-carousel-track');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  var dotsContainer = document.getElementById('carousel-dots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  var cards = track.querySelectorAll('.review-card');
  var totalCards = cards.length;
  var currentIndex = 0;
  var autoScrollInterval = null;
  var touchStartX = 0;
  var touchEndX = 0;

  function getVisibleCards() {
    var w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function getDotStep() {
    var w = window.innerWidth;
    if (w <= 600) return 2;
    return getVisibleCards();
  }

  function getMaxIndex() {
    var visible = getVisibleCards();
    return Math.max(0, totalCards - visible);
  }

  function updateCarousel() {
    var visible = getVisibleCards();
    var cardWidth = 100 / visible;
    var offset = -(currentIndex * cardWidth);
    track.style.transform = 'translateX(' + offset + '%)';
    updateDots();
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    var step = getDotStep();
    var dotCount = Math.ceil(totalCards / step);
    for (var i = 0; i < dotCount; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to slide group ' + (i + 1));
      dot.dataset.index = Math.min(i * step, getMaxIndex());
      dot.addEventListener('click', function() {
        currentIndex = Math.min(parseInt(this.dataset.index), getMaxIndex());
        updateCarousel();
        resetAutoScroll();
      });
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    var dots = dotsContainer.querySelectorAll('.carousel-dot');
    var step = getDotStep();
    var activeGroup = Math.floor(currentIndex / step);
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === activeGroup);
    });
  }

  function goNext() {
    var maxIdx = getMaxIndex();
    var visible = getVisibleCards();
    currentIndex += visible;
    if (currentIndex > maxIdx) currentIndex = 0;
    updateCarousel();
  }

  function goPrev() {
    var visible = getVisibleCards();
    currentIndex -= visible;
    if (currentIndex < 0) currentIndex = getMaxIndex();
    updateCarousel();
  }

  function startAutoScroll() { autoScrollInterval = setInterval(goNext, 5000); }
  function resetAutoScroll() { clearInterval(autoScrollInterval); startAutoScroll(); }

  function setCardWidths() {
    var visible = getVisibleCards();
    var gap = 16;
    cards.forEach(function(card) {
      card.style.flex = '0 0 calc(' + (100 / visible) + '% - ' + gap + 'px)';
      card.style.margin = '0 ' + (gap / 2) + 'px';
    });
  }

  prevBtn.addEventListener('click', function() { goPrev(); resetAutoScroll(); });
  nextBtn.addEventListener('click', function() { goNext(); resetAutoScroll(); });

  var carousel = document.getElementById('review-carousel');
  carousel.addEventListener('mouseenter', function() { clearInterval(autoScrollInterval); });
  carousel.addEventListener('mouseleave', function() { startAutoScroll(); });

  carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(autoScrollInterval);
  }, { passive: true });

  carousel.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    startAutoScroll();
  }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      setCardWidths();
      currentIndex = Math.min(currentIndex, getMaxIndex());
      buildDots();
      updateCarousel();
    }, 150);
  });

  setCardWidths();
  buildDots();
  updateCarousel();
  startAutoScroll();
}

function initFloatingOffer() {
  var bar = document.getElementById('floating-offer');
  var closeBtn = document.getElementById('floating-offer-close');
  if (!bar) return;

  if (window.location.pathname.includes('book')) return;
  if (window._ocmOfferDismissed) return;

  var isMobile = window.innerWidth <= 768;

  if (isMobile) {
    var scrollHandler = function () {
      if (window.scrollY > 200) {
        bar.classList.add('visible');
        window.removeEventListener('scroll', scrollHandler);
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  } else {
    setTimeout(function () {
      bar.classList.add('visible');
    }, 1500);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      bar.classList.remove('visible');
      window._ocmOfferDismissed = true;
    });
  }
}

/* ---- Gallery Lightbox ---- */
function initLightbox() {
  var galleryImages = document.querySelectorAll('.image-gallery img');
  if (!galleryImages.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&lsaquo;</button>' +
    '<img class="lightbox-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Gallery image">' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next">&rsaquo;</button>';
  document.body.appendChild(overlay);

  var lightboxImg = overlay.querySelector('.lightbox-img');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var prevBtn = overlay.querySelector('.lightbox-prev');
  var nextBtn = overlay.querySelector('.lightbox-next');
  var currentIdx = 0;
  var images = Array.from(galleryImages);

  function openLightbox(idx) {
    currentIdx = idx;
    lightboxImg.src = images[idx].src;
    lightboxImg.alt = images[idx].alt;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function goNext() {
    currentIdx = (currentIdx + 1) % images.length;
    lightboxImg.src = images[currentIdx].src;
    lightboxImg.alt = images[currentIdx].alt;
  }

  function goPrev() {
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIdx].src;
    lightboxImg.alt = images[currentIdx].alt;
  }

  images.forEach(function(img, idx) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() { openLightbox(idx); });
  });

  closeBtn.addEventListener('click', function(e) { e.stopPropagation(); closeLightbox(); });
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeLightbox(); });
  prevBtn.addEventListener('click', function(e) { e.stopPropagation(); goPrev(); });
  nextBtn.addEventListener('click', function(e) { e.stopPropagation(); goNext(); });

  document.addEventListener('keydown', function(e) {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });
}

/* ---- Mobile Booking Widget ---- */
function initMobileBookingWidget() {
  var widget = document.getElementById('mobile-booking-widget');
  if (!widget) return;

  var arrivalDay = document.getElementById('mbw-arrival-day');
  var arrivalMonth = document.getElementById('mbw-arrival-month');
  var departureDay = document.getElementById('mbw-departure-day');
  var departureMonth = document.getElementById('mbw-departure-month');

  var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  var today = new Date();
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (arrivalDay) arrivalDay.textContent = today.getDate();
  if (arrivalMonth) arrivalMonth.textContent = months[today.getMonth()];
  if (departureDay) departureDay.textContent = tomorrow.getDate();
  if (departureMonth) departureMonth.textContent = months[tomorrow.getMonth()];
}

/* ---- Room Category Tabs ---- */
function initRoomTabs() {
  var tabsContainer = document.getElementById('room-tabs');
  if (!tabsContainer) return;

  var tabs = tabsContainer.querySelectorAll('.room-tab');
  var panels = document.querySelectorAll('.room-tab-panel');

  function activateTab(tab) {
    var target = tab.getAttribute('data-tab');

    tabs.forEach(function(t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    panels.forEach(function(p) { p.classList.remove('active'); });
    var activePanel = document.getElementById('panel-' + target);
    if (activePanel) activePanel.classList.add('active');

    initRoomScrollDots();

    if (activePanel) {
      var fadeEls = activePanel.querySelectorAll('.fade-in:not(.visible)');
      fadeEls.forEach(function(el) { el.classList.add('visible'); });
    }
  }

  tabs.forEach(function(tab, index) {
    tab.addEventListener('click', function() { activateTab(tab); });

    tab.addEventListener('keydown', function(e) {
      var tabArr = Array.prototype.slice.call(tabs);
      var dir = 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') dir = 1;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') dir = -1;
      if (dir !== 0) {
        e.preventDefault();
        var next = (index + dir + tabArr.length) % tabArr.length;
        activateTab(tabArr[next]);
      }
      if (e.key === 'Home') { e.preventDefault(); activateTab(tabArr[0]); }
      if (e.key === 'End') { e.preventDefault(); activateTab(tabArr[tabArr.length - 1]); }
    });
  });

  tabs.forEach(function(t) {
    t.setAttribute('tabindex', t.classList.contains('active') ? '0' : '-1');
  });
}

/* ---- Room Scroll Indicator ---- */
function initRoomScrollDots() {
  var activePanel = document.querySelector('.room-tab-panel.active');
  if (!activePanel) return;

  var scrollContainer = activePanel.querySelector('.room-scroll-mobile');
  var dotsContainer = activePanel.querySelector('.scroll-indicator');
  if (!scrollContainer || !dotsContainer) return;

  var dots = dotsContainer.querySelectorAll('.scroll-indicator-dot');
  if (!dots.length) return;

  scrollContainer.scrollLeft = 0;
  dots.forEach(function(dot, i) {
    dot.classList.toggle('active', i === 0);
  });

  if (scrollContainer._scrollHandler) {
    scrollContainer.removeEventListener('scroll', scrollContainer._scrollHandler);
  }

  var handler = function() {
    var scrollLeft = scrollContainer.scrollLeft;
    var scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    if (scrollWidth <= 0) return;
    var progress = scrollLeft / scrollWidth;
    var activeIndex = Math.round(progress * (dots.length - 1));
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === activeIndex);
    });
  };

  scrollContainer._scrollHandler = handler;
  scrollContainer.addEventListener('scroll', handler, { passive: true });
}

/* ---- Interstitial Modal ---- */
function initInterstitialModal() {
  var modal = document.getElementById('interstitial-modal');
  if (!modal) return;

  // Check if already shown this session
  if (window._ocmModalShown) return;

  var isMobile = window.innerWidth <= 768;

  function showModal() {
    if (window._ocmModalShown) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    window._ocmModalShown = true;
  }

  if (isMobile) {
    var scrollHandler = function() {
      if (window.scrollY > 200) {
        showModal();
        window.removeEventListener('scroll', scrollHandler);
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  } else {
    setTimeout(showModal, 5000);
  }

  // Close handlers
  var closeBtn = modal.querySelector('.modal-close');
  var skipBtn = modal.querySelector('.modal-skip');

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (skipBtn) skipBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  // Form submission
  var form = modal.querySelector('.modal-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var firstName = form.querySelector('[name="first_name"]');
      var email = form.querySelector('[name="email"]');
      var consent = form.querySelector('[name="consent"]');

      if (!consent || !consent.checked) {
        consent.parentElement.style.color = 'var(--color-blush-dark)';
        return;
      }

      // Subscribe to Klaviyo
      if (typeof klaviyoSubscribe === 'function') {
        klaviyoSubscribe({
          email: email.value,
          firstName: firstName ? firstName.value : '',
          source: 'Grand Opening Modal',
          listId: 'TE7gJq'
        }).catch(function(err) {
          console.error('Klaviyo modal error:', err);
        });
      }

      // Show success
      var formWrapper = modal.querySelector('.modal-form-wrapper');
      var successBlock = modal.querySelector('.modal-success');
      if (formWrapper) formWrapper.classList.add('hidden');
      if (successBlock) successBlock.classList.add('active');

      setTimeout(closeModal, 3000);
    });
  }
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  renderFooter();
  initScrollReveal();
  initFAQ();
  initLazyLoad();
  initMewsDistributor();
  initBookingBar();
  initReviewCarousel();
  initFloatingOffer();
  initRoomTabs();
  initRoomScrollDots();
  initLightbox();
  initMobileBookingWidget();
  initInterstitialModal();
});
