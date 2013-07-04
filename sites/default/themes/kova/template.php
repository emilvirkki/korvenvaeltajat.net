<?php
//$Id$

function kova_breadcrumb($variables) {
  $breadcrumb = $variables['breadcrumb'];
  $breadcrumb[] = '<span class="current">' . drupal_get_title() . '</span>';

  if (!empty($breadcrumb)) {
    $output = '<h2 class="element-invisible">' . t('You are here') . '</h2>';

    $output .= '<div class="breadcrumb">' . implode(' › ', $breadcrumb) . '</div>';
    return $output;
  }
}

/**
 * Returns HTML for a username, potentially linked to the user's page.
 *
 * @param $variables
 *   An associative array containing:
 *   - account: The user object to format.
 *   - name: The user's name, sanitized.
 *   - extra: Additional text to append to the user's name, sanitized.
 *   - link_path: The path or URL of the user's profile page, home page, or
 *     other desired page to link to for more information about the user.
 *   - link_options: An array of options to pass to the l() function's $options
 *     parameter if linking the user's name to the user's page.
 *   - attributes_array: An array of attributes to pass to the
 *     drupal_attributes() function if not linking to the user's page.
 *
 * @see template_preprocess_username()
 * @see template_process_username()
 */
function kova_username($variables) {
    
  //Get user's real name (this is why we override the function)
  $newname = lpk_get_user_fullname($variables['uid']);
  if($newname) {
    $variables['name'] = check_plain($newname);
  }
  
  if (isset($variables['link_path'])) {
    // We have a link path, so we should generate a link using l().
    // Additional classes may be added as array elements like
    // $variables['link_options']['attributes']['class'][] = 'myclass';
    $output = l($variables['name'] . $variables['extra'], $variables['link_path'], $variables['link_options']);
  }
  else {
    // Modules may have added important attributes so they must be included
    // in the output. Additional classes may be added as array elements like
    // $variables['attributes_array']['class'][] = 'myclass';
    $output = '<span' . drupal_attributes($variables['attributes_array']) . '>' . $variables['name'] . '</span>';
  }
  return $output;
}

?>