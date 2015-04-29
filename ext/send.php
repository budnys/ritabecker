<?php
  //start a session -- needed for Securimage Captcha check
  session_start();
  /**
   * Sets error header and json error message response.
   *
   * @param  String $messsage error message of response
   * @return void
   */
  function errorResponse ($messsage) {
    header('HTTP/1.1 500 Internal Server Error');
    die(json_encode(array('message' => $messsage)));
  }
  
  header('Content-type: application/json');
  
  //do Captcha check, make sure the submitter is not a robot:)...
  require './securimage/securimage.php';
  $securimage = new Securimage();
  if (!$securimage->check($_POST['captcha_code'])) {
  	errorResponse('Código de segurança inválido!');
  }

  try {

  $name = $_POST['name'];
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];

	$template = file_get_contents('../mail_template/mail.html');  
  //attempt to send email
  $template = str_replace('%name%', $name, $template); 
  $template = str_replace('%email%', $email, $template);
  $template = str_replace('%subject%', $subject, $template);
  $template = str_replace('%message%', nl2br($message), $template);

  require './phpmailer/PHPMailerAutoload.php';
  $mail = new PHPMailer;
  $mail->isSMTP();
  //$mail->SMTPDebug  = 2;
  $mail->Host = getEnv('FEEDBACK_HOSTNAME');
  if (!getenv('FEEDBACK_SKIP_AUTH')) {
    $mail->SMTPAuth = true;
    $mail->Username = getenv('FEEDBACK_EMAIL');
    $mail->Password = getenv('FEEDBACK_PASSWORD');
  }
  if (getenv('FEEDBACK_ENCRYPTION') == 'TLS') {
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
  } elseif (getenv('FEEDBACK_ENCRYPTION') == 'SSL') {
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
  }
  $mail->setFrom(getenv('FEEDBACK_EMAIL'), getenv('FEEDBACK_EMAIL'));
  $mail->addAddress(getenv('FEEDBACK_EMAIL_TO'));
  $mail->ClearReplyTos();
  $mail->AddReplyTo($email, $name);
  $mail->isHTML(true);
  $mail->Subject = "Contato do site. Tipo de assunto: " + $subject;
  $mail->Body  = $template;
  $mail->AltBody = '\nNome: ' + $name + '\n Email: ' + $email + '\n Assunto: ' + $subject + '\n Mensagem: ' + $message;
  //try to send the message
  if(!$mail->Send()) { errorResponse('Erro inesperado ao tentar enviar email: ' . $mail->ErrorInfo); }
  echo json_encode(array('message' => 'Sua mensagem foi enviada com sucesso!'));
  } catch (Exception $e) {
    errorResponse('Erro inesperado ao tentar enviar email: ' . $e->getMessage());
  }
?>