<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'period_of_time',
        'deadline',
        'description',
        'task_id',
        'user_id',
    ];


    public function task() : BelongsToMany {
        return $this->belongsToMany("task_schedule");
    }
    
}
