<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Task extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    protected $fillable = [
        "description",
        "due_date",
        "priority",
        "status",
        "category_id",
        "user_id",
        "title"
    ];

    public static function getStatuses() {
        return [
            "új",
            "folyamatban",
            "kész"
        ];
    }

    public function user() : BelongsTo {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function schedules() : BelongsToMany {
        return $this->belongsToMany(Schedule::class, "task_schedule");
    }

    public function category() : BelongsTo {
        return $this->belongsTo(Category::class);
    }
}
