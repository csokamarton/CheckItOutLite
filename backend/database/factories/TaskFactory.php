<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "title" => fake()->title,
            "description" => fake()->text(255),
            "due_date" => fake()->date('Y-m-d H:i:s'),
            "priority" => fake()->numberBetween(1,10),
            "category_id" => Category::factory(),
            "user_id" => User::factory(),
            "status" => "új"
        ];
    }
}
