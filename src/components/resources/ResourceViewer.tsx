"use client";

import React from "react";
import { ClientIntakeForm } from "./templates/ClientIntakeForm";
import { ProtocolBuilder } from "./templates/ProtocolBuilder";
import { PricingCalculator } from "./templates/PricingCalculator";
import { FileQuestion } from "lucide-react";

// Map of resource types to their components
const RESOURCE_COMPONENTS: Record<string, React.FC<{ resourceId: string }>> = {
    "client-intake-form": () => <ClientIntakeForm />,
    "protocol-builder": () => <ProtocolBuilder />,
    "pricing-calculator": () => <PricingCalculator />,
};

interface ResourceViewerProps {
    resourceType: string;
    resourceId: string;
    title?: string;
}

/**
 * ResourceViewer - Renders the appropriate interactive resource component
 * based on the resource type. Used to display course materials.
 */
export function ResourceViewer({ resourceType, resourceId, title }: ResourceViewerProps) {
    const Component = RESOURCE_COMPONENTS[resourceType];

    if (!Component) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <FileQuestion className="w-16 h-16 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium">Resource Not Found</h3>
                <p className="text-sm mt-1">The resource type "{resourceType}" is not available.</p>
            </div>
        );
    }

    return (
        <div className="py-6">
            {title && (
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
            )}
            <Component resourceId={resourceId} />
        </div>
    );
}

export default ResourceViewer;
