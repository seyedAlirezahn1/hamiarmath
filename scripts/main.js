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
var currentIndex = 1;

function displaySlide(n) {
  currentIndex = n;
  var slides = document.getElementsByClassName("slide");
  var dots = document.getElementsByClassName("dot");
  var slno = document.getElementById("slide-no");

  if (currentIndex > slides.length) {
    currentIndex = 1;
  }
  if (currentIndex < 1) {
    currentIndex = slides.length;
  }
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[currentIndex - 1].style.display = "block";
  dots[currentIndex - 1].className = "dot active";
  slno.innerHTML = currentIndex + "/" + slides.length;
}

displaySlide(currentIndex);

function changeSlide(n) {
  currentIndex += n;
  displaySlide(currentIndex);
}

function currentSlide(n) {
  displaySlide(n);
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


//skjd

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

//contact-form
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.className = "";
  toast.innerText = message;
  toast.classList.add("show");
  toast.classList.add(type);

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// تابع Escape برای MarkdownV2 تلگرام
function escapeMarkdownV2(text) {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

document
  .getElementById("contact-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = String(document.getElementById("name").value || "");
    const email = String(document.getElementById("email").value || "");
    const subject = String(document.getElementById("subject").value || "");
    const message = String(document.getElementById("message").value || "");

    if (!message) {
      showToast("پیام نمی‌تواند خالی باشد!", "error");
      return;
    }

    // فقط متن Escape شده، هیچ JSON اضافی
    const textMessage = escapeMarkdownV2(
      `نام: ${name}\nایمیل: ${email}\nموضوع: ${subject}\nپیام: ${message}`
    );

    try {
      await fetch(
        "https://cloud.activepieces.com/api/v1/webhooks/hNVNCWytQ2DZkGKa0kOA6",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // فقط فیلد text ساده را بفرستید
          body: JSON.stringify({ text: textMessage }),
        }
      );

      showToast("✅ پیام شما با موفقیت ارسال شد!", "success");
      document.getElementById("contact-form").reset();
    } catch (err) {
      showToast("❌ ارتباط با سرور برقرار نشد!", "error");
    }
  });
