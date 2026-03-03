<?php

namespace TubeBay\Data\Entities;

/**
 * Represents a single video from YouTube.
 *
 * @since      1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Data/Entities
 */
class Video
{
    /**
     * Video ID.
     *
     * @var string
     */
    public $id;

    /**
     * Video title.
     *
     * @var string
     */
    public $title;

    /**
     * Video thumbnail URL.
     *
     * @var string
     */
    public $thumbnail_url;

    /**
     * Video publish date.
     *
     * @var string
     */
    public $published_at;

    /**
     * Video description.
     *
     * @var string
     */
    public $description;

    /**
     * Constructor.
     *
     * @param array $data The video data.
     */
    public function __construct(array $data)
    {
        $this->id = sanitize_text_field($data['id'] ?? '');
        $this->title = sanitize_text_field($data['title'] ?? '');
        $this->thumbnail_url = esc_url_raw($data['thumbnail_url'] ?? '');
        $this->published_at = sanitize_text_field($data['published_at'] ?? '');
        $this->description = sanitize_textarea_field($data['description'] ?? '');
    }

    /**
     * Convert to array for easy caching/JSON serialization.
     *
     * @return array
     */
    public function to_array()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'thumbnail_url' => $this->thumbnail_url,
            'published_at' => $this->published_at,
            'description' => $this->description,
        ];
    }
}
