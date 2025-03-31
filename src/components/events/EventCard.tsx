
import React from 'react';
import { Clock, MapPin, ExternalLink } from 'lucide-react';
import { Event } from "@/lib/googleCalendar";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const handleOpenImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };
  
  const openGoogleMaps = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="bg-eecfin-navy text-white p-4 md:w-24 flex flex-row md:flex-col justify-between md:justify-center items-center">
          <div className="text-center">
            <span className="text-2xl font-bold">{event.day}</span>
            <div className="text-xs uppercase">{event.month.substring(0, 3)}</div>
          </div>
          <div className="md:mt-1 text-xs">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        
        <div className="flex-grow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-3/4">
              <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                <span>{event.location}</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{event.description}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-eecfin-navy hover:bg-eecfin-navy/80">
                  Add to Calendar
                </Button>
                {event.location && event.location !== 'Location not specified' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => openGoogleMaps(event.location)}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Directions
                  </Button>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-1/4">
              {event.image && (
                <div 
                  className="h-32 cursor-pointer rounded overflow-hidden" 
                  onClick={() => handleOpenImage(event.image!)}
                >
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="h-full w-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
