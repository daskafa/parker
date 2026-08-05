<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\ConflictException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    /**
     * @return array{token: string, user: array{id: int, name: string, email: string}}
     *
     * @throws ConflictException
     */
    public function login(string $email, string $password): array
    {
        $user = $this->users->findByEmail($email);

        if (! $user || ! Hash::check($password, $user->password)) {
            throw new ConflictException('E-posta veya şifre hatalı.', 401);
        }

        return [
            'token' => $user->createToken('admin-panel')->plainTextToken,
            'user' => $this->transformUser($user),
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    /**
     * @return array{id: int, name: string, email: string}
     */
    public function profile(User $user): array
    {
        return $this->transformUser($user);
    }

    /**
     * @return array{id: int, name: string, email: string}
     */
    private function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }
}
