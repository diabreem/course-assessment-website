<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentMethod extends Model
{
    protected $table = 'assessment_methods';
    protected $primaryKey = 'method_id';
    public $timestamps = false;

    protected $fillable = ['method_name'];
}
