import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function MapView() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-placeholder');

  return (
    <Card className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg">
      {mapImage && (
        <Image
          src={mapImage.imageUrl}
          alt={mapImage.description}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          data-ai-hint={mapImage.imageHint}
        />
      )}
       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </Card>
  );
}
