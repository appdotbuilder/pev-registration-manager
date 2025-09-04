import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';

interface Pev {
    id: number;
    make: string;
    model: string;
    year: number;
    license_plate: string;
}



interface Props {
    pevs: Pev[];
    selectedPevId?: number;
    [key: string]: unknown;
}

export default function CreateTransfer({ pevs, selectedPevId }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        pev_id: selectedPevId?.toString() || '',
        to_user_id: '',
        to_email: '',
        to_name: '',
        to_phone: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pev-transfers');
    };

    return (
        <AppLayout>
            <Head title="Initiate PEV Transfer" />
            
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
                        <h1 className="text-2xl font-bold text-gray-900">🔄 Initiate PEV Transfer</h1>
                        <p className="text-gray-600">
                            Transfer ownership of your Personal Electric Vehicle to a new owner
                        </p>
                    </div>
                </div>

                {pevs.length === 0 ? (
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <div className="text-6xl mb-4">⚡</div>
                            <h3 className="text-lg font-semibold mb-2">No PEVs available for transfer</h3>
                            <p className="text-gray-600 mb-6">
                                You need to have at least one registered PEV to initiate a transfer.
                            </p>
                            <Button onClick={() => window.location.href = '/pevs/create'}>
                                Register a PEV First
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Transfer Details</CardTitle>
                            <CardDescription>
                                Provide information about the PEV transfer and new owner
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Select PEV */}
                                <div>
                                    <Label htmlFor="pev_id">Select PEV to Transfer *</Label>
                                    <Select
                                        value={data.pev_id}
                                        onValueChange={(value) => setData('pev_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a PEV to transfer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pevs.map((pev) => (
                                                <SelectItem key={pev.id} value={pev.id.toString()}>
                                                    {pev.year} {pev.make} {pev.model} - {pev.license_plate}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.pev_id} />
                                </div>

                                {/* New Owner Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">New Owner Information</h3>
                                    <p className="text-sm text-gray-600">
                                        Provide contact information for the person who will receive ownership of this PEV.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="to_name">Full Name *</Label>
                                            <Input
                                                id="to_name"
                                                type="text"
                                                value={data.to_name}
                                                onChange={(e) => setData('to_name', e.target.value)}
                                                placeholder="Enter new owner's full name"
                                                required
                                            />
                                            <InputError message={errors.to_name} />
                                        </div>

                                        <div>
                                            <Label htmlFor="to_phone">Phone Number</Label>
                                            <Input
                                                id="to_phone"
                                                type="tel"
                                                value={data.to_phone}
                                                onChange={(e) => setData('to_phone', e.target.value)}
                                                placeholder="(555) 123-4567"
                                            />
                                            <InputError message={errors.to_phone} />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="to_email">Email Address *</Label>
                                        <Input
                                            id="to_email"
                                            type="email"
                                            value={data.to_email}
                                            onChange={(e) => setData('to_email', e.target.value)}
                                            placeholder="newowner@example.com"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            The new owner will be notified at this email address
                                        </p>
                                        <InputError message={errors.to_email} />
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <Label htmlFor="notes">Transfer Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Add any additional notes about this transfer..."
                                        rows={4}
                                        maxLength={1000}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {data.notes.length}/1000 characters
                                    </p>
                                    <InputError message={errors.notes} />
                                </div>

                                {/* Submit */}
                                <div className="flex gap-4 pt-6">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Initiating Transfer...' : 'Initiate Transfer'}
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
                )}

                {/* Important Information */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-blue-900 mb-2">📋 Transfer Process</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Initiating a transfer will create a transfer record in "pending" status</li>
                            <li>• The new owner will be notified via email (if provided)</li>
                            <li>• You can complete or cancel the transfer from the transfer details page</li>
                            <li>• Once completed, ownership will be transferred to the new owner</li>
                            <li>• Make sure all vehicle information is up-to-date before transferring</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}