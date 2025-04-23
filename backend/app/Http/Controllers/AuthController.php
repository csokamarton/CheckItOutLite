<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // public function register(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|string|email|max:255|unique:users',
    //         'password' => 'required|string|min:6',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 400);
    //     }

    //     $user = User::create([
    //         'name' => $request->name,
    //         'email' => $request->email,
    //         'password' => Hash::make($request->password),
    //     ]);

    //     $token = JWTAuth::fromUser($user);

    //     return response()->json([
    //         'message' => 'Sikeres regisztráció!',
    //         'user' => $user,
    //         'token' => $token
    //     ], 201);
    // }

    // public function login(LoginRequest $request)
    // {
    //     $credentials = $request->validated();

    //     if (Auth::attempt($credentials)) {
    //         $token = $request->user()->createToken("app");

    //         return response()->json([
    //             'message' => 'Sikeres bejelentkezés!',
    //             'token' => $token->plainTextToken
    //         ]);
    //     }

    //     return response()->json([
    //             "data" => [
    //                 "message" => "SIKERETELEN belépés",
    //             ]
    //         ],401);

    // }

    // public function me()
    // {
    //     return response()->json(auth()->user());
    // }

    // public function logout()
    // {
    //     auth()->logout();
    //     return response()->json(['message' => 'Sikeres kijelentkezés']);
    // }



    public function login(LoginRequest $request)
    {
        $cred = $request->validated();

        if (Auth::attempt($cred)) {
            $token = $request->user()->createToken('app');

            return response()->json([
                "data" => [
                    "token" => $token->plainTextToken
                ]
            ]);
        } else {
            return response()->json([
                "data" => [
                    "message" => "Sikertelen belépés"
                ]
            ], 401);
        }
    }

    public function register(StoreUserRequest $request)
    {
        $data = $request->validated();

        $user = User::create($data);

        return response()->json([
            "data" => [
                "message" => "Sikeresen regisztrál $user->email."
            ]
        ]);
    }
}
