<?php
header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input) {
    echo json_encode([
        'error' => 'Неверный формат JSON',
        'raw' => $raw,
        'raw_length' => strlen($raw)
    ]);
    exit();
}

echo json_encode([
    'success' => true,
    'received' => $input,
    'login' => 'test_user',
    'password' => 'test_pass',
    'profile_url' => '/web8/edit.php'
]);
