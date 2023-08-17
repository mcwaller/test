<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lectures;

class ApiLectureController extends Controller
{
    public function index()
    {
        $lectures = Lectures::all();

        return response()->json($lectures);
    }
}