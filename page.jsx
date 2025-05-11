'use client';

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, ShieldCheck, UserCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would be fetched based on params.id
const mockAuctionDetails = {
  id: '1',
  title: 'Vintage Leather Briefcase',
  description: 'A beautifully crafted vintage leather briefcase, perfect for the discerning professional. Made from full-grain Italian leather, this briefcase features solid brass hardware, multiple compartments for organization, and a timeless design that will only get better with age. Ideal for carrying laptops up to 15 inches, documents, and other essentials.',
  longDescription: "This exquisite vintage leather briefcase is a testament to timeless craftsmanship and enduring style. Sourced from a private collection, it boasts rich, patinated full-grain Italian leather that tells a story of its own. The meticulous stitching and robust solid brass hardware ensure durability for years to come. Internally, it's thoughtfully designed with multiple compartments, including a padded sleeve for a 15-inch laptop, several pockets for documents, pens, and business cards, and a secure zippered section for valuables. The classic flap-over design with a secure clasp closure adds to its sophisticated appeal. Whether for daily professional use or as a collector's item, this briefcase combines functionality with an undeniable aura of elegance. It has been carefully maintained and is in excellent vintage condition, with minor signs of wear that add to its character.",
  imageUrl: 'https://picsum.photos/seed/briefcase_detail/800/600',
  currentBid: 220,
  startingBid: 50,
  bidIncrement: 10,
  endTime: '2 days, 5 hours, 30 minutes',
  seller: 'ClassicWares Emporium',
  bidHistory: [
    { user: 'BidderX', amount: 220, time: '2 hours ago' },
    { user: 'CollectorCarl', amount: 210, time: '5 hours ago' },
    { user: 'Style Maven', amount: 200, time: '1 day ago' },
  ],
  category: 'Fashion & Accessories',
  condition: 'Excellent Vintage',
  dataAiHint: 'leather bag detail'
};

export default function AuctionDetailPage({ params }) {
  const auction = mockAuctionDetails; // Use params.id to fetch actual data
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState('');
  const [bidHistory, setBidHistory] = useState(auction.bidHistory); // Local state for bid history

  const minBidAmount = auction.currentBid + auction.bidIncrement;

  const handleBidSubmit = (event) => {
    event.preventDefault();
    const parsedBidAmount = parseFloat(bidAmount);

    if (isNaN(parsedBidAmount) || parsedBidAmount < minBidAmount) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be at least $${minBidAmount.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }

    // Simulate getting current user (replace with actual auth logic)
    const currentUserData = localStorage.getItem("currentUser");
    const currentUser = currentUserData ? JSON.parse(currentUserData) : { fullName: "YourUser" };


    // Update bid history (simulated)
    const newBid = {
      user: currentUser.fullName || 'You', // Use a generic name if user is not logged in or name not available
      amount: parsedBidAmount,
      time: 'Just now' 
    };
    // Update currentBid on the auction object (locally)
    auction.currentBid = parsedBidAmount; 
    
    setBidHistory(prevHistory => [newBid, ...prevHistory]);


    toast({
      title: "Bid Placed Successfully!",
      description: (
        <>
          <p>Your bid of <span className="font-semibold">${parsedBidAmount.toLocaleString()}</span> for "{auction.title}" has been submitted.</p>
          <p className="text-xs mt-1">Minimum next bid is now <span className="font-semibold">${(parsedBidAmount + auction.bidIncrement).toLocaleString()}</span>.</p>
        </>
      ),
      variant: "default",
    });
    setBidAmount(''); // Clear input field
  };


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/auctions">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Auctions
        </Link>
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Image Section */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden shadow-lg">
            <div className="aspect-[4/3] relative w-full">
              <Image
                src={auction.imageUrl}
                alt={auction.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 67vw"
                data-ai-hint={auction.dataAiHint}
              />
            </div>
          </Card>
        </div>

        {/* Bidding and Info Section */}
        <div className="md:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">{auction.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Listed by: <span className="text-primary font-medium">{auction.seller}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Bid</p>
                <p className="text-3xl font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <p className="text-lg font-semibold text-foreground flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" /> {auction.endTime}
                </p>
              </div>
              
              <form className="space-y-3" onSubmit={handleBidSubmit}>
                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-foreground mb-1">Your Bid Amount (min. ${minBidAmount.toLocaleString()})</label>
                  <Input 
                    type="number" 
                    id="bidAmount" 
                    placeholder={`$${minBidAmount.toLocaleString()}`} 
                    className="bg-background" 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBidAmount}
                    step="0.01" // Allow decimal bids
                    required
                  />
                </div>
                <Button type="submit" className="w-full text-lg py-3" size="lg">Place Bid</Button>
              </form>
              
              <div className="text-xs text-muted-foreground">
                Starting Bid: ${auction.startingBid.toLocaleString()} | Bid Increment: ${auction.bidIncrement.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-green-600 mt-2">
                <ShieldCheck className="w-4 h-4 mr-1.5" /> Secure Bidding Platform
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Information Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold text-foreground">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{auction.longDescription || auction.description}</p>
            <div>
                <h4 className="font-medium text-foreground">Category:</h4>
                <p className="text-muted-foreground">{auction.category}</p>
            </div>
            <div>
                <h4 className="font-medium text-foreground">Condition:</h4>
                <p className="text-muted-foreground">{auction.condition}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>Bid History</CardTitle>
          </CardHeader>
          <CardContent>
            {bidHistory.length > 0 ? (
              <ul className="space-y-3 max-h-60 overflow-y-auto">
                {bidHistory.map((bid, index) => (
                  <li key={index} className="flex justify-between items-center text-sm p-2 bg-secondary rounded-md">
                    <span className="flex items-center">
                      <UserCircle className="w-4 h-4 mr-2 text-muted-foreground" /> 
                      {bid.user}
                    </span>
                    <div className="text-right">
                        <span className="font-semibold text-foreground">${bid.amount.toLocaleString()}</span>
                        <p className="text-xs text-muted-foreground">{bid.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No bids yet. Be the first!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Generate static paths for featured auctions if needed during build time
// export async function generateStaticParams() {
//   // In a real app, fetch all auction IDs
//   const mockIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
//   return mockIds.map((id) => ({
//     id: id,
//   }));
// }
