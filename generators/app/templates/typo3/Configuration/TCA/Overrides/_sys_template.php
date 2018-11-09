<?php
defined('TYPO3_MODE') || die();

call_user_func(function() {
   /**
    * Extension key
    */
   $extensionKey = '<%= dir %>';

   /**
    * Basics
    */
   \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
      $extensionKey,
      'Configuration/TypoScript',
      '<%= appNameHumanize %>'
   );
});
