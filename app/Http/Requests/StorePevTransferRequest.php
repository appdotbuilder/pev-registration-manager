<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePevTransferRequest extends FormRequest
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
            'pev_id' => 'required|exists:pevs,id',
            'to_user_id' => 'nullable|exists:users,id',
            'to_email' => 'required_without:to_user_id|email|max:255',
            'to_name' => 'required_without:to_user_id|string|max:255',
            'to_phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'pev_id.required' => 'Please select a PEV to transfer.',
            'pev_id.exists' => 'The selected PEV does not exist.',
            'to_user_id.exists' => 'The selected recipient user does not exist.',
            'to_email.required_without' => 'Email is required when no existing user is selected.',
            'to_email.email' => 'Please provide a valid email address.',
            'to_name.required_without' => 'Name is required when no existing user is selected.',
            'to_phone.max' => 'Phone number is too long.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}