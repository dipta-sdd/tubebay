<?php

/**
 * The Database Manager class.
 *
 * Handles the creation and management of the plugin's custom database tables.
 *
 * @since      1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Data
 * @author     sankarsan <wpanchorbay@gmail.com>
 */

namespace TubeBay\Data;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

class DbManager
{
    /**
     * The single instance of the class.
     *
     * @since 1.0.0
     * @var   DbManager
     * @access private
     */
    private static $instance = null;

    /**
     * Gets an instance of this object.
     *
     * @static
     * @access public
     * @since 1.0.0
     * @return DbManager
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Private constructor.
     *
     * @since 1.0.0
     * @access private
     */
    private function __construct()
    {
    }

    /**
     * Create all custom tables.
     *
     * @return void
     * @since 1.0.0
     */
    public function create_tables()
    {
        tubebay_log('Creating TubeBay custom database tables', 'info');
        // $this->create_example_table();
    }


}
