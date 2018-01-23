/**
 * Send Page View if ga is availible in window
 */
export default function gaSend() {
    if (typeof window !== 'undefined' && window.ga) {
        window.ga('send', 'pageview');
    }
}