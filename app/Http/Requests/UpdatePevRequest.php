<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePevRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $pev = $this->route('pev');
        return $pev && $this->user()->id === $pev->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $pev = $this->route('pev');

        return [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1990|max:' . (date('Y') + 2),
            'vin' => [
                'required',
                'string',
                'size:17',
                Rule::unique('pevs', 'vin')->ignore($pev->id)
            ],
            'license_plate' => [
                'required',
                'string',
                'max:20',
                Rule::unique('pevs', 'license_plate')->ignore($pev->id)
            ],
            'color' => 'nullable|string|max:255',
            'battery_capacity' => 'nullable|numeric|min:0|max:999.99',
            'range_miles' => 'nullable|integer|min:0|max:9999',
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
            'make.required' => 'Vehicle make is required.',
            'model.required' => 'Vehicle model is required.',
            'year.required' => 'Model year is required.',
            'year.min' => 'Model year must be 1990 or later.',
            'year.max' => 'Model year cannot be more than 2 years in the future.',
            'vin.required' => 'VIN (Vehicle Identification Number) is required.',
            'vin.size' => 'VIN must be exactly 17 characters.',
            'vin.unique' => 'This VIN is already registered to another vehicle.',
            'license_plate.required' => 'License plate is required.',
            'license_plate.unique' => 'This license plate is already registered to another vehicle.',
            'battery_capacity.numeric' => 'Battery capacity must be a number.',
            'battery_capacity.min' => 'Battery capacity cannot be negative.',
            'range_miles.integer' => 'Range must be a whole number.',
            'range_miles.min' => 'Range cannot be negative.',
        ];
    }
}