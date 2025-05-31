'use client';
import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

// Generate 50 mock panel statuses


interface StatusTableProps {
  data: {
    panelStatuses: { id: number; status: string }[];
    handleSetCurrentPanel: (id: number) => void;
  };
}

export default function StatusTable({ data }: StatusTableProps) {
  const { panelStatuses, handleSetCurrentPanel } = data;

  return (
    <div className="grid grid-cols-4 gap-3 p-3">
      {panelStatuses.map((panel) => (
        <Card key={panel.id} className="flex flex-col items-center justify-center p-2 text-xs hover:cursor-pointer hover:bg-green-700" onClick={() => {
          handleSetCurrentPanel(panel.id);
        }}>
          <CardDescription className="text-center">
            #{panel.id}
          </CardDescription>
          <Badge variant={panel.status === "online" ? "default" : "destructive"}>
            {panel.status}
          </Badge>
        </Card>
      ))}
    </div>
  );
}

