// Handle role selection (Buyer/Seller)
document.getElementById('accountType').addEventListener('change', function() {
    const accountType = this.value;
    const sellerFields = document.getElementById('seller-fields');
    if (accountType === 'seller') {
        sellerFields.style.display = 'block'; // Show seller fields
    } else {
        sellerFields.style.display = 'none';  // Hide seller fields
    }
});

// Handle form submission
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const accountType = document.getElementById('accountType').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;

    // Handle seller-specific fields
    let businessDescription = '';
    let bankName = '';
    let accountNumber = '';
    let passportPhoto = '';
    let itemImages = [];

    if (accountType === 'seller') {
        businessDescription = document.getElementById('businessDescription').value;
        bankName = document.getElementById('bankName').value;
        accountNumber = document.getElementById('accountNumber').value;
        passportPhoto = document.getElementById('passportPhoto').files[0];
        itemImages = document.getElementById('itemImages').files;
    }

    // Form data to be sent to the server
    const formData = new FormData();
    formData.append('accountType', accountType);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phone);

    if (accountType === 'seller') {
        formData.append('businessDescription', businessDescription);
        formData.append('bankName', bankName);
        formData.append('accountNumber', accountNumber);
        formData.append('passportPhoto', passportPhoto);
        for (let i = 0; i < itemImages.length; i++) {
            formData.append('itemImages', itemImages[i]);
        }
    }

    // Send form data to the server
    fetch('YOUR_API_URL/register', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
            window.location.href = 'login.html'; // Redirect to login after successful registration
        } else {
            alert('Registration failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration.');
    });
});
