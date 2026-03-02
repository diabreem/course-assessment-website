<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        return Report::all();
    }

    public function show($id)
    {
        return Report::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'nullable|exists:courses,course_id',
            'report_type' => 'nullable|in:BASELINE,POST_IMPROVEMENT',
            'start_year' => 'nullable|integer',
            'end_year' => 'nullable|integer'
        ]);

        return Report::create($validated);
    }

    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        $validated = $request->validate([
            'course_id' => 'sometimes|exists:courses,course_id',
            'report_type' => 'sometimes|in:BASELINE,POST_IMPROVEMENT',
            'start_year' => 'sometimes|integer',
            'end_year' => 'sometimes|integer'
        ]);

        $report->update($validated);

        return $report;
    }

    public function destroy($id)
    {
        Report::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}