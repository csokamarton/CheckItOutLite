<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\UserSeeder::class);
    }

    public function admin_can_list_users()
    {
        $admin = User::where('email', 'admin@admin.com')->first();

        $response = $this->actingAs($admin)->getJson('/api/users');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [[
                'id',
                'name',
                'email',
                'role'
            ]]
        ]);
    }
}
