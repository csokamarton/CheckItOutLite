<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'period_of_time' => 'required|date_format:H:i',
            'deadline' => 'required|date_format:Y-m-d H:i:s',
            'description' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'task_id' => 'required|exists:tasks,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'period_of_time.required' => 'The period is required.',
            'deadline.required' => 'Specifying the deadline is mandatory.',
            'user_id.exists' => 'The specified user does not exist.',
            'task_id.exists' => 'The specified user does not exist.',
        ];
    }
}
