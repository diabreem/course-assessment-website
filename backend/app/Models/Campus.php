<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    protected $table = 'campuses';

    protected $primaryKey = 'campus_id';

    public $timestamps = false;

    protected $fillable = [
        'campus_name',
        'university_id'
    ];

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id', 'university_id');
    }
}