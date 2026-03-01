<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $table = 'universities';

    protected $primaryKey = 'university_id';

    public $timestamps = false;

    protected $fillable = [
        'university_name'
    ];

    // Relationshipss
    public function campuses()
    {
        return $this->hasMany(Campus::class, 'university_id', 'university_id');
    }

    public function courses()
    {
        return $this->hasMany(Course::class, 'university_id', 'university_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'university_id', 'university_id');
    }
}