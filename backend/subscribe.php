<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 0);

function getLanguage() {
    $acceptLanguage = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';
    if (strpos($acceptLanguage, 'ru') === 0) {
        return 'ru';
    }
    return 'en';
}

$lang = getLanguage();

$messages = [
    'en' => [
        'method_not_allowed' => 'Method not allowed',
        'email_required' => 'Email is required',
        'invalid_email' => 'Invalid email format',
        'success' => 'Thank you for subscribing!'
    ],
    'ru' => [
        'method_not_allowed' => 'Метод не разрешен',
        'email_required' => 'Email обязателен',
        'invalid_email' => 'Неверный формат email',
        'success' => 'Спасибо за подписку!'
    ]
];

function logError($message) {
    error_log("Subscribe Error: " . $message);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => $messages[$lang]['method_not_allowed']]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

if (!$input || !isset($input['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $messages[$lang]['email_required']]);
    exit;
}

$email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $messages[$lang]['invalid_email']]);
    exit;
}

error_log("New subscription: " . $email);

echo json_encode([
    'success' => true, 
    'message' => $messages[$lang]['success']
]);
?>
