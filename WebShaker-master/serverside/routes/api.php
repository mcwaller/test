<?php

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/message', function () {
    return response()->json([
        'message' => 'Hello',
        'status' => true
    ]);
});

Route::get('/messageplus', function () {
    $cars = Car::all();
    return response()->json($cars);
});