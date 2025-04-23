<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SchedulesSedder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('schedules')->insert([
            [
                "id" => 1,
                "name" => "Sample Schedule",
                "period_of_time" => "1:00:00",
                "deadline" => "2030-01-01 12:00:00",
                "description" => "Sample description",
                "task_id" => 1,
                "user_id" => 1,
            ]
        ]);
    }
}
