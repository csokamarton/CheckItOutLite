<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    Use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_task_index() :void    {
        $n = 5;
        $tasks = Task::factory($n)->create();

        $firstTask = $tasks->first();

        $resp = $this->getJson("/api/tasks");

        $resp->assertStatus(200);
        $resp->assertJsonCount($n, "data");

        $resp->assertJsonPath("data.0.id", $firstTask->id);
        $resp->assertJsonPath("data.0.descreption", $firstTask->descreption);
        $resp->assertJsonPath("data.0.title", $firstTask->title);
        $resp->assertJsonPath("data.0.due", $firstTask->due_date);
        
    }

    public function test_task_store() : void {
        $task = Task::factory()->make();

        $resp = $this->postJson("/api/tasks", $task->toArray());

        $resp->assertStatus(201);
        $resp->assertJsonCount(1);

        $resp->assertJsonStructure([
            "data" => [
                "id",
                "title",
                "description",
                "due"
            ]
            ])
            ->assertJsonFragment([
                "title" => $task->title,
                "due" => $task->due_date
            ]);
    }

    public function test_task_delete() : void {
        $tasks = Task::factory(5)->create();
        $id = $tasks->last()->id;

        $resp = $this->deleteJson("/api/tasks/$id");

        $resp->assertStatus(204);
        $this->assertDatabaseMissing(Task::class, ["id" => $id]);
    }

    public function test_task_update() : void {
        $task = Task::factory(1)->create();
        $id = $task->last()->id;

        $resp = $this->putJson("/api/tasks/$id", Task::factory()->make([
            "title" => "newTitle",
            "due_date" => $task->last()->due_date,
            "descreption" => $task->last()->descreption
        ])->toArray());

        $resp->assertStatus(200);

        $resp->assertJsonPath("data.id", $task->last()->id);
        $resp->assertJsonPath("data.descreption", $task->last()->descreption);
        $resp->assertJsonPath("data.title", "newTitle");
        $resp->assertJsonPath("data.due", $task->last()->due_date);
    }

    public function test_task_show() : void {
        $n = 5;
        $tasks = Task::factory($n)->create();

        $task = $tasks->get(1);

        $resp = $this->getJson("/api/tasks/2");

        $resp->assertStatus(200);

        $resp->assertJsonPath("data.id", $task->id);
        $resp->assertJsonPath("data.descreption", $task->descreption);
        $resp->assertJsonPath("data.title", $task->title);
        $resp->assertJsonPath("data.due", $task->due_date);
    }
}
