function onTurnstileSuccess(token) {
    console.log("Turnstile sukses!");
    console.log("Token:", token);

    let expiry = new Date();
    expiry.setTime(expiry.getTime() + 60 * 1000);

    document.cookie =
        "full_screen_verified=true; expires=" +
        expiry.toUTCString() +
        "; path=/; SameSite=Lax";

    console.log("Cookie setelah set:", document.cookie);

    // window.location.replace("/");
}

window.onTurnstileSuccess = onTurnstileSuccess;