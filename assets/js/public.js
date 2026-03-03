document.addEventListener('DOMContentLoaded', function () {

    // Find all video facades on the page
    const facades = document.querySelectorAll('.tubebay-video-facade');

    facades.forEach(function (facade) {
        facade.addEventListener('click', function (e) {

            // Stop WooCommerce from trying to open the image Lightbox
            e.preventDefault();
            e.stopPropagation();

            // Get the YouTube Video ID
            const videoId = this.getAttribute('data-video-id');
            if (!videoId) return;

            // Create the iframe
            const iframe = document.createElement('iframe');
            // autoplay=1 makes it play immediately when clicked
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');

            // Ensure the iframe fills our 16:9 container exactly
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            // Clear the image and play button, and inject the iframe
            this.innerHTML = '';
            this.appendChild(iframe);

            // Remove the pointer cursor since it's now an active player
            this.style.cursor = 'default';
        });
    });

});
