<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PHPUnit\Framework\TestCase;

class UserModelTest extends TestCase
{
    public function test_tasks_relationship_returns_has_many()
    {
        $user = new User();

        $this->assertInstanceOf(HasMany::class, $user->tasks());
        $this->assertEquals('user_id', $user->tasks()->getForeignKeyName());
        $this->assertEquals('id', $user->tasks()->getLocalKeyName());
    }
    public function test_schedules_relationship_returns_has_many()
    {
        $user = new User();

        $this->assertInstanceOf(HasMany::class, $user->schedules());
    }
    public function test_shared_tasks_relationship_returns_belongs_to_many()
    {
        $user = new User();

        $this->assertInstanceOf(BelongsToMany::class, $user->shared_tasks());
    }
    public function test_shared_tasklists_guests_relationship_returns_belongs_to_many()
    {
        $user = new User();

        $relation = $user->shared_tasklists_guests();
        $this->assertInstanceOf(BelongsToMany::class, $relation);
        $this->assertEquals('users_users', $relation->getTable());
        $this->assertEquals('owner_id', $relation->getForeignPivotKeyName());
        $this->assertEquals('guest_id', $relation->getRelatedPivotKeyName());
    }
    public function test_shared_tasklists_owners_relationship_returns_belongs_to_many()
    {
        $user = new User();

        $relation = $user->shared_tasklists_owners();
        $this->assertInstanceOf(BelongsToMany::class, $relation);
        $this->assertEquals('users_users', $relation->getTable());
        $this->assertEquals('guest_id', $relation->getForeignPivotKeyName());
        $this->assertEquals('owner_id', $relation->getRelatedPivotKeyName());
    }
}
