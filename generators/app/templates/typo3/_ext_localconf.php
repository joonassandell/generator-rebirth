<?php
if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

/**
 * Page TS configs
 */
TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig('<INCLUDE_TYPOSCRIPT: source="FILE:EXT:<%= dir %>/Configuration/PageTSConfig/backendLayout.txt">');
