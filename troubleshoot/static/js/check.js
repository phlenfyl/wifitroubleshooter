async function pingServer() {
    try {
        const response = await fetch("https://www.google.com/favicon.ico", { mode: 'no-cors' }); // Replace with a reliable server
        if ( response.ok) {
            console.log('yes')
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

if (navigator.onLine || pingServer() === true) {
    // Internet connection available
    const script = document.createElement('script');
    script.src = "{% static 'js/backend.js' %}";
    document.body.appendChild(script);
} else {
    // No internet connection
    const script = document.createElement('script');
    script.src = "{% static 'js/serviceworker.js' %}";
    document.body.appendChild(script);
}

window.addEventListener("DOMContentLoaded", () => {
    setInterval(pingServer, 5000);
})