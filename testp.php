<?php

// Inclua o autoload do Composer
require __DIR__ . '/vendor/autoload.php';

// Inicialize a aplicação Laravel
$app = require __DIR__ . '/bootstrap/app.php';

// Registre o ServiceProvider
$app->register(\AliasProject\LaravelEchoApiGateway\ServiceProvider::class);

// Teste se o ServiceProvider está registrado corretamente
$subscriptionRepository = $app->make(\AliasProject\LaravelEchoApiGateway\SubscriptionRepository::class);

echo "ServiceProvider registrado com sucesso e SubscriptionRepository instanciado.";