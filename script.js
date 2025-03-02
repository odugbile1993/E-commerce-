document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // Registration Logic
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const accountType = document.getElementById("accountType").value;
            const formData = new FormData(registerForm);

            // Seller-specific validation
            if (accountType === "seller") {
                const passportPhoto = document.getElementById("passportPhoto").files[0];
                const itemImages = document.getElementById("itemImages").files;

                if (!passportPhoto || itemImages.length === 0) {
                    alert("Please upload all required images for seller registration.");
                    return;
                }

                formData.append("passportPhoto", passportPhoto);
                for (let i = 0; i < itemImages.length; i++) {
                    formData.append("itemImages", itemImages[i]);
                }
            }

            try {
                const response = await fetch("/register", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(`Registration failed: ${data.message}`);
                    return;
                }

                alert("Registration successful! Please log in.");
                window.location.href = "/login";
            } catch (error) {
                console.error("Registration error:", error);
                alert("An error occurred during registration. Please try again.");
            }
        });
    }

    // Login Logic
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(`Login failed: ${data.message}`);
                    return;
                }

                localStorage.setItem("token", data.token);
                alert("Login successful!");
                window.location.href = "/dashboard";
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred during login. Please try again.");
            }
        });
    }
});
