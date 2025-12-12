import { ObjectId } from 'mongodb';

export interface Place {
    _id?: ObjectId; // MongoDB document ID (optional for inserts)
    id: string;
    nombre: string;
    coordenadas: {
        latitud: number;
        longitud: number;
    };
    comunas: string[];
    estacionamiento: string;
    descripcion: string;
    tips: string;
    imageUrl: string;
}

