<?php

namespace Tests\Unit;

use App\Http\Controllers\ScheduleController;
use App\Models\User;
use Mockery;
use PHPUnit\Framework\TestCase;

class ScheduleTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_schedule_composer_orders_tasks_by_priority_and_due_date(): void
    {
        $mockUser = Mockery::mock(User::class);
        $mockUser->shouldReceive('load')->andReturnSelf();
        $mockUser->shouldReceive('only')->with('tasks')->andReturn([
            'tasks' => collect([
                ['id' => 1, 'priority' => 10, 'due_date' => '2025-03-22 20:44:07'],
                ['id' => 2, 'priority' => 9,  'due_date' => '2025-03-21 20:45:00'],
                ['id' => 3, 'priority' => 10, 'due_date' => '2025-03-21 20:44:00'],
            ]),
        ]);

        $controller = new ScheduleController();
        $sortedTask = $controller->scheduleComposer($mockUser);

        $expected = [
            ['id' => 3, 'priority' => 10, 'due_date' => '2025-03-21 20:44:00'],
            ['id' => 2, 'priority' => 9,  'due_date' => '2025-03-21 20:45:00'],
            ['id' => 1, 'priority' => 10, 'due_date' => '2025-03-22 20:44:07'],
        ];

        $this->assertEquals($expected, $sortedTask);
    }
}
