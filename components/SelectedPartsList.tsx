'use client';

import { useBuildStore } from '@/store/useBuildStore';
import { Trash2, Plus, Minus, Box, Fish, Sprout, Shell, Layers, ShoppingBag, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { 
  getFishPurchaseLinks, 
  getPlantPurchaseLinks, 
  getSubstratePurchaseLinks, 
  getInvertebratePurchaseLinks,
  getTankPurchaseLinks
} from '@/lib/purchasing';

export function SelectedPartsList() {
  const { 
    tank, fish, inverts, plants, substrate,
    removeFish, updateFishQuantity,
    removeInvert, updateInvertQuantity,
    removePlant, updatePlantQuantity,
    setTank, setSubstrate
  } = useBuildStore();

  const hasItems = tank || fish.length > 0 || inverts.length > 0 || plants.length > 0 || substrate;

  if (!hasItems) {
    return (
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p>Your build is empty. Start by adding a tank or inhabitants!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/shopping-list" className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700">
           <ShoppingBag className="w-4 h-4" /> View Shopping List
        </Link>
      </div>

      {/* Tank Section */}
      {tank && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Box className="w-4 h-4" /> Tank
          </h3>
          <Card className="p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                Img
              </div>
              <div>
                <h4 className="font-medium text-slate-900">{tank.name}</h4>
                <p className="text-sm text-slate-500">{tank.dimensions.length}&quot; x {tank.dimensions.width}&quot; x {tank.dimensions.height}&quot;</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-mono font-medium text-slate-700">
                ${tank.price}
              </div>
              {getTankPurchaseLinks(tank)[0]?.url && (
                <a 
                  href={getTankPurchaseLinks(tank)[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 p-1"
                  title="Buy Now"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button 
                onClick={() => setTank(null)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </section>
      )}

      {/* Fish Section */}
      {fish.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Fish className="w-4 h-4" /> Fish
          </h3>
          <div className="space-y-2">
            {fish.map((item) => (
              <Card key={item.item.id} className="p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                    Img
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{item.item.commonName}</h4>
                    <p className="text-xs text-slate-500">${item.item.price} each</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-md">
                    <button 
                      onClick={() => updateFishQuantity(item.item.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-50 text-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-sm font-medium min-w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateFishQuantity(item.item.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-50 text-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="font-mono font-medium text-slate-700 w-16 text-right">
                    ${(item.item.price * item.quantity).toFixed(2)}
                  </div>
                  {getFishPurchaseLinks(item.item)[0]?.url && (
                    <a 
                      href={getFishPurchaseLinks(item.item)[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 p-1"
                      title="Buy Now"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button 
                    onClick={() => removeFish(item.item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Inverts Section */}
      {inverts.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shell className="w-4 h-4" /> Invertebrates
          </h3>
          <div className="space-y-2">
            {inverts.map((item) => (
              <Card key={item.item.id} className="p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                    Img
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{item.item.commonName}</h4>
                    <p className="text-xs text-slate-500">${item.item.price} each</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-md">
                    <button 
                      onClick={() => updateInvertQuantity(item.item.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-50 text-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-sm font-medium min-w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateInvertQuantity(item.item.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-50 text-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="font-mono font-medium text-slate-700 w-16 text-right">
                    ${(item.item.price * item.quantity).toFixed(2)}
                  </div>
                  {getInvertebratePurchaseLinks(item.item)[0]?.url && (
                    <a 
                      href={getInvertebratePurchaseLinks(item.item)[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 p-1"
                      title="Buy Now"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button 
                    onClick={() => removeInvert(item.item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Plants Section */}
      {plants.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sprout className="w-4 h-4" /> Plants
          </h3>
          <div className="space-y-2">
            {plants.map((item) => (
              <Card key={item.item.id} className="p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                    Img
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{item.item.commonName}</h4>
                    <p className="text-xs text-slate-500">${item.item.price} each</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-md">
                    <button 
                      onClick={() => updatePlantQuantity(item.item.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-50 text-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-sm font-medium min-w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updatePlantQuantity(item.item.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-50 text-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="font-mono font-medium text-slate-700 w-16 text-right">
                    ${(item.item.price * item.quantity).toFixed(2)}
                  </div>
                  {getPlantPurchaseLinks(item.item)[0]?.url && (
                    <a 
                      href={getPlantPurchaseLinks(item.item)[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 p-1"
                      title="Buy Now"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button 
                    onClick={() => removePlant(item.item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Substrate Section */}
      {substrate && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Substrate
          </h3>
          <Card className="p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                Img
              </div>
              <div>
                <h4 className="font-medium text-slate-900">{substrate.name}</h4>
                <p className="text-sm text-slate-500">{substrate.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-mono font-medium text-slate-700">
                ${substrate.price}
              </div>
              {getSubstratePurchaseLinks(substrate)[0]?.url && (
                <a 
                  href={getSubstratePurchaseLinks(substrate)[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 p-1"
                  title="Buy Now"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button 
                onClick={() => setSubstrate(null)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
