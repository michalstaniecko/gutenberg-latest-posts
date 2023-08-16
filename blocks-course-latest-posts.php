<?php
/**
 * Plugin Name:       Blocks Course Latest Posts
 * Description:       Blocks Course Latest Posts.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Michal Staniecko
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       latest-posts
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function blocks_course_render_latest_posts_block($attributes)
{
	print_r($attributes);
	return 'Dynamic content';
}

function blocks_course_latest_posts_init()
{
	register_block_type_from_metadata(__DIR__ . '/build', array(
		'render_callback' => 'blocks_course_render_latest_posts_block'
	));
}

add_action('init', 'blocks_course_latest_posts_init');