<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource("users",UserController::class)->except("index");

Route::apiResource("schedule", ScheduleController::class);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get("/scheduleComposer/{user}", [ScheduleController::class, 'scheduleComposer'])
->name("schedule.compose")->middleware('auth:sanctum');

Route::apiResource("tasks", TaskController::class);

Route::apiResource("categories", CategoryController::class);


Route::get("users", [AdminController::class, "index"])->middleware("auth:sanctum");


// Route::middleware(['auth:sanctum', 'admin'])->group(function () {
//     Route::get('/users', [UserController::class, 'index']);
//     Route::put('/users/{id}', [UserController::class, 'update']);
//     Route::delete('/users/{id}', [UserController::class, 'destroy']);
// });




Route::get("tasks/today/{user}", [UserController::class, 'taskDoneToday']);

Route::get('/emails', [UserController::class, 'emails']);