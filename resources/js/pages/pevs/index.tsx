import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';

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
    battery_capacity?: number;
    range_miles?: number;
    status: string;
    created_at: string;
    owner: User;
}

interface PaginatedPevs {
    data: Pev[];
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
    pevs: PaginatedPevs;
    filters: {
        search?: string;
    };
    [key: string]: unknown;
}

export default function PevIndex({ pevs, filters }: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/pevs', { preserveState: true });
    };

    const handleDelete = (pev: Pev) => {
        if (confirm(`Are you sure you want to delete the registration for ${pev.year} ${pev.make} ${pev.model}?`)) {
            router.delete(`/pevs/${pev.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="My PEVs" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">⚡ My PEVs</h1>
                        <p className="text-gray-600">
                            Manage your Personal Electric Vehicle registrations
                        </p>
                    </div>
                    <Button onClick={() => router.visit('/pevs/create')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Register New PEV
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Search by make, model, VIN, or license plate..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Searching...' : 'Search'}
                            </Button>
                            {filters.search && (
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => {
                                        setData('search', '');
                                        get('/pevs');
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Results */}
                {pevs.data.length === 0 ? (
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <div className="text-6xl mb-4">⚡</div>
                            <h3 className="text-lg font-semibold mb-2">
                                {filters.search ? 'No PEVs found' : 'No PEVs registered yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {filters.search 
                                    ? 'Try adjusting your search terms or clear the search to see all your PEVs.'
                                    : 'Get started by registering your first Personal Electric Vehicle.'
                                }
                            </p>
                            {!filters.search && (
                                <Button onClick={() => router.visit('/pevs/create')}>
                                    Register Your First PEV
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                            Showing {pevs.data.length} of {pevs.total} PEVs
                        </div>

                        {/* PEV List */}
                        <div className="grid gap-4">
                            {pevs.data.map((pev) => (
                                <Card key={pev.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-semibold">
                                                        {pev.year} {pev.make} {pev.model}
                                                    </h3>
                                                    <Badge 
                                                        variant={pev.status === 'active' ? 'default' : 'secondary'}
                                                    >
                                                        {pev.status}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">License Plate:</span> {pev.license_plate}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">VIN:</span> {pev.vin}
                                                    </div>
                                                    {pev.color && (
                                                        <div>
                                                            <span className="font-medium">Color:</span> {pev.color}
                                                        </div>
                                                    )}
                                                    {pev.battery_capacity && (
                                                        <div>
                                                            <span className="font-medium">Battery:</span> {pev.battery_capacity} kWh
                                                        </div>
                                                    )}
                                                    {pev.range_miles && (
                                                        <div>
                                                            <span className="font-medium">Range:</span> {pev.range_miles} miles
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-medium">Registered:</span> {new Date(pev.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.visit(`/pevs/${pev.id}`)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.visit(`/pevs/${pev.id}/edit`)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.visit(`/pev-transfers/create?pev_id=${pev.id}`)}
                                                >
                                                    Transfer
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(pev)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pevs.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                {pevs.links.map((link, index) => (
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