function onTurnstileSuccess(token) {
    let expiry = new Date();
    expiry.setTime(expiry.getTime() + (20 * 60 * 1000));
    
    document.cookie = "full_screen_verified=true; expires=" + expiry.toUTCString() + "; path=/; samesite=strict";
    window.location.replace('/');
}
window.onTurnstileSuccess = onTurnstileSuccess;