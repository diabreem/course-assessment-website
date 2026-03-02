<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        return Course::with('university')->get();
    }

    public function show($id)
    {
        return Course::with('university')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_code' => 'required|string|max:20',
            'course_title' => 'nullable|string|max:100',
            'department' => 'nullable|string|max:100',
            'university_id' => 'required|exists:universities,university_id'
        ]);

        return Course::create($validated);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $validated = $request->validate([
            'course_code' => 'sometimes|string|max:20',
            'course_title' => 'sometimes|string|max:100',
            'department' => 'sometimes|string|max:100',
            'university_id' => 'sometimes|exists:universities,university_id'
        ]);

        $course->update($validated);
        return $course;

    }

    public function destroy($id)
    {
        Course::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    public function index()
    {
        return Course::with('offerings')->get();
    }

    public function show($id)
    {
        return Course::with('offerings')->findOrFail($id);
    }
}