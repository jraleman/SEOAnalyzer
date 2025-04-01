import { Card, CardContent } from '@/components/ui/card';

export default function LoadingState() {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="shimmer h-6 w-48 rounded"></div>
          <div className="shimmer h-4 w-full rounded"></div>
          <div className="shimmer h-4 w-3/4 rounded"></div>
          <div className="shimmer h-32 w-full rounded"></div>
          <div className="shimmer h-24 w-full rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}
