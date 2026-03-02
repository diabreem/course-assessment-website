<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slo extends Model
{
    protected $table = 'slos';
    protected $primaryKey = 'so_id';
    public $timestamps = false;

    protected $fillable = [
        'so_code',
        'description',
        'is_active'
    ];
}