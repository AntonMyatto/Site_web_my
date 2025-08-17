<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$recepient = "rabdyrka@gmail.com";
$sitename = "FrontLabor";

$name = trim($_POST["name"] ?? '');
$surname = trim($_POST["surname"] ?? '');
$text = trim($_POST["text"] ?? '');
$selecth = trim($_POST["selecth"] ?? '');

if (empty($name) || empty($surname) || empty($text)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
    exit;
}

$message = "Имя: $name \nФамилия: $surname\nТекст: $text \nСписок: $selecth";
$pagetitle = "Новая заявка с сайта \"$sitename\"";

$mailSent = mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message']);
}
?>