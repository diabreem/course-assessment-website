<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $table = 'users';

    protected $primaryKey = 'user_id';

    public $timestamps = false;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password_hash',
        'role',
        'university_id',
        'campus_id',
        'phone'
    ];

    protected $hidden = [
        'password_hash'
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // Relationships
    public function university()
    {
        return $this->belongsTo(University::class, 'university_id', 'university_id');
    }

    public function campus()
    {
        return $this->belongsTo(Campus::class, 'campus_id', 'campus_id');
    }
}