<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $table = 'submissions';
    protected $primaryKey = 'submission_id';
    public $timestamps = false;

    protected $fillable = [
        'form_version_id',
        'user_id',
        'offering_id',
        'academic_year',
        'status',
        'submitted_at',
        'university_id'
    ];

    public function values()
    {
        return $this->hasMany(SubmissionValue::class, 'submission_id');
    }
}
