<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campus;

class CampusController extends Controller
{
    public function index()
    {
        return Campus::with('university')->get();
    }

    public function show($id)
    {
        return Campus::with('university')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'campus_name' => 'nullable|string|max:50',
            'university_id' => 'nullable|integer'
        ]);

        return Campus::create($validated);
    }

    public function update(Request $request, $id)
    {
        $campus = Campus::findOrFail($id);
        $campus->update($request->only('campus_name', 'university_id'));
        return $campus;
    }

    public function destroy($id)
    {
        Campus::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}