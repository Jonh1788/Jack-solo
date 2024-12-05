<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CoinflipController;
use App\Http\Controllers\SorteioController;
use App\Http\Controllers\DepositoController;
use App\Http\Controllers\ImageController;

Route::get("/anunciarGanhador/{id}", [SorteioController::class, 'anunciarGanhador'])->name('anunciarGanhador');
Route::get('/', [SorteioController::class, 'index'])->name('welcome');

Route::get('/coinflips', [CoinflipController::class, 'index'])->name('coinflips.index');
Route::post('/coinflips', [CoinflipController::class, 'create'])->name('coinflips.create');
Route::post('/coinflips/{id}/join', [CoinflipController::class, 'join'])->name('coinflips.join');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get("/roleta", function () {
    return Inertia::render('Roleta');
})->name('roleta');

Route::post("/depositosuitpay", [DepositoController::class, 'SuitPay'])->name('deposito.suitpay');
Route::post("/jackpot1", [SorteioController::class, 'sorteio'])->name('sorteio');
Route::post("/send-message", [ChatController::class, 'sendMessage']);
Route::post("/suitpay/callback", [DepositoController::class, 'Callback'])->name('suitpay.callback');
Route::post("/checkPayment", [DepositoController::class, 'CheckPaymentStatus'])->name('checkPayment');
Route::post("/upload-image", [ImageController::class, 'uploadImage'])->name('uploadImage');
Route::post("/get-image", [ImageController::class, 'getImage'])->name('getImage');
require __DIR__.'/auth.php';
