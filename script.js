// UniHub Project Script (Improved & Centralized)
// Features: Login, Register, Logout, Dashboard, Form Validation,
// Password Strength Indicator, and Service Forms

document.addEventListener("DOMContentLoaded", () => {
  // Centralized showMessage()

  function showMessage(targetForm, msg, type = "error") {
    
    // Remove existing message inside the same form
    const oldMsg = targetForm.querySelector(".form-message");
    if (oldMsg) oldMsg.remove();

    const message = document.createElement("p");
    message.classList.add("form-message", type);
    message.textContent = msg;
    targetForm.appendChild(message);
  }


  // LOGIN PAGE

  const loginForm = document.querySelector("#loginForm");

  if (loginForm) {
    const passwordInput = loginForm.querySelector("#password");

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = loginForm.querySelector("#email").value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        showMessage(loginForm, "⚠️ Please fill in all fields.");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("registeredUser"));
      if (!userData) {
        showMessage(loginForm, "❌ No account found. Please register first.");
        return;
      }

      if (email === userData.email && password === userData.password) {
        localStorage.setItem("loggedUser", userData.name);
        showMessage(loginForm, "✅ Login successful!", "success");
        setTimeout(() => (window.location.href = "dashboard.html"), 1000);
      } else {
        showMessage(loginForm, "❌ Incorrect email or password.");
      }
    });
  }

  
  // REGISTER PAGE

  const registerForm = document.querySelector("#registerForm");

  if (registerForm) {
    const passwordInput = registerForm.querySelector("#password");
    const confirmPasswordInput = registerForm.querySelector("#confirmPassword");

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = registerForm.querySelector("#fullname").value.trim();
      const email = registerForm.querySelector("#email").value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (!name || !email || !password || !confirmPassword) {
        showMessage(registerForm, "⚠️ Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        showMessage(registerForm, "❌ Passwords do not match!");
        return;
      }

      const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

      if (!strongPassword.test(password)) {
        showMessage(
          registerForm,
          "🔒 Password must include an uppercase letter, number, and special character (!@#$%^&*)."
        );
        return;
      }

      const userData = { name, email, password };
      localStorage.setItem("registeredUser", JSON.stringify(userData));

      showMessage(registerForm, "✅ Account created successfully!", "success");
      setTimeout(() => (window.location.href = "login.html"), 1200);
    });


    // PASSWORD STRENGTH INDICATOR (Register Page Only)

    const strengthBar = registerForm.querySelector(".strength-bar");
    const strengthText = registerForm.querySelector(".strength-text");

    if (passwordInput && strengthBar && strengthText) {
      passwordInput.addEventListener("input", () => {
        const value = passwordInput.value;
        let strength = 0;

        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[!@#$%^&*]/.test(value)) strength++;

        if (strength === 0) {
          strengthBar.style.width = "0%";
          strengthBar.style.backgroundColor = "#e0e0e0";
          strengthText.textContent = "Enter a password";
        } else if (strength === 1) {
          strengthBar.style.width = "33%";
          strengthBar.style.backgroundColor = "#e74c3c";
          strengthText.textContent = "Weak password";
        } else if (strength === 2 || strength === 3) {
          strengthBar.style.width = "66%";
          strengthBar.style.backgroundColor = "#f1c40f";
          strengthText.textContent = "Medium strength";
        } else if (strength === 4) {
          strengthBar.style.width = "100%";
          strengthBar.style.backgroundColor = "#2ecc71";
          strengthText.textContent = "Strong password 💪";
        }
      });
    }
  }


  // DASHBOARD PAGE

  const userName = document.querySelector("#userName");
  if (userName) {
    const loggedUser = localStorage.getItem("loggedUser");
    if (loggedUser) {
      userName.textContent = loggedUser;
    } else {
      window.location.href = "login.html";
    }
  }

  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      window.location.href = "index.html";
    });
  }

  
  // SERVICE FORMS (Presentation / Translation / Programming)

  const serviceForms = document.querySelectorAll("form[id$='Form']");

  serviceForms.forEach((form) => {
    const msgBox = document.querySelector("#formMessage");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll("input[required], textarea[required]");
      let allFilled = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) allFilled = false;
      });

      msgBox.innerHTML = "";

      if (!allFilled) {
        msgBox.innerHTML =
          "<p class='form-message error'>⚠️ Please fill in all required fields.</p>";
        return;
      }

      msgBox.innerHTML =
        "<p class='form-message success'>✅ Your request has been submitted successfully!</p>";
      form.reset();
    });
  });
});
