import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    owner: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    searchResults?: Pev[];
    filters: {
        search?: string;
        search_type?: string;
    };
    [key: string]: unknown;
}

export default function Welcome({ searchResults, filters }: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        search_type: filters.search_type || 'license_plate',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/', { preserveState: true });
    };

    return (
        <>
            <Head title="PEV Registration System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">⚡</div>
                                <h1 className="text-2xl font-bold text-gray-900">PEV Registry</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => router.visit('/login')}
                                >
                                    Sign In
                                </Button>
                                <Button onClick={() => router.visit('/register')}>
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            ⚡ Personal Electric Vehicle Registration System
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            The comprehensive platform for PEV owners to register, manage, and transfer their electric vehicles. 
                            Keep track of your Tesla, Nissan Leaf, Chevy Bolt, and more!
                        </p>
                        
                        {/* Key Features */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                                <div className="text-3xl mb-3">📝</div>
                                <h3 className="font-semibold text-gray-900 mb-2">Easy Registration</h3>
                                <p className="text-sm text-gray-600">Register your PEV with make, model, VIN, and license plate</p>
                            </div>
                            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                                <div className="text-3xl mb-3">🔍</div>
                                <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
                                <p className="text-sm text-gray-600">Search PEVs by license plate, VIN, or make/model</p>
                            </div>
                            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                                <div className="text-3xl mb-3">✏️</div>
                                <h3 className="font-semibold text-gray-900 mb-2">Update Details</h3>
                                <p className="text-sm text-gray-600">Keep your vehicle information up-to-date</p>
                            </div>
                            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                                <div className="text-3xl mb-3">🔄</div>
                                <h3 className="font-semibold text-gray-900 mb-2">Transfer Ownership</h3>
                                <p className="text-sm text-gray-600">Seamless ownership transfer process</p>
                            </div>
                        </div>
                    </div>

                    {/* Public Search */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>🔍</span>
                                Search PEV Registry
                            </CardTitle>
                            <CardDescription>
                                Search for registered Personal Electric Vehicles by license plate, VIN, or make/model
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                                <Select
                                    value={data.search_type}
                                    onValueChange={(value) => setData('search_type', value)}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Search by..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="license_plate">License Plate</SelectItem>
                                        <SelectItem value="vin">VIN</SelectItem>
                                        <SelectItem value="make_model">Make/Model</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <Input
                                    type="text"
                                    placeholder="Enter search term..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    className="flex-1"
                                />
                                
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Searching...' : 'Search'}
                                </Button>
                            </form>

                            {/* Search Results */}
                            {searchResults && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Search Results ({searchResults.length} found)
                                    </h3>
                                    {searchResults.length === 0 ? (
                                        <p className="text-gray-600 text-center py-8">
                                            No PEVs found matching your search criteria.
                                        </p>
                                    ) : (
                                        <div className="grid gap-4">
                                            {searchResults.map((pev) => (
                                                <Card key={pev.id}>
                                                    <CardContent className="pt-6">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-semibold text-lg">
                                                                    {pev.year} {pev.make} {pev.model}
                                                                </h4>
                                                                <div className="space-y-1 text-sm text-gray-600">
                                                                    <p><strong>License Plate:</strong> {pev.license_plate}</p>
                                                                    <p><strong>VIN:</strong> {pev.vin}</p>
                                                                    {pev.color && <p><strong>Color:</strong> {pev.color}</p>}
                                                                    <p><strong>Owner:</strong> {pev.owner.name}</p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="secondary">Registered</Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Call to Action */}
                    <div className="text-center">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-8 pb-8">
                                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                                    Ready to Register Your PEV?
                                </h3>
                                <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
                                    Join thousands of PEV owners who trust our platform to manage their vehicle registrations. 
                                    Get started today and take control of your electric vehicle documentation.
                                </p>
                                <div className="space-x-4">
                                    <Button 
                                        size="lg" 
                                        onClick={() => router.visit('/register')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Create Account
                                    </Button>
                                    <Button 
                                        size="lg" 
                                        variant="outline"
                                        onClick={() => router.visit('/login')}
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-800 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span>⚡</span>
                                    PEV Registry
                                </h4>
                                <p className="text-gray-300">
                                    The trusted platform for Personal Electric Vehicle registration and management.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Features</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>• Vehicle Registration</li>
                                    <li>• Information Management</li>
                                    <li>• Ownership Transfers</li>
                                    <li>• Advanced Search</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Support</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>• Documentation</li>
                                    <li>• Help Center</li>
                                    <li>• Contact Support</li>
                                    <li>• Community Forum</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 PEV Registry. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}