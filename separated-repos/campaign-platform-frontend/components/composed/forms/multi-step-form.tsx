"use client";

import { useState, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface FormStep {
  title: string;
  description: string;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: FormStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  canGoNext?: boolean;
}

export function MultiStepForm({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting = false,
  canGoNext = true,
}: MultiStepFormProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <span className="text-sm text-muted-foreground">
              Etapa {currentStep + 1} de {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps[currentStep].content}

          <Separator />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstStep || isSubmitting}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            {isLastStep ? (
              <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Finalizar"}
              </Button>
            ) : (
              <Button type="button" onClick={onNext} disabled={!canGoNext || isSubmitting}>
                Próximo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
