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
            'campus_name' => 'required|string|max:255',
            'university_id' => 'required|integer'
        ]);

        return Campus::create($validated);
    }

    public function update(Request $request, $id)
    {
        $campus = Campus::findOrFail($id);
        $campus->update($request->all());
        return $campus;
    }

    public function destroy($id)
    {
        Campus::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}