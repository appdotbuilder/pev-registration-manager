import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowRight, Eye } from 'lucide-react';

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
}

interface Transfer {
    id: number;
    status: string;
    initiated_at: string;
    completed_at?: string;
    to_email?: string;
    to_name?: string;
    notes?: string;
    pev: Pev;
    fromUser: User;
    toUser?: User;
}

interface PaginatedTransfers {
    data: Transfer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    transfers: PaginatedTransfers;
    [key: string]: unknown;
}

export default function TransferIndex({ transfers }: Props) {
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
            <Head title="PEV Transfers" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">🔄 PEV Transfers</h1>
                        <p className="text-gray-600">
                            Manage ownership transfers for your Personal Electric Vehicles
                        </p>
                    </div>
                    <Button onClick={() => router.visit('/pev-transfers/create')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Initiate Transfer
                    </Button>
                </div>

                {/* Transfers List */}
                {transfers.data.length === 0 ? (
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <div className="text-6xl mb-4">🔄</div>
                            <h3 className="text-lg font-semibold mb-2">No transfers yet</h3>
                            <p className="text-gray-600 mb-6">
                                You haven't initiated any ownership transfers. Start by transferring one of your PEVs to a new owner.
                            </p>
                            <Button onClick={() => router.visit('/pev-transfers/create')}>
                                Initiate Your First Transfer
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                            Showing {transfers.data.length} of {transfers.total} transfers
                        </div>

                        {/* Transfers List */}
                        <div className="grid gap-4">
                            {transfers.data.map((transfer) => (
                                <Card key={transfer.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{getStatusEmoji(transfer.status)}</span>
                                                    <div>
                                                        <h3 className="text-lg font-semibold">
                                                            {transfer.pev.year} {transfer.pev.make} {transfer.pev.model}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            License Plate: {transfer.pev.license_plate}
                                                        </p>
                                                    </div>
                                                    <Badge variant={getStatusColor(transfer.status)}>
                                                        {transfer.status}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium text-gray-700">From:</span>
                                                        <p className="text-gray-900">{transfer.fromUser.name}</p>
                                                        <p className="text-gray-600">{transfer.fromUser.email}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-center">
                                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    
                                                    <div>
                                                        <span className="font-medium text-gray-700">To:</span>
                                                        {transfer.toUser ? (
                                                            <>
                                                                <p className="text-gray-900">{transfer.toUser.name}</p>
                                                                <p className="text-gray-600">{transfer.toUser.email}</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-gray-900">{transfer.to_name || 'Unknown'}</p>
                                                                <p className="text-gray-600">{transfer.to_email || 'No email'}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Initiated:</span> {new Date(transfer.initiated_at).toLocaleDateString()}
                                                    </div>
                                                    {transfer.completed_at && (
                                                        <div>
                                                            <span className="font-medium">Completed:</span> {new Date(transfer.completed_at).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>

                                                {transfer.notes && (
                                                    <div className="text-sm">
                                                        <span className="font-medium text-gray-700">Notes:</span>
                                                        <p className="text-gray-600 mt-1">{transfer.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 ml-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.visit(`/pev-transfers/${transfer.id}`)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {transfers.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                {transfers.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}