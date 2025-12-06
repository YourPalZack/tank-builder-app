'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Card } from '@/components/ui/Card';
import { useBuildStore } from '@/store/useBuildStore';
import { Fish, Leaf, Mountain, PenTool } from 'lucide-react';
import { AquariumBuild } from '@/types';

interface BuildWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuildWizardModal({ isOpen, onClose }: BuildWizardModalProps) {
  const { loadBuild } = useBuildStore();

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center mb-2">Start Your Build</DialogTitle>
          <p className="text-center text-slate-500 mb-8">Choose a starting point for your new aquarium.</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="p-6 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group"
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
            className="p-6 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group"
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
            className="p-6 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group"
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
            className="p-6 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group"
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
      </DialogContent>
    </Dialog>
  );
}
