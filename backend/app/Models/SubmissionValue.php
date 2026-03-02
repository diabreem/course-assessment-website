<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubmissionValue extends Model
{
    protected $table = 'submission_values';
    protected $primaryKey = 'value_id';
    public $timestamps = false;

    protected $fillable = [
        'submission_id',
        'slo_id',
        'pc_id',
        'field_key',
        'value_numeric',
        'value_text'
    ];
}
