<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tasks')->insert([
            ["id" => 1, "priority" => 10, "status" => "új", "category_id" => 7, "user_id" => 1, "title" => "Feladat neve", "description" => "Feladat leirasa", "due_date" => "2025-04-12 15:51:39"],
            ["id" => 2, "priority" => 10, "status" => "új", "category_id" => 6, "user_id" => 1, "title" => "Feladat neve", "description" => "Feladat leirasa", "due_date" => "2025-04-06 15:51:39"],
            ["id" => 3, "priority" => 10, "status" => "új", "category_id" => 5, "user_id" => 1, "title" => "Feladat neve", "description" => "Feladat leirasa", "due_date" => "2025-04-05 15:51:39"]
        ]);
    }
}
