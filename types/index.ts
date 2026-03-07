export interface PlanItem {
  placeId: string;
  duration: number; // Duration in minutes
  notes?: string[];
}

export interface Plan {
  id: string;
  nombre: string;
  items: PlanItem[];
  // Deprecated but kept for type compatibility during migration if needed, though we will try to move away from it
  placeIds?: string[];
}
