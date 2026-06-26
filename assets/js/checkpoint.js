function onTurnstileSuccess(token) {
    let expiry = new Date();
    expiry.setTime(expiry.getTime() + (1 * 60 * 60 * 1000));
    document.cookie = "full_screen_verified=true; expires=" + expiry.toUTCString() + "; path=/; secure; samesite=strict";

    const originUrl = new URLSearchParams(window.location.search).get('from') || '/';
    window.location.href = originUrl;
}