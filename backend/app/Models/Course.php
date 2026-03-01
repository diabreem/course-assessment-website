<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'courses';

    protected $primaryKey = 'course_id';

    public $timestamps = false;

    protected $fillable = [
        'course_code',
        'course_title',
        'department',
        'university_id'
    ];

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id', 'university_id');
    }
}