import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Info } from 'lucide-react';

interface PreviewTabsProps {
  url: string;
  pageTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  searchDate: string;
}

export default function PreviewTabs({
  url,
  pageTitle,
  metaDescription,
  metaKeywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  searchDate
}: PreviewTabsProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Previews</h2>
        
        <Tabs defaultValue="google">
          <TabsList className="mb-6 border-b border-gray-200 w-full flex flex-wrap">
            <TabsTrigger value="google" className="inline-flex items-center text-xs sm:text-sm">
              <FaGoogle className="mr-1" /> Google
            </TabsTrigger>
            <TabsTrigger value="facebook" className="inline-flex items-center text-xs sm:text-sm">
              <FaFacebook className="mr-1" /> Facebook
            </TabsTrigger>
            <TabsTrigger value="twitter" className="inline-flex items-center text-xs sm:text-sm">
              <FaTwitter className="mr-1" /> Twitter
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="google">
            <div className="max-w-2xl bg-white p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm text-gray-600 truncate max-w-full">{url}</div>
                  <h3 className="text-lg sm:text-xl text-blue-800 font-medium hover:underline cursor-pointer line-clamp-2">{pageTitle}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{metaDescription || "No description available"}</p>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    <span>{searchDate}</span> {metaKeywords && <span>— <span className="line-clamp-1">{metaKeywords}</span></span>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p className="flex items-center">
                <Info className="w-4 h-4 text-blue-600 mr-1" /> This shows how your page might appear in Google search results.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="facebook">
            <div className="max-w-md bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">Page Name</p>
                    <p className="text-xs text-gray-500">Sponsored · <FaGoogle className="inline" /></p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img 
                    src={ogImage || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&h=400'} 
                    className="object-cover w-full h-52" 
                    alt="Open Graph Image"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 uppercase truncate max-w-full">{url}</p>
                  <h3 className="font-bold text-gray-900 text-base line-clamp-2">{ogTitle || pageTitle}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mt-1">{ogDescription || metaDescription || "No description available"}</p>
                </div>
              </div>
              
              <div className="px-3 py-2 border-t border-gray-300 bg-gray-50">
                <button className="text-sm text-gray-600 font-medium">Learn More</button>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p className="flex items-center">
                <Info className="w-4 h-4 text-blue-600 mr-1" /> This shows how your page might appear when shared on Facebook.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="twitter">
            <div className="max-w-md bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <div className="flex">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="ml-2">
                    <p className="font-bold text-gray-900">Twitter User</p>
                    <p className="text-gray-500">@twitteruser</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-900">Check out this website:</p>
              </div>
              
              <div className="border border-gray-200 rounded m-3 overflow-hidden">
                <div className="bg-gray-200">
                  <img 
                    src={twitterImage || ogImage || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&h=400'} 
                    className="w-full h-48 object-cover" 
                    alt="Twitter Card Image"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-base line-clamp-1">{twitterTitle || ogTitle || pageTitle}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{twitterDescription || ogDescription || metaDescription || "No description available"}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-full">{url}</p>
                </div>
              </div>
              
              <div className="px-3 py-2 flex items-center justify-around border-t border-gray-200">
                <button className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p className="flex items-center">
                <Info className="w-4 h-4 text-blue-600 mr-1" /> This shows how your page might appear when shared on Twitter.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
