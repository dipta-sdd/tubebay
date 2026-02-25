<?php

namespace TubeBay\Data\Entities;

class Video
{
    public $id;
    public $title;
    public $thumbnail_url;
    public $published_at;
    public $description;

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
