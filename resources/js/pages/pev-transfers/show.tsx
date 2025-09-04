import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X, Trash2, ArrowRight } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Pev {
    id: number;
    make: string;
    model: string;
    year: number;
    license_plate: string;
    vin: string;
    color?: string;
}

interface Transfer {
    id: number;
    status: string;
    initiated_at: string;
    completed_at?: string;
    to_email?: string;
    to_name?: string;
    to_phone?: string;
    notes?: string;
    pev: Pev;
    fromUser: User;
    toUser?: User;
}

interface Props {
    transfer: Transfer;
    [key: string]: unknown;
}

export default function ShowTransfer({ transfer }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number } } }>().props;
    const currentUserId = auth.user?.id;
    const isTransferOwner = transfer.fromUser.id === currentUserId;
    const canManageTransfer = isTransferOwner && transfer.status === 'pending';

    const handleComplete = () => {
        if (confirm('Are you sure you want to complete this transfer? This action cannot be undone.')) {
            router.patch(`/pev-transfers/${transfer.id}`, {
                action: 'complete'
            });
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this transfer?')) {
            router.patch(`/pev-transfers/${transfer.id}`, {
                action: 'cancel'
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this transfer record? This action cannot be undone.')) {
            router.delete(`/pev-transfers/${transfer.id}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'cancelled':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getStatusEmoji = (status: string) => {
        switch (status) {
            case 'completed':
                return '✅';
            case 'pending':
                return '⏳';
            case 'cancelled':
                return '❌';
            default:
                return '❓';
        }
    };

    return (
        <AppLayout>
            <Head title={`Transfer ${transfer.pev.year} ${transfer.pev.make} ${transfer.pev.model}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/pev-transfers')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Transfers
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                {getStatusEmoji(transfer.status)} PEV Transfer Details
                                <Badge variant={getStatusColor(transfer.status)}>
                                    {transfer.status}
                                </Badge>
                            </h1>
                            <p className="text-gray-600">
                                Transfer #{transfer.id} • Initiated {new Date(transfer.initiated_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    
                    {isTransferOwner && (
                        <div className="flex gap-2">
                            {canManageTransfer && (
                                <>
                                    <Button onClick={handleComplete}>
                                        <Check className="w-4 h-4 mr-2" />
                                        Complete Transfer
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel}>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel Transfer
                                    </Button>
                                </>
                            )}
                            <Button variant="outline" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Record
                            </Button>
                        </div>
                    )}
                </div>

                {/* Vehicle Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Being Transferred</CardTitle>
                        <CardDescription>
                            Details of the PEV involved in this transfer
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Vehicle</label>
                                    <p className="text-lg font-semibold">
                                        {transfer.pev.year} {transfer.pev.make} {transfer.pev.model}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-500">License Plate</label>
                                    <p className="text-lg font-mono bg-gray-50 p-2 rounded border inline-block">
                                        {transfer.pev.license_plate}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">VIN</label>
                                    <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                                        {transfer.pev.vin}
                                    </p>
                                </div>
                                
                                {transfer.pev.color && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Color</label>
                                        <p className="text-lg">{transfer.pev.color}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transfer Parties */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transfer Participants</CardTitle>
                        <CardDescription>
                            Information about the current and new owner
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            {/* Current Owner */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">Current Owner (From)</label>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-semibold">{transfer.fromUser.name}</p>
                                    <p className="text-sm text-gray-600">{transfer.fromUser.email}</p>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center">
                                <ArrowRight className="w-8 h-8 text-gray-400" />
                            </div>

                            {/* New Owner */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">New Owner (To)</label>
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    {transfer.toUser ? (
                                        <>
                                            <p className="font-semibold">{transfer.toUser.name}</p>
                                            <p className="text-sm text-blue-600">{transfer.toUser.email}</p>
                                            <Badge variant="default" className="mt-2">Registered User</Badge>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-semibold">{transfer.to_name || 'Unknown'}</p>
                                            <p className="text-sm text-blue-600">{transfer.to_email || 'No email'}</p>
                                            {transfer.to_phone && (
                                                <p className="text-sm text-gray-600">{transfer.to_phone}</p>
                                            )}
                                            <Badge variant="secondary" className="mt-2">Unregistered</Badge>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transfer Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transfer Timeline</CardTitle>
                        <CardDescription>
                            Timeline of transfer events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-medium">Transfer Initiated</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(transfer.initiated_at).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        by {transfer.fromUser.name}
                                    </p>
                                </div>
                            </div>

                            {transfer.completed_at && (
                                <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                        transfer.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                    <div>
                                        <p className="font-medium">
                                            Transfer {transfer.status === 'completed' ? 'Completed' : 'Cancelled'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(transfer.completed_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {transfer.status === 'pending' && (
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 animate-pulse"></div>
                                    <div>
                                        <p className="font-medium text-yellow-700">Awaiting Action</p>
                                        <p className="text-sm text-gray-600">
                                            Transfer is pending completion or cancellation
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                {transfer.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Transfer Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">{transfer.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Actions Help */}
                {canManageTransfer && (
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Next Steps</h3>
                            <ul className="text-sm text-yellow-800 space-y-1">
                                <li>• <strong>Complete Transfer:</strong> Finalizes the ownership transfer. The PEV will be transferred to the new owner.</li>
                                <li>• <strong>Cancel Transfer:</strong> Cancels the transfer process. The PEV remains with you.</li>
                                <li>• Both actions are permanent and cannot be undone.</li>
                                <li>• Make sure all parties agree before completing the transfer.</li>
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}