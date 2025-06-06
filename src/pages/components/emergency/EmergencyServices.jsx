import { AlertTriangle } from "lucide-react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PrimaryButton from "@/components/PrimaryButton";
import { emergencyServices } from "@/data/getData";

export default function EmergencyServices() {
  return (
    <section className="py-8 bg-red-50 border-l-4 border-red-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="font-heading text-2xl text-red-800">
            Emergency Services Available 24/7
          </h2>
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyServices.map((service, index) => (
            <Card
              key={index}
              className="border-red-200 hover:border-red-400 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <service.icon className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {service.description}
                </p>
                <Badge variant="destructive">{service.response}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <PrimaryButton
            onClick={() => (window.location.href = "/request?urgent=true")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Get Emergency Help Now
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
