<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Mockery;
use PHPUnit\Framework\TestCase;

class TaskTest extends TestCase
{
    public function test_get_statuses_returns_expected_array(): void
    {
        $expectedStatuses = [
            "új",
            "folyamatban",
            "kész"
        ];

        $this->assertEquals($expectedStatuses, Task::getStatuses());
    }
    public function test_user_relationship_returns_belongs_to(): void
    {
        $task = new Task();

        $relation = $task->user();

        $this->assertInstanceOf(BelongsTo::class, $relation);
        $this->assertEquals('user_id', $relation->getForeignKeyName());
    }
    public function test_category_relationship_returns_belongs_to(): void
    {
        $task = new Task();

        $relation = $task->category();

        $this->assertInstanceOf(BelongsTo::class, $relation);
    }
    public function test_schedules_relationship_returns_belongs_to_many(): void
    {
        $task = new Task();

        $relation = $task->schedules();

        $this->assertInstanceOf(BelongsToMany::class, $relation);
    }
}
