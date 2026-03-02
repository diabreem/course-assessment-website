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
    
    public function offerings()
    {
        return $this->hasMany(CourseOffering::class, 'course_id');
    }

    public function submissions()
    {
        return $this->hasManyThrough(
            Submission::class,
            CourseOffering::class,
            'course_id',
            'offering_id',
            'course_id',
            'offering_id'
        );
    }
}