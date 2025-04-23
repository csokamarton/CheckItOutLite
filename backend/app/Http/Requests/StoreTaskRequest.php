<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "title" => ["string", "max:50", "required"],
            "description" => ["string", "max:255", "nullable"],
            "due_date" => ["date", "nullable"],
            "priority" => ["required", "integer", "between:0,10"],
            "status" => ["string", "max:15", Rule::in(Task::getStatuses())],
            "user_id" => ["required", "exists:users,id"],
            "category_id" => ["required", "exists:categories,id"]
        ];
    }
}
