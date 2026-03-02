<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Improvement extends Model
{
    protected $table = 'improvements';
    protected $primaryKey = 'improvement_id';
    public $timestamps = false;

    protected $fillable = [
        'course_id',
        'slo_id',
        'description',
        'status',
        'year'
    ];
}
