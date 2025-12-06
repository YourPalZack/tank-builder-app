'use client';

import { Card } from '@/components/ui/Card';
import { useBuildStore } from '@/store/useBuildStore';
import { Fish, Leaf, Mountain, PenTool, X } from 'lucide-react';
import { AquariumBuild } from '@/types';

interface BuildWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuildWizardModal({ isOpen, onClose }: BuildWizardModalProps) {
  const { loadBuild } = useBuildStore();

  if (!isOpen) return null;

  const applyTemplate = (type: 'community' | 'planted' | 'cichlid') => {
    const newId = crypto.randomUUID();
    let template: Partial<AquariumBuild> = {
        id: newId,
        fish: [],
        inverts: [],
        plants: [],
        equipment: { filter: null, heater: null, light: null, co2: null, airPump: null, other: [] },
        substrate: null,
        substrateBags: 0,
        totalCost: 0,
        stockingLevel: 0,
        warnings: [],
        targetParams: { temp: [70, 80], ph: [6.5, 7.5], hardness: [5, 15] }
    };

    if (type === 'community') {
        template = {
            ...template,
            name: 'Beginner Community Tank',
            tank: {
                id: 'tank-20-high',
                name: '20 Gallon High',
                dimensions: { length: 24, width: 12, height: 16 },
                volumeGallons: 20,
                volumeLiters: 75,
                shape: 'rectangular',
                material: 'glass',
                price: 40
            },
            // We would ideally populate fish here if we had the IDs handy, 
            // but for now we'll just set the tank and name.
        };
    } else if (type === 'planted') {
        template = {
            ...template,
            name: 'Planted Aquascape',
            tank: {
                id: 'tank-40-breeder',
                name: '40 Gallon Breeder',
                dimensions: { length: 36, width: 18, height: 16 },
                volumeGallons: 40,
                volumeLiters: 151,
                shape: 'rectangular',
                material: 'glass',
                price: 100
            }
        };
    } else if (type === 'cichlid') {
        template = {
            ...template,
            name: 'Cichlid Rock Tank',
            tank: {
                id: 'tank-55',
                name: '55 Gallon Standard',
                dimensions: { length: 48, width: 13, height: 21 },
                volumeGallons: 55,
                volumeLiters: 208,
                shape: 'rectangular',
                material: 'glass',
                price: 150
            }
        };
    }

    // Load the template
    // We need to cast to AquariumBuild because our partial is missing some deep props 
    // that would normally be there, but loadBuild handles replacing state.
    // Ideally we'd have a proper factory.
    loadBuild(template as AquariumBuild);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
            <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Start Your Build</h2>
                <p className="text-slate-500">Choose a starting point for your new aquarium project.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
                className="p-6 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group border-2 border-transparent"
                onClick={() => applyTemplate('community')}
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Fish className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Community Tank</h3>
                        <p className="text-sm text-slate-500">A peaceful 20-gallon setup perfect for beginners.</p>
                    </div>
                </div>
            </Card>

            <Card 
                className="p-6 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group border-2 border-transparent"
                onClick={() => applyTemplate('planted')}
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Planted Tank</h3>
                        <p className="text-sm text-slate-500">40-gallon breeder focused on lush plant growth.</p>
                    </div>
                </div>
            </Card>

            <Card 
                className="p-6 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group border-2 border-transparent"
                onClick={() => applyTemplate('cichlid')}
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Mountain className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Cichlid Tank</h3>
                        <p className="text-sm text-slate-500">55-gallon setup for larger, semi-aggressive fish.</p>
                    </div>
                </div>
            </Card>

            <Card 
                className="p-6 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group border-2 border-transparent"
                onClick={onClose}
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 text-slate-600 rounded-full group-hover:bg-slate-600 group-hover:text-white transition-colors">
                        <PenTool className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Custom Build</h3>
                        <p className="text-sm text-slate-500">Start from scratch and choose every component.</p>
                    </div>
                </div>
            </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
