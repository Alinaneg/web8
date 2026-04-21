<?php
require_once __DIR__ . '/init.php';

// Определяем метод запроса
$method = $_SERVER['REQUEST_METHOD'];

// Получаем ID из URL (если есть)
$id = null;
if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
}

// Обработка запросов
switch ($method) {
    case 'POST':
        // СОЗДАНИЕ НОВОЙ ЗАЯВКИ
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendJsonResponse(['error' => 'Неверный формат JSON'], 400);
        }
        
        // Валидация
        $errors = [];
        
        $fullNameError = validateFullName($input['fullName'] ?? '');
        if ($fullNameError) $errors['fullName'] = $fullNameError;
        
        $emailError = validateEmail($input['email'] ?? '');
        if ($emailError) $errors['email'] = $emailError;
        
        $phoneError = validatePhone($input['phone'] ?? '');
        if ($phoneError) $errors['phone'] = $phoneError;
        
        $birthError = validateBirthDate($input['birth'] ?? '');
        if ($birthError) $errors['birth'] = $birthError;
        
        $genderError = validateGender($input['gender'] ?? '');
        if ($genderError) $errors['gender'] = $genderError;
        
        $langsError = validateLanguages($input['langs'] ?? [], $all_languages);
        if ($langsError) $errors['langs'] = $langsError;
        
        if (empty($input['contract'])) {
            $errors['contract'] = 'Необходимо подтвердить ознакомление с контрактом';
        }
        
        if (empty($input['consent'])) {
            $errors['consent'] = 'Необходимо согласие на обработку данных';
        }
        
        if (!empty($errors)) {
            sendJsonResponse(['errors' => $errors], 400);
        }
        
        try {
            $credentials = generateCredentials();
            $form_data = [
                'fullName' => trim($input['fullName']),
                'email' => trim($input['email']),
                'phone' => trim($input['phone'] ?? ''),
                'birth' => $input['birth'] ?? '',
                'gender' => $input['gender'],
                'bio' => trim($input['bio'] ?? '')
            ];
            
            $user_id = saveUserToDB($db, $form_data, $credentials, $input['langs'] ?? []);
            
            sendJsonResponse([
                'success' => true,
                'user_id' => $user_id,
                'login' => $credentials['login'],
                'password' => $credentials['password'],
                'profile_url' => SITE_URL . '/edit.php'
            ], 201);
            
        } catch (Exception $e) {
            sendJsonResponse(['error' => 'Ошибка сервера: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'PUT':
        // РЕДАКТИРОВАНИЕ ЗАЯВКИ (требуется авторизация)
        if (!$id) {
            sendJsonResponse(['error' => 'ID не указан'], 400);
        }
        
        $user = getAuthUserFromRequest($db);
        if (!$user) {
            sendJsonResponse(['error' => 'Не авторизован'], 401);
        }
        
        if ($user['id'] != $id) {
            sendJsonResponse(['error' => 'Доступ запрещён'], 403);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            sendJsonResponse(['error' => 'Неверный формат JSON'], 400);
        }
        
        // Валидация
        $errors = [];
        
        $fullNameError = validateFullName($input['fullName'] ?? '');
        if ($fullNameError) $errors['fullName'] = $fullNameError;
        
        $emailError = validateEmail($input['email'] ?? '');
        if ($emailError) $errors['email'] = $emailError;
        
        $phoneError = validatePhone($input['phone'] ?? '');
        if ($phoneError) $errors['phone'] = $phoneError;
        
        $birthError = validateBirthDate($input['birth'] ?? '');
        if ($birthError) $errors['birth'] = $birthError;
        
        $genderError = validateGender($input['gender'] ?? '');
        if ($genderError) $errors['gender'] = $genderError;
        
        $langsError = validateLanguages($input['langs'] ?? [], $all_languages);
        if ($langsError) $errors['langs'] = $langsError;
        
        if (!empty($errors)) {
            sendJsonResponse(['errors' => $errors], 400);
        }
        
        try {
            $form_data = [
                'fullName' => trim($input['fullName']),
                'email' => trim($input['email']),
                'phone' => trim($input['phone'] ?? ''),
                'birth' => $input['birth'] ?? '',
                'gender' => $input['gender'],
                'bio' => trim($input['bio'] ?? '')
            ];
            
            updateUserInDB($db, $id, $form_data, $input['langs'] ?? []);
            
            sendJsonResponse(['success' => true], 200);
            
        } catch (Exception $e) {
            sendJsonResponse(['error' => 'Ошибка сервера: ' . $e->getMessage()], 500);
        }
        break;
        
    case 'GET':
        // ПОЛУЧЕНИЕ ДАННЫХ ЗАЯВКИ (требуется авторизация)
        if (!$id) {
            sendJsonResponse(['error' => 'ID не указан'], 400);
        }
        
        $user = getAuthUserFromRequest($db);
        if (!$user) {
            sendJsonResponse(['error' => 'Не авторизован'], 401);
        }
        
        if ($user['id'] != $id) {
            sendJsonResponse(['error' => 'Доступ запрещён'], 403);
        }
        
        $userData = getUserById($db, $id);
        if (!$userData) {
            sendJsonResponse(['error' => 'Пользователь не найден'], 404);
        }
        
        $userLangs = getUserLanguages($db, $id);
        
        sendJsonResponse([
            'id' => $userData['id'],
            'fullName' => $userData['full_name'],
            'email' => $userData['email'],
            'phone' => $userData['phone'],
            'birth' => $userData['birth_date'],
            'gender' => $userData['gender'],
            'bio' => $userData['bio'],
            'langs' => $userLangs,
            'login' => $userData['login']
        ], 200);
        break;
        
    default:
        sendJsonResponse(['error' => 'Метод не поддерживается'], 405);
}
?>