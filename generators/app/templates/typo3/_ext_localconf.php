<?php
if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

/**
 * Basics
 */
TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($_EXTKEY, 'Configuration/TypoScript', '<%= dir %>');

/**
 * Page TS configs
 */
TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig('<INCLUDE_TYPOSCRIPT: source="FILE:EXT:<%= dir %>/Configuration/PageTSConfig/backendLayout.txt">');
