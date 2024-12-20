document.addEventListener("DOMContentLoaded", function () {
    // Handle account type selection
    const accountTypeSelector = document.getElementById("accountType");
    const sellerFields = document.getElementById("seller-fields");

    // Toggle seller-specific fields based on account type selection
    accountTypeSelector.addEventListener("change", function () {
        if (this.value === "seller") {
            sellerFields.style.display = "block"; // Show seller-specific fields
        } else {
            sellerFields.style.display = "none"; // Hide seller-specific fields
        }
    });

    // Handle form submission
    const form = document.getElementById("registration-form");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent form submission for testing

        // Collect form data
        const accountType = accountTypeSelector.value;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value;

        let businessDescription = "";
        let bankName = "";
        let accountNumber = "";

        if (accountType === "seller") {
            businessDescription = document.getElementById("businessDescription").value;
            bankName = document.getElementById("bankName").value;
            accountNumber = document.getElementById("accountNumber").value;
        }

        // Check if required fields are filled
        if (!name || !email || !password || !phone || (accountType === "seller" && (!businessDescription || !bankName || !accountNumber))) {
            alert("Please fill out all required fields.");
            return;
        }

        // Save user data in localStorage (for simplicity, you can replace this with backend later)
        const user = {
            accountType,
            name,
            email,
            password,
            phone,
            businessDescription,
            bankName,
            accountNumber
        };

        localStorage.setItem("user", JSON.stringify(user));

        // Show success message and redirect
        alert("Registration Successful! You can now log in.");
        window.location.href = "login.html"; // Redirect to login page
    });
});
