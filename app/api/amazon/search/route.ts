import { NextResponse } from 'next/server';
// @ts-expect-error - amazon-paapi does not have types
import amazonPaapi from 'amazon-paapi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const category = searchParams.get('category') || 'All';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const commonParams = {
    AccessKey: process.env.AMAZON_ACCESS_KEY,
    SecretKey: process.env.AMAZON_SECRET_KEY,
    PartnerTag: process.env.AMAZON_PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.com', // Default to US
  };

  if (!commonParams.AccessKey || !commonParams.SecretKey || !commonParams.PartnerTag) {
    // For development/demo purposes, if no keys are present, return mock data or error
    // But strictly speaking, we should return error.
    console.error('Amazon API credentials missing');
    return NextResponse.json({ 
      error: 'Amazon API configuration missing. Please set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, and AMAZON_PARTNER_TAG in .env.local' 
    }, { status: 500 });
  }

  // Map internal categories to Amazon SearchIndex if needed
  // For now, we'll default to 'PetSupplies' for better relevance if category is generic
  const searchIndex = category === 'All' ? 'PetSupplies' : category;

  const requestParameters = {
    Keywords: query,
    SearchIndex: searchIndex,
    ItemCount: 10,
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'ItemInfo.Features',
      'ItemInfo.ProductInfo',
      'Offers.Listings.Price',
      'Offers.Listings.DeliveryInfo.IsPrime',
    ],
  };

  try {
    const data = await amazonPaapi.SearchItems(commonParams, requestParameters);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Amazon API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch from Amazon';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
