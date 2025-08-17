<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

$email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Save subscription to file (for testing purposes)
$subscriptionData = [
    'email' => $email,
    'timestamp' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

$subscriptionsFile = 'subscriptions.json';
$subscriptions = [];

// Load existing subscriptions
if (file_exists($subscriptionsFile)) {
    $subscriptions = json_decode(file_get_contents($subscriptionsFile), true) ?: [];
}

// Check if email already exists
$emailExists = false;
foreach ($subscriptions as $sub) {
    if ($sub['email'] === $email) {
        $emailExists = true;
        break;
    }
}

if ($emailExists) {
    echo json_encode(['success' => false, 'message' => 'You are already subscribed!']);
    exit;
}

// Add new subscription
$subscriptions[] = $subscriptionData;

// Save to file
$saved = file_put_contents($subscriptionsFile, json_encode($subscriptions, JSON_PRETTY_PRINT));

if ($saved !== false) {
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you for subscribing! Your email has been saved.'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save subscription']);
}
?>
