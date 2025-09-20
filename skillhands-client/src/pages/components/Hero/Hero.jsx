import React from "react";
import { steps } from "@/data/getData";
import StepItem from "./StepItem";

export default function Hero() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Getting help for your home has never been easier. Four simple steps
            to quality service.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <StepItem
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
