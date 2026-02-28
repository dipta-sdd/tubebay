jQuery(document).ready(function ($) {
    var modal = $('#tubebay-video-modal');
    var selectBtn = $('#tubebay_select_video_btn');
    var editBtn = $('#tubebay_edit_video_btn');
    var removeBtn = $('#tubebay_remove_video_btn');
    var closeModal = $('.tubebay-modal-close');
    var overlay = $('.tubebay-modal-overlay');

    var videoGrid = $('#tubebay-modal-video-grid');
    var isLoaded = false;

    // Show Modal
    function openModal() {
        modal.show();
        if (!isLoaded) {
            fetchVideos();
        }
    }

    // Hide Modal
    function hideModal() {
        modal.hide();
    }

    selectBtn.on('click', function (e) {
        e.preventDefault();
        openModal();
    });

    editBtn.on('click', function (e) {
        e.preventDefault();
        openModal();
    });

    closeModal.on('click', function () {
        hideModal();
    });

    overlay.on('click', function () {
        hideModal();
    });

    // Remove video
    removeBtn.on('click', function (e) {
        e.preventDefault();
        $('#tubebay_video_id').val('');
        $('#tubebay_video_title').val('');
        $('#tubebay_video_thumbnail').val('');

        $('#tubebay-selected-video-container').addClass('hidden');
        $('#tubebay-add-video-container').removeClass('hidden');
    });

    // Fetch videos via REST API
    function fetchVideos() {
        $.ajax({
            url: tubebayMetabox.restUrl,
            method: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-WP-Nonce', tubebayMetabox.nonce);
            },
            success: function (response) {
                console.log('api called successfully');
                console.log(videoGrid);
                videoGrid.empty();
                console.log(response);
                if (response && response.success && response.videos.length > 0) {
                    var html = '';
                    response.videos.forEach(function (video) {
                        html += '<div class="tubebay-modal-video-item" data-id="' + video.id + '" data-title="' + video.title + '" data-thumbnail="' + video.thumbnail_url + '">';
                        html += '<img src="' + video.thumbnail_url + '" alt="Thumbnail" />';
                        html += '<p>' + video.title + '</p>';
                        html += '</div>';
                    });
                    videoGrid.html(html);

                    // Add click handlers for the newly loaded items
                    $('.tubebay-modal-video-item').on('click', function () {
                        var vidId = $(this).data('id');
                        var vidTitle = $(this).data('title');
                        var vidThumb = $(this).data('thumbnail');

                        $('#tubebay_video_id').val(vidId);
                        $('#tubebay_video_title').val(vidTitle);
                        $('#tubebay_video_thumbnail').val(vidThumb);

                        // Update UI
                        $('#tubebay_video_title_display').text(vidTitle);
                        $('#tubebay_video_thumbnail_img').attr('src', vidThumb);

                        $('#tubebay-selected-video-container').removeClass('hidden');
                        $('#tubebay-add-video-container').addClass('hidden');

                        hideModal();
                    });

                } else {
                    videoGrid.html('<p>' + tubebayMetabox.i18n.error + '</p>');
                }
                isLoaded = true;
            },
            error: function () {
                console.log('api called failed');
                videoGrid.html('<p>' + tubebayMetabox.i18n.error + '</p>');
            }
        });
    }
});
