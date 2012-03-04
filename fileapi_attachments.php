<?php

/**
 * FileApi Attachments
 *
 * Use's the HTML5-FileApi to upload Attachments
 * (only supported in modern Browsers, Testet in FF 3.6 on Ubuntu)
 *
 * For now, this is only a proof-of-concept, there a many hacks in the code
 * If you have any hints or suggestions, feel free to contact me.
 *
 * @author Matthias Krauser <matthias@krauser.eu>
 *
 */
class fileapi_attachments extends rcube_plugin
{

  public $task = 'mail';

  function init()
  {
    $this->add_hook('render_page', array($this, 'compose'));
    $this->register_action('plugin.upload_fileapi', array($this, 'handleUpload'));
  }

  /**
   * add a fileapi implementation to the compose template
   */
  function compose($args)
  {
    // find the compose template
    if ($args['template'] == 'compose')
    {
      $this->include_script('fileapi.js');
    }
    return $args;
  }

  function handleUpload($args = null)
  {
    $rcmail = rcmail::get_instance();

    $group = get_input_value('_id', RCUBE_INPUT_GET);

    $temp_dir = $rcmail->config->get('temp_dir');
    $tmpfname = tempnam($temp_dir, 'rcmAttmnt');

    $fd = fopen("php://input", "r");
    $data = '';

    while ($data = fread($fd, 1000000))
    {
      file_put_contents($tmpfname, $data, FILE_APPEND);
    }

    if ($_SERVER['REQUEST_METHOD'] == 'POST')
    {
      $attachment = array(
          'path'     => $tmpfname,
          'size'     => filesize($tmpfname),
          'name'     => $_GET['_name'],
          'mimetype' => rc_mime_content_type($tmpfname, $_GET['_name']),
          'group'    => $group,
          'id'       => $this->file_id()
      );

      //this call would use move_uploaded_file, so it wont work with our tempfile
      //$attachment = $rcmail->plugins->exec_hook('attachment_upload', $attachment);

      $id = $attachment['id'];
      $_SESSION['compose_data_'.$group]['attachments'][$id] = $attachment;

      if (($icon = $_SESSION['compose_data_'.$group]['deleteicon']) && is_file($icon))
      {
        $button = html::img(array(
                    'src' => $icon,
                    'alt' => rcube_label('delete')
                ));
      }
      else
      {
        $button = Q(rcube_label('delete'));
      }

      $content = html::a(array(
                  'href' => "#delete",
                  'onclick' => sprintf("return %s.command('remove-attachment','rcmfile%s', this)", JS_OBJECT_NAME, $id),
                  'title' => rcube_label('delete'),
                      ), $button);

      $content .= Q($attachment['name']);

      $rcmail->output->command('add2attachment_list', "rcmfile$id", array(
          'html' => $content,
          'name' => $attachment['name'],
          'mimetype' => $attachment['mimetype'],
          'complete' => true), $id);
    }

    // send html page with JS calls as response
    // theres no way to use a raw-template, can this be added to the core?
    $rcmail->output->send('iframe');
  }

  private function file_id()
  {
    $userid = rcmail::get_instance()->user->ID;
    list($usec, $sec) = explode(' ', microtime());
    return preg_replace('/[^0-9]/', '', $userid . $sec . $usec);
  }

}
