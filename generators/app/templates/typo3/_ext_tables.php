<?php
if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($_EXTKEY, 'Configuration/TypoScript', '<%= dir %>');
\FluidTYPO3\Flux\Core::registerProviderExtensionKey('<%= appNameSpace %>.<%= dirCapitalize %>', 'Page');
\FluidTYPO3\Flux\Core::registerProviderExtensionKey('<%= appNameSpace %>.<%= dirCapitalize %>', 'Content');

