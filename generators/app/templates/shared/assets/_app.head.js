/* ========================================
 * Application head
 * ======================================== */

/**
 * Global custom build modernizr
 */
import '<% if (html) { %>../../dist/assets<% } if (typo3) { %>../Resources/Public/Assets<% } if (wp) { %>../dist/assets<% } %>/vendors/modernizr.js' // eslint-disable-line
