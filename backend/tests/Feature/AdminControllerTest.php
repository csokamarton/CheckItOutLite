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

    public function test_admin_can_list_users()
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


    public function test_non_admin_cannot_list_users()
    {
        $user = User::where('email', 'user@user.com')->first();

        $response = $this->actingAs($user)->getJson('/api/users');

        $response->assertStatus(403);
    }



    public function test_admin_can_create_user()
    {
        $admin = User::where('email', 'admin@admin.com')->first();
        
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'test1234',
            'password_confirmation' => 'test1234',
            'role' => 'customer'
        ];

        $response = $this->actingAs($admin)->postJson('/api/users', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }


    public function test_admin_can_update_user()
    {
        $admin = User::where('email', 'admin@admin.com')->first();
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['email' => 'updated@example.com']);
    }


    public function test_admin_can_delete_user()
    {
        $admin = User::where('email', 'admin@admin.com')->first();
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }


    public function test_guest_cannot_access_admin_routes()
    {
        $response = $this->getJson('/api/users');
        $response->assertStatus(401);
    }
}
