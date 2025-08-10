<?php
/**
 * Plugin Name: TM Pull Quote Format
 * Plugin URI: https://github.com/miklb/pull-quote
 * Description: Inline formatting tool for creating pull quotes using a custom web component. Highlight text and click the pull quote button to wrap it.
 * Version: 1.0.0
 * Author: Michael Bishop
 * License: MIT
 * Text Domain: tm-pullquote
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('TM_PULLQUOTE_VERSION', '1.0.0');
define('TM_PULLQUOTE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('TM_PULLQUOTE_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main plugin class
 */
class TM_PullQuote_Plugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
    }
    
    /**
     * Initialize the plugin
     */
    public function init() {
        // Allow pull-quote tags in post content
        add_filter('wp_kses_allowed_html', array($this, 'allow_pullquote_tags'), 10, 2);
    }
    
    /**
     * Allow pull-quote tags in content
     */
    public function allow_pullquote_tags($allowed, $context) {
        if ($context === 'post') {
            $allowed['pull-quote'] = array(
                'right' => array(),
                'center' => array()
            );
        }
        return $allowed;
    }
    
    /**
     * Enqueue block editor assets - simplified approach
     */
    public function enqueue_block_editor_assets() {
        // Enqueue the format registration script with minimal dependencies
        wp_enqueue_script(
            'tm-pullquote-format',
            TM_PULLQUOTE_PLUGIN_URL . 'assets/format.js',
            array('wp-dom-ready', 'wp-rich-text', 'wp-block-editor', 'wp-element'),
            TM_PULLQUOTE_VERSION,
            true
        );
        
        // Enqueue editor styles
        wp_enqueue_style(
            'tm-pullquote-editor',
            TM_PULLQUOTE_PLUGIN_URL . 'assets/format.css',
            array(),
            TM_PULLQUOTE_VERSION
        );
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets() {
        // Only load if content contains pull-quote tags
        if ($this->has_pullquote_content()) {
            wp_enqueue_script(
                'pull-quote-component',
                TM_PULLQUOTE_PLUGIN_URL . 'assets/pull-quote.js',
                array(),
                TM_PULLQUOTE_VERSION,
                true
            );
            
            // Enqueue theme integration CSS
            wp_enqueue_style(
                'tm-pullquote-theme',
                TM_PULLQUOTE_PLUGIN_URL . 'assets/theme-integration.css',
                array(),
                TM_PULLQUOTE_VERSION
            );
            
            add_filter('script_loader_tag', array($this, 'add_module_to_script'), 10, 3);
        }
    }
    
    /**
     * Add type="module" to the pull-quote script
     */
    public function add_module_to_script($tag, $handle, $src) {
        if ('pull-quote-component' === $handle) {
            $tag = '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '-js"></script>';
        }
        return $tag;
    }
    
    /**
     * Check if current content has pull-quote elements
     */
    private function has_pullquote_content() {
        global $post;
        
        if (is_admin()) {
            return false; // Don't load in admin
        }
        
        if (is_singular() && $post && strpos($post->post_content, 'pull-quote') !== false) {
            return true;
        }
        
        return false;
    }
}

// Initialize the plugin
new TM_PullQuote_Plugin();
