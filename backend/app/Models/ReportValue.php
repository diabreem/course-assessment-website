<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportValue extends Model
{
    protected $table = 'report_values';
    protected $primaryKey = 'report_value_id';
    public $timestamps = false;

    protected $fillable = [
        'report_id',
        'slo_id',
        'average_value'
    ];
}
