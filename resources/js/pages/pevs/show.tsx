import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft, RotateCcw } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Transfer {
    id: number;
    status: string;
    initiated_at: string;
    completed_at?: string;
    to_email?: string;
    to_name?: string;
    fromUser: User;
    toUser?: User;
}

interface Pev {
    id: number;
    make: string;
    model: string;
    year: number;
    license_plate: string;
    vin: string;
    color?: string;
    battery_capacity?: number;
    range_miles?: number;
    status: string;
    created_at: string;
    updated_at: string;
    owner: User;
    transfers: Transfer[];
}

interface Props {
    pev: Pev;
    [key: string]: unknown;
}

export default function ShowPev({ pev }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete the registration for ${pev.year} ${pev.make} ${pev.model}?`)) {
            router.delete(`/pevs/${pev.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={`${pev.year} ${pev.make} ${pev.model}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/pevs')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to PEVs
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                ⚡ {pev.year} {pev.make} {pev.model}
                                <Badge variant={pev.status === 'active' ? 'default' : 'secondary'}>
                                    {pev.status}
                                </Badge>
                            </h1>
                            <p className="text-gray-600">
                                License Plate: {pev.license_plate}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(`/pevs/${pev.id}/edit`)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.visit(`/pev-transfers/create?pev_id=${pev.id}`)}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Transfer
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vehicle Information</CardTitle>
                            <CardDescription>
                                Basic details about your Personal Electric Vehicle
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Make</label>
                                    <p className="text-lg">{pev.make}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Model</label>
                                    <p className="text-lg">{pev.model}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Year</label>
                                    <p className="text-lg">{pev.year}</p>
                                </div>
                                {pev.color && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Color</label>
                                        <p className="text-lg">{pev.color}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">VIN</label>
                                <p className="text-lg font-mono bg-gray-50 p-2 rounded border">{pev.vin}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">License Plate</label>
                                <p className="text-lg font-mono bg-gray-50 p-2 rounded border">{pev.license_plate}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Specifications</CardTitle>
                            <CardDescription>
                                Performance and technical details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pev.battery_capacity ? (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Battery Capacity</label>
                                    <p className="text-lg">{pev.battery_capacity} kWh</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Battery Capacity</label>
                                    <p className="text-gray-400 italic">Not specified</p>
                                </div>
                            )}

                            {pev.range_miles ? (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">EPA Range</label>
                                    <p className="text-lg">{pev.range_miles} miles</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">EPA Range</label>
                                    <p className="text-gray-400 italic">Not specified</p>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <div className="mt-1">
                                    <Badge variant={pev.status === 'active' ? 'default' : 'secondary'}>
                                        {pev.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Registration Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registration Details</CardTitle>
                        <CardDescription>
                            Registration and ownership information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Owner</label>
                                <p className="text-lg">{pev.owner.name}</p>
                                <p className="text-sm text-gray-600">{pev.owner.email}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500">Registered On</label>
                                <p className="text-lg">{new Date(pev.created_at).toLocaleDateString()}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                <p className="text-lg">{new Date(pev.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transfer History */}
                {pev.transfers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Transfer History</CardTitle>
                            <CardDescription>
                                Ownership transfer records for this vehicle
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pev.transfers.map((transfer) => (
                                    <div key={transfer.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge 
                                                        variant={
                                                            transfer.status === 'completed' ? 'default' : 
                                                            transfer.status === 'pending' ? 'secondary' : 'outline'
                                                        }
                                                    >
                                                        {transfer.status}
                                                    </Badge>
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(transfer.initiated_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm">
                                                    <strong>From:</strong> {transfer.fromUser.name}
                                                </p>
                                                <p className="text-sm">
                                                    <strong>To:</strong> {
                                                        transfer.toUser 
                                                            ? transfer.toUser.name 
                                                            : transfer.to_name || transfer.to_email
                                                    }
                                                </p>
                                                {transfer.completed_at && (
                                                    <p className="text-sm text-gray-600">
                                                        Completed: {new Date(transfer.completed_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.visit(`/pev-transfers/${transfer.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}