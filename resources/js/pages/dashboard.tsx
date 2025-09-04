import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Pev {
    id: number;
    make: string;
    model: string;
    year: number;
    license_plate: string;
    vin: string;
    color?: string;
    status: string;
    created_at: string;
}

interface Props {
    userPevs: Pev[];
    totalPevs: number;
    activePevs: number;
    [key: string]: unknown;
}

export default function Dashboard({ userPevs, totalPevs, activePevs }: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">⚡ Welcome to Your PEV Dashboard</h1>
                    <p className="text-blue-100">
                        Manage your Personal Electric Vehicle registrations, transfers, and more.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total PEVs</CardTitle>
                            <div className="text-2xl">🚗</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPevs}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered vehicles
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active PEVs</CardTitle>
                            <div className="text-2xl">✅</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activePevs}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                            <div className="text-2xl">⚡</div>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={() => router.visit('/pevs/create')}
                                className="w-full"
                            >
                                Register New PEV
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent PEVs */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Your Recent PEVs</CardTitle>
                                <CardDescription>
                                    Your most recently registered Personal Electric Vehicles
                                </CardDescription>
                            </div>
                            <Button 
                                variant="outline"
                                onClick={() => router.visit('/pevs')}
                            >
                                View All PEVs
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {userPevs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">⚡</div>
                                <h3 className="text-lg font-semibold mb-2">No PEVs registered yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Get started by registering your first Personal Electric Vehicle
                                </p>
                                <Button onClick={() => router.visit('/pevs/create')}>
                                    Register Your First PEV
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {userPevs.map((pev) => (
                                    <Card key={pev.id} className="cursor-pointer hover:shadow-md transition-shadow"
                                          onClick={() => router.visit(`/pevs/${pev.id}`)}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-lg">
                                                        {pev.year} {pev.make} {pev.model}
                                                    </h4>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <p><strong>License Plate:</strong> {pev.license_plate}</p>
                                                        <p><strong>VIN:</strong> {pev.vin}</p>
                                                        {pev.color && <p><strong>Color:</strong> {pev.color}</p>}
                                                        <p><strong>Registered:</strong> {new Date(pev.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge 
                                                        variant={pev.status === 'active' ? 'default' : 'secondary'}
                                                    >
                                                        {pev.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>🔍</span>
                                Search & Manage
                            </CardTitle>
                            <CardDescription>
                                Search for PEVs and manage your registrations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => router.visit('/pevs')}
                            >
                                View All My PEVs
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => router.visit('/')}
                            >
                                Search Public Registry
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>🔄</span>
                                Transfers
                            </CardTitle>
                            <CardDescription>
                                Manage ownership transfers for your PEVs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => router.visit('/pev-transfers')}
                            >
                                View Transfer History
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => router.visit('/pev-transfers/create')}
                            >
                                Initiate New Transfer
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}