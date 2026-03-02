<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campus;

class CampusController extends Controller
{
    public function index(Request $request)
    {
        $query = Campus::with('university');

        if ($request->has('university_id')) {
            $query->where('university_id', $request->university_id);
        }

        return $query->get();
    }

    public function show($id)
    {
        return Campus::with('university')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'campus_name' => 'nullable|string|max:50',
            'university_id' => 'nullable|exists:universities,university_id'
        ]);

        return Campus::create($validated);
    }

    public function update(Request $request, $id)
    {
        $campus = Campus::findOrFail($id);
        $validated = $request->validate([
            'campus_name' => 'sometimes|string|max:50',
            'university_id' => 'sometimes|exists:universities,university_id'
        ]);
        $campus->update($validated);
        return $campus;
    }

    public function destroy($id)
    {
        Campus::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}