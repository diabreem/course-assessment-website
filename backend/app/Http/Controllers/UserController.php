<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return User::with(['university', 'campus'])->get();
    }

    public function show($id)
    {
        return User::with(['university', 'campus'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password_hash' => 'required|string|max:255',
            'role' => 'required|in:ADMIN,INSTRUCTOR,COORDINATOR',
            'university_id' => 'required|exists:universities,university_id',
            'phone' => 'required|string|max:20',
            'campus_id' => 'nullable|exists:campuses,campus_id'
        ]);

        return User::create($validated);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:50',
            'last_name' => 'sometimes|string|max:50',
            'email' => 'sometimes|email|unique:users,email,' .$id. ',user_id',
            'password_hash' => 'sometimes|string|max:255',
            'role' => 'sometimes|in:ADMIN,INSTRUCTOR,COORDINATOR',
            'university_id' => 'sometimes|exists:universities,university_id',
            'phone' => 'sometimes|string|max:20',
            'campus_id' => 'nullable|exists:campuses,campus_id'
        ]);

        $user->update($validated);
        return $user;
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}