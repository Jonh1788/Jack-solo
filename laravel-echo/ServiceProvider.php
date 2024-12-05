<?php

namespace AliasProject\LaravelEchoApiGateway;

use AliasProject\LaravelEchoApiGateway\Commands\VaporHandle;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider as LaravelServiceProvider;

class ServiceProvider extends LaravelServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__ . "/../config/laravel-echo-api-gateway.php",
            "laravel-echo-api-gateway"
        );
    
        Config::set("broadcasting.connections.laravel-echo-api-gateway", [
            "driver" => "laravel-echo-api-gateway",
        ]);
    
        $this->app->bind(
            SubscriptionRepository::class,
            function ($app) {
                // O Laravel irá resolver a configuração e passá-la para o SubscriptionRepository
                $config = $app['config']->get('laravel-echo-api-gateway');
                return new SubscriptionRepository($config);
            }
        );
    
        $this->app->bind(
            ConnectionRepository::class,
            function ($app) {
                $config = $app['config']->get('laravel-echo-api-gateway');
                return new ConnectionRepository($app->make(SubscriptionRepository::class), $config);
            }
        );
    }

    public function boot(BroadcastManager $broadcastManager): void
    {
        $broadcastManager->extend(
            "laravel-echo-api-gateway",
            fn() => $this->app->make(Driver::class)
        );

        $this->commands([VaporHandle::class]);

        $this->publishes(
            [
                __DIR__ .
                "/../config/laravel-echo-api-gateway.php" => config_path(
                    "laravel-echo-api-gateway.php"
                ),
            ],
            "laravel-echo-api-gateway-config"
        );
    }
}
