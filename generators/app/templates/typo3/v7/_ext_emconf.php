<?php
$EM_CONF[$_EXTKEY] = array(
  'title' => '<%= dir %>',
  'author' => '<%= appAuthor %>',
  'description' => '<%= appDescription %>',
  'category' => 'misc',
  'version' => '1.0.0',
  'author' => '<%= appAuthor %>',
  'constraints' => array(
    'depends' => array(
      'typo3' => '7.6.0',
      'flux' => '7.4.0',
      'fluidpages' => '3.6.1',
      'fluidcontent' => '4.4.1',
      'vhs' => '3.1.0',
    ),
  ),
);
