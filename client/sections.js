/**
 * External dependencies
 *
 * @format
 */

const fs = require( 'fs' );
const path = require( 'path' );

/**
 * Internal dependencies
 */
const config = require( 'config' );
const sections = require( config( 'project' ) );

module.exports = sections;
