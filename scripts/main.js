// Mobile menu toggle
const mobileMenuButton = document.querySelector("#mobile-menu-button");
const mobileMenu = document.querySelector("#mobile-menu");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });
}

// FAQ toggle (new selectors)
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.closest(".faq-item");
    const isOpen = faqItem.classList.contains("open");
    // بستن همه
    document
      .querySelectorAll(".faq-item")
      .forEach((item) => item.classList.remove("open"));
    // باز کردن فعلی اگر بسته بود
    if (!isOpen) {
      faqItem.classList.add("open");
    }
  });
});

// Screenshot carousel navigation
const carousel = document.querySelector(".screenshot-carousel");
const prevButton = document.querySelector(".screenshot-nav-btn-prev");
const nextButton = document.querySelector(".screenshot-nav-btn-next");
const screenshots = document.querySelectorAll(".screenshot-item");

let currentIndex = 0;

if (carousel && prevButton && nextButton && screenshots.length > 0) {
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });
  nextButton.addEventListener("click", () => {
    if (currentIndex < screenshots.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });
  let updateCarousel = () => {
    const itemWidth = screenshots[0].offsetWidth;
    carousel.scrollTo({
      left: currentIndex * itemWidth,
      behavior: "smooth",
    });
  }
}

// Contact form submission (new selectors)
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
    // Validate form (simple validation)
    if (!name || !email || !subject || !message) {
      alert("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }
    // In a real application, you would send this data to a server
    // For demo purposes, we'll just show a success message
    alert("پیام شما با موفقیت ارسال شد. با تشکر از تماس شما!");
    contactForm.reset();
  });
}

// Video iframe management
document.addEventListener("DOMContentLoaded", function () {
  const videoContainer = document.querySelector(".hero-video-container");
  const videoIframe = document.querySelector(".hero-video-iframe");
  const videoFallback = document.querySelector(".video-fallback");

  if (videoIframe && videoFallback) {
    // Show fallback initially
    videoFallback.style.display = "flex";

    // Set a timeout to show fallback if iframe doesn't load
    const fallbackTimeout = setTimeout(() => {
      if (videoFallback) {
        videoFallback.style.display = "flex";
      }
    }, 5000); // 5 seconds timeout

    // Hide fallback when iframe loads
    videoIframe.addEventListener("load", function () {
      clearTimeout(fallbackTimeout);
      if (videoFallback) {
        videoFallback.style.display = "none";
      }
    });

    // Handle iframe error
    videoIframe.addEventListener("error", function () {
      clearTimeout(fallbackTimeout);
      if (videoFallback) {
        videoFallback.style.display = "flex";
        const placeholder = videoFallback.querySelector(".video-placeholder p");
        if (placeholder) {
          placeholder.textContent = "خطا در بارگذاری ویدئو";
        }
      }
    });
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains("show")) {
        mobileMenu.classList.remove("show");
      }
    }
  });
});

// Hide scrollbar but keep functionality
document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
`
);

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'96001cff474bdc9a',t:'MTc1MjY1NDM3MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
