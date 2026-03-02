<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseOffering extends Model
{
    protected $table = 'course_offerings';
    protected $primaryKey = 'offering_id';
    public $timestamps = false;

    protected $fillable = [
        'course_id',
        'university_id',
        'academic_year',
        'semester',
        'campus_id'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'offering_id');
    }
}