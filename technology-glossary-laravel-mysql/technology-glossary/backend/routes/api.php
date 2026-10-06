<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TermController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Technology Glossary (Lar Donato Flores)
|--------------------------------------------------------------------------
| Respondem em /api/... . Ainda sem autenticação (ver README, seção
| "Segurança") — hoje o "login" do admin.html é só uma checagem no
| próprio navegador (sessionStorage), não protege a API de verdade.
*/

Route::get('/terms', [TermController::class, 'index']);
Route::get('/terms/{term}', [TermController::class, 'show']);
Route::post('/terms', [TermController::class, 'store']);
Route::put('/terms/{term}', [TermController::class, 'update']);
Route::patch('/terms/{term}', [TermController::class, 'update']);
Route::delete('/terms/{term}', [TermController::class, 'destroy']);

Route::get('/categories', [CategoryController::class, 'index']);
