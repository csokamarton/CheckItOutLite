<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Create a new policy instance.
     */
    public function update(User $authUser, User $user): bool
    {
        return $authUser->id === $user->id || $authUser->role === 'admin';
    }

    public function delete(User $authUser, User $user): bool
    {
        return $authUser->role === 'admin';
    }
}
