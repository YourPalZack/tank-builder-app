'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { WhereToBuySection } from '@/components/WhereToBuySection';
import { 
  getEquipmentPurchaseLinks, 
  getFishPurchaseLinks, 
  getPlantPurchaseLinks, 
  getSubstratePurchaseLinks, 
  getInvertebratePurchaseLinks,
  getTankPurchaseLinks
} from '@/lib/purchasing';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { Equipment } from '@/types';

export default function ShoppingListPage() {
  const { tank, fish, inverts, plants, equipment, substrate } = useBuildStore();

  const hasItems = tank || fish.length > 0 || inverts.length > 0 || plants.length > 0 || substrate || 
    Object.values(equipment).some(e => Array.isArray(e) ? e.length > 0 : !!e);

  if (!hasItems) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Link href="/" className="flex items-center text-slate-500 hover:text-teal-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Builder
        </Link>
        <Card className="p-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Shopping List is Empty</h1>
          <p className="text-slate-500 mb-6">Start building your aquarium to see items here.</p>
          <Link href="/" className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Go to Builder
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-slate-500 hover:text-teal-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Builder
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print List
        </button>
      </div>

      <div className="space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-900">Shopping List</h1>
          <p className="text-slate-500 mt-1">Purchase links for your aquarium build.</p>
        </div>

        {/* Tank */}
        {tank && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              Tank
            </h2>
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{tank.name}</h3>
                  <p className="text-slate-500">{tank.dimensions.length}&quot; x {tank.dimensions.width}&quot; x {tank.dimensions.height}&quot; • {tank.volumeGallons} gal</p>
                </div>
                <span className="font-mono font-bold text-teal-700">${tank.price}</span>
              </div>
              <WhereToBuySection purchaseLinks={getTankPurchaseLinks(tank)} title="Buy Tank" />
            </Card>
          </section>
        )}

        {/* Equipment */}
        {(equipment.filter || equipment.heater || equipment.light || equipment.co2 || equipment.airPump || equipment.other.length > 0) && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Equipment</h2>
            <div className="grid gap-4">
              {[
                equipment.filter, 
                equipment.heater, 
                equipment.light, 
                equipment.co2, 
                equipment.airPump, 
                ...equipment.other
              ].filter(Boolean).map((item) => {
                const eq = item as Equipment;
                return (
                  <Card key={eq.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{eq.name}</h3>
                        <p className="text-slate-500">{eq.brand} • {eq.category}</p>
                      </div>
                      <span className="font-mono font-bold text-teal-700">${eq.price}</span>
                    </div>
                    <WhereToBuySection purchaseLinks={getEquipmentPurchaseLinks(eq)} title={`Buy ${eq.category}`} />
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Substrate */}
        {substrate && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Substrate</h2>
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{substrate.name}</h3>
                  <p className="text-slate-500">{substrate.brand} • {substrate.type}</p>
                </div>
                <span className="font-mono font-bold text-teal-700">${substrate.price}</span>
              </div>
              <WhereToBuySection purchaseLinks={getSubstratePurchaseLinks(substrate)} title="Buy Substrate" />
            </Card>
          </section>
        )}

        {/* Plants */}
        {plants.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Plants</h2>
            <div className="grid gap-4">
              {plants.map(({ item, quantity }) => (
                <Card key={item.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{item.commonName} (x{quantity})</h3>
                      <p className="text-slate-500 italic">{item.scientificName}</p>
                    </div>
                    <span className="font-mono font-bold text-teal-700">${(item.price * quantity).toFixed(2)}</span>
                  </div>
                  <WhereToBuySection purchaseLinks={getPlantPurchaseLinks(item)} title="Buy Plants" />
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Fish & Inverts */}
        {(fish.length > 0 || inverts.length > 0) && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Livestock</h2>
            <div className="grid gap-4">
              {fish.map(({ item, quantity }) => (
                <Card key={item.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{item.commonName} (x{quantity})</h3>
                      <p className="text-slate-500 italic">{item.scientificName}</p>
                    </div>
                    <span className="font-mono font-bold text-teal-700">${(item.price * quantity).toFixed(2)}</span>
                  </div>
                  <WhereToBuySection purchaseLinks={getFishPurchaseLinks(item)} title="Buy Fish" />
                </Card>
              ))}
              {inverts.map(({ item, quantity }) => (
                <Card key={item.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{item.commonName} (x{quantity})</h3>
                      <p className="text-slate-500 italic">{item.scientificName}</p>
                    </div>
                    <span className="font-mono font-bold text-teal-700">${(item.price * quantity).toFixed(2)}</span>
                  </div>
                  <WhereToBuySection purchaseLinks={getInvertebratePurchaseLinks(item)} title="Buy Invertebrates" />
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
