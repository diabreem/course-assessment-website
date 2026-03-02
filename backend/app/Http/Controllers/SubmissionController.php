<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function index()
    {
        return Submission::all();
    }

    public function show($id)
    {
        return Submission::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'form_version_id' => 'nullable|exists:form_versions,form_version_id',
            'user_id' => 'nullable|exists:users,user_id',
            'offering_id' => 'nullable|exists:course_offerings,offering_id',
            'academic_year' => 'nullable|string|max:20',
            'status' => 'nullable|in:NOT_STARTED,IN_PROGRESS,SUBMITTED',
            'submitted_at' => 'nullable|date',
            'university_id' => 'required|exists:universities,university_id'
        ]);

        return Submission::create($validated);
    }

    public function update(Request $request, $id)
    {
        $submission = Submission::findOrFail($id);

        $validated = $request->validate([
            'form_version_id' => 'sometimes|exists:form_versions,form_version_id',
            'user_id' => 'sometimes|exists:users,user_id',
            'offering_id' => 'sometimes|exists:course_offerings,offering_id',
            'academic_year' => 'sometimes|string|max:20',
            'status' => 'sometimes|in:NOT_STARTED,IN_PROGRESS,SUBMITTED',
            'submitted_at' => 'nullable|date',
            'university_id' => 'sometimes|exists:universities,university_id'
        ]);

        $submission->update($validated);

        return $submission;
    }

    public function destroy($id)
    {
        Submission::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}