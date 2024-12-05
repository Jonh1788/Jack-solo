<?php

use AliasProject\LaravelEchoApiGateway\Handler;
use Illuminate\Foundation\Application;

require __DIR__ . "/../vendor/autoload.php";

/** @var Application $app */
$app = require __DIR__ . "/../bootstrap/app.php";

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

return $app->make(Handler::class);
