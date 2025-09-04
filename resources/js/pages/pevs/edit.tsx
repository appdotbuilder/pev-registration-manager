import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';

interface Pev {
    id: number;
    make: string;
    model: string;
    year: number;
    vin: string;
    license_plate: string;
    color?: string;
    battery_capacity?: number;
    range_miles?: number;
    status: string;
}



interface Props {
    pev: Pev;
    [key: string]: unknown;
}

export default function EditPev({ pev }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        make: pev.make,
        model: pev.model,
        year: pev.year.toString(),
        vin: pev.vin,
        license_plate: pev.license_plate,
        color: pev.color || '',
        battery_capacity: pev.battery_capacity?.toString() || '',
        range_miles: pev.range_miles?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/pevs/${pev.id}`);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

    return (
        <AppLayout>
            <Head title={`Edit ${pev.year} ${pev.make} ${pev.model}`} />
            
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ✏️ Edit PEV Registration
                        </h1>
                        <p className="text-gray-600">
                            Update information for your {pev.year} {pev.make} {pev.model}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Information</CardTitle>
                        <CardDescription>
                            Update the information for your Personal Electric Vehicle
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
                                        Enter the 17-character Vehicle Identification Number
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
                                    {processing ? 'Updating...' : 'Update PEV'}
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

                {/* Warning Section */}
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h3>
                        <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• Changing VIN or License Plate information may require verification</li>
                            <li>• Make sure all information matches your official vehicle documentation</li>
                            <li>• Changes to identification information may affect ongoing transfers</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}