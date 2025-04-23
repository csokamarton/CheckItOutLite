<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            ["id" => 1, "category_name" => "Tanulás"],
            ["id" => 2, "category_name" => "Házi feladat"],
            ["id" => 3, "category_name" => "Vizsgafelkészülés"],
            ["id" => 4, "category_name" => "Kutatás"],
            ["id" => 5, "category_name" => "Olvasás"],
            ["id" => 6, "category_name" => "Gyakorlás"],
            ["id" => 7, "category_name" => "Projektmunka"],
            ["id" => 8, "category_name" => "Előadáskészítés"],
            ["id" => 9, "category_name" => "Csoportmunka"],
            ["id" => 10, "category_name" => "Feladatmegoldás"]
        ]);
    }
}
