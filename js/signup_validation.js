export const validateForm = (formData) => {
    const errors = [];

        // Name validation
    if (formData.firstName.length < 2) {
        errors.push("First name must be at least 2 characters long");
    }
    if (formData.lastName.length < 2) {
        errors.push("Last name must be at least 2 characters long");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push("Please enter a valid email address");
    }


    // Password validation
    if (formData.password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    if (!/[a-z]/.test(formData.password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(formData.password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/\d/.test(formData.password)) {
        errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
        errors.push("Password must contain at least one special character");
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
        errors.push("Please enter a valid phone number");
    }

    // Birth date validation
    const birthDate = new Date(formData.birthDate);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
        errors.push("Please enter a valid birth date");
    } else if (birthDate > today) {
        errors.push("Birth date cannot be in the future");
    }
    return errors;
};
