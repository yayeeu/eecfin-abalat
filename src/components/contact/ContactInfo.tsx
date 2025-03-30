
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div>
      <h2 className="section-title mb-8">Get in Touch</h2>
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="bg-eecfin-navy/10 p-3 rounded-full mr-4">
            <MapPin className="h-6 w-6 text-eecfin-navy" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Church Location</h3>
            <p className="text-gray-600">
              Keinulaudankuja 4 B<br />
              00940 Helsinki, Finland
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-eecfin-navy/10 p-3 rounded-full mr-4">
            <Mail className="h-6 w-6 text-eecfin-navy" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Email Us</h3>
            <p className="text-gray-600">info@eecfin.org</p>
            <p className="text-gray-600">pastor@eecfin.org</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-eecfin-navy/10 p-3 rounded-full mr-4">
            <Phone className="h-6 w-6 text-eecfin-navy" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Call Us</h3>
            <p className="text-gray-600">+358 XX XXX XXXX</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-eecfin-navy/10 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-eecfin-navy" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Service Times</h3>
            <p className="text-gray-600">
              Sunday: 10:00 AM - 12:00 PM<br />
              Wednesday: 6:30 PM - 8:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
