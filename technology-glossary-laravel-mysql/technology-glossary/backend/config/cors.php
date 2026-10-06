<?php

// Substitua o config/cors.php padrão do Laravel por este arquivo.
// Libera o front-end estático (ex.: http://127.0.0.1:5500 via Live Server)
// para consumir a API em http://localhost:8000/api.

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // Em produção, troque '*' pelo domínio real do front-end.
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
