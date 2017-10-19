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
      'typo3' => '8.7.7-8.9.99',
      'flux' => '^8.2.1',
      'fluidpages' => 'dev-development',
      'fluidcontent' => '^5.2.0',
      'vhs' => '^4.3.2',
    ),
  ),
);
