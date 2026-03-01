<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
        // change role, campus_id to lists
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|string',
            'university_id' => 'nullable|integer',
            'campus_id' => 'nullable|integer',
            'phone' => 'nullable|string'
        ]);

        $validated['password_hash'] = Hash::make($validated['password']);
        unset($validated['password']);

        return User::create($validated);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->has('password')) {
            $request['password_hash'] = Hash::make($request->password);
        }

        $user->update($request->except('password'));

        return $user;
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}