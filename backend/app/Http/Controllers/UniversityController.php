<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\University;

class UniversityController extends Controller
{
    public function index()
    {
        return University::with(['campuses', 'courses', 'users'])->get();
    }

    public function show($id)
    {
        return University::with(['campuses', 'courses', 'users'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'university_name' => 'required|string|max:255'
        ]);

        return University::create($validated);
    }

    public function update(Request $request, $id)
    {
        $university = University::findOrFail($id);
        $validated = $request->validate([
            'university_name' => 'required|string|max:255'
        ]);
        $university->update($validated);
        return $university;
    }

    public function destroy($id)
    {
        University::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}