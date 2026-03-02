<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pc extends Model
{
    protected $table = 'pcs';
    protected $primaryKey = 'pc_id';
    public $timestamps = false;

    protected $fillable = [
        'pc_code',
        'description'
    ];
}