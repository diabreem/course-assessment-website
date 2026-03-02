<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';
    protected $primaryKey = 'report_id';
    public $timestamps = false;

    protected $fillable = [
        'course_id',
        'report_type',
        'start_year',
        'end_year'
    ];

    public function values()
    {
        return $this->hasMany(ReportValue::class, 'report_id');
    }
}