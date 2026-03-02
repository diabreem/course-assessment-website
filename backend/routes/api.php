<?php
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ImprovementController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SubmissionController;

Route::apiResource('universities', UniversityController::class);
Route::apiResource('campuses', CampusController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('improvements', ImprovementController::class);
Route::apiResource('reports', ReportController::class);
Route::apiResource('submissions', SubmissionController::class);