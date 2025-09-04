import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';



export default function CreatePev() {
    const { data, setData, post, processing, errors } = useForm({
        make: '',
        model: '',
        year: '',
        vin: '',
        license_plate: '',
        color: '',
        battery_capacity: '',
        range_miles: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pevs');
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

    return (
        <AppLayout>
            <Head title="Register New PEV" />
            
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">⚡ Register New PEV</h1>
                    <p className="text-gray-600">
                        Add a new Personal Electric Vehicle to your registry
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Information</CardTitle>
                        <CardDescription>
                            Please provide accurate information about your Personal Electric Vehicle
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="make">Make *</Label>
                                    <Input
                                        id="make"
                                        type="text"
                                        value={data.make}
                                        onChange={(e) => setData('make', e.target.value)}
                                        placeholder="e.g., Tesla, Nissan, Chevrolet"
                                        required
                                    />
                                    <InputError message={errors.make} />
                                </div>

                                <div>
                                    <Label htmlFor="model">Model *</Label>
                                    <Input
                                        id="model"
                                        type="text"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        placeholder="e.g., Model 3, Leaf, Bolt EV"
                                        required
                                    />
                                    <InputError message={errors.model} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="year">Year *</Label>
                                    <select
                                        id="year"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Select year</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.year} />
                                </div>

                                <div>
                                    <Label htmlFor="color">Color</Label>
                                    <Input
                                        id="color"
                                        type="text"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        placeholder="e.g., White, Black, Red"
                                    />
                                    <InputError message={errors.color} />
                                </div>
                            </div>

                            {/* Identification */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Vehicle Identification</h3>
                                
                                <div>
                                    <Label htmlFor="vin">VIN (Vehicle Identification Number) *</Label>
                                    <Input
                                        id="vin"
                                        type="text"
                                        value={data.vin}
                                        onChange={(e) => setData('vin', e.target.value.toUpperCase())}
                                        placeholder="17-character VIN"
                                        maxLength={17}
                                        className="font-mono"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter the 17-character Vehicle Identification Number found on your registration
                                    </p>
                                    <InputError message={errors.vin} />
                                </div>

                                <div>
                                    <Label htmlFor="license_plate">License Plate *</Label>
                                    <Input
                                        id="license_plate"
                                        type="text"
                                        value={data.license_plate}
                                        onChange={(e) => setData('license_plate', e.target.value.toUpperCase())}
                                        placeholder="License plate number"
                                        className="font-mono"
                                        required
                                    />
                                    <InputError message={errors.license_plate} />
                                </div>
                            </div>

                            {/* Technical Specifications */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Technical Specifications (Optional)</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="battery_capacity">Battery Capacity (kWh)</Label>
                                        <Input
                                            id="battery_capacity"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="999.9"
                                            value={data.battery_capacity}
                                            onChange={(e) => setData('battery_capacity', e.target.value)}
                                            placeholder="e.g., 75.0"
                                        />
                                        <InputError message={errors.battery_capacity} />
                                    </div>

                                    <div>
                                        <Label htmlFor="range_miles">EPA Range (miles)</Label>
                                        <Input
                                            id="range_miles"
                                            type="number"
                                            min="0"
                                            max="9999"
                                            value={data.range_miles}
                                            onChange={(e) => setData('range_miles', e.target.value)}
                                            placeholder="e.g., 300"
                                        />
                                        <InputError message={errors.range_miles} />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-4 pt-6">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Registering...' : 'Register PEV'}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-blue-900 mb-2">📋 Need Help?</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• VIN can be found on your vehicle registration, insurance card, or driver's side dashboard</li>
                            <li>• License plate should match what's currently on your vehicle</li>
                            <li>• Technical specifications can usually be found in your owner's manual or manufacturer's website</li>
                            <li>• All information can be updated later if needed</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}