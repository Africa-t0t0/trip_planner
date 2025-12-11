export interface Place {
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

export const PLACES: Place[] = [
    {
        id: "1",
        nombre: "Templo Bahá'í de Sudamérica",
        coordenadas: {
            latitud: -33.472222,
            longitud: -70.509167
        },
        comunas: ["Peñalolén"],
        estacionamiento: "Sí, gratuito (dentro del recinto)",
        descripcion: "Un templo de arquitectura premiada con forma de flor, rodeado de jardines y espejos de agua. Ofrece una vista panorámica espectacular de Santiago y la cordillera.",
        tips: "La mejor hora es el atardecer para ver la puesta de sol sobre la ciudad. Cierra los lunes.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Templo_Bah%C3%A1%27%C3%AD_de_Sudam%C3%A9rica%2C_Santiago_20200208_04.jpg/2560px-Templo_Bah%C3%A1%27%C3%AD_de_Sudam%C3%A9rica%2C_Santiago_20200208_04.jpg"
    },
    {
        id: "2",
        nombre: "Cerro San Cristóbal (Acceso Teleférico)",
        coordenadas: {
            latitud: -33.4206,
            longitud: -70.6344
        },
        comunas: ["Providencia", "Recoleta"],
        estacionamiento: "Sí, por acceso Pedro de Valdivia Norte (pagado)",
        descripcion: "El pulmón verde más grande de Santiago. Pueden subir en Teleférico para tener vistas aéreas, visitar el Santuario de la Inmaculada Concepción y bajar en Funicular hacia Bellavista.",
        tips: "Busca el 'Jardín Japonés' dentro del cerro, es un sector renovado muy fotogénico y tranquilo.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Santuario_de_la_Inmaculada_Concepci%C3%B3n%2C_Cerro_San_Crist%C3%B3bal_%2825059260397%29.jpg/2560px-Santuario_de_la_Inmaculada_Concepci%C3%B3n%2C_Cerro_San_Crist%C3%B3bal_%2825059260397%29.jpg"
    },
    {
        id: "3",
        nombre: "Embalse El Yeso",
        coordenadas: {
            latitud: -33.65,
            longitud: -70.066667
        },
        comunas: ["San José de Maipo"],
        estacionamiento: "Sí, zonas habilitadas en el camino (tierra/natural)",
        descripcion: "El clásico roadtrip de montaña. Una represa de agua color turquesa rodeada de montañas nevadas (o rocosas en verano). Es naturaleza imponente y aire puro.",
        tips: "Lleva abrigo (corta viento) aunque sea verano, arriba corre mucho viento. El camino final es de tierra.",
        imageUrl: "https://www.cascadalodge.cl/wp-content/uploads/2025/09/embalse-el-yeso.jpg"
    },
    {
        id: "4",
        nombre: "Termas Valle de Colina",
        coordenadas: {
            latitud: -33.3167,
            longitud: -70.0833
        },
        comunas: ["San José de Maipo"],
        estacionamiento: "Sí, en el recinto (tierra)",
        descripcion: "Pozones naturales de agua termal escalonados en la ladera de la montaña, con vista al Volcán San José. Es mucho más rústico y natural que otras termas.",
        tips: "Lleva efectivo, a veces no hay señal para tarjetas. El regreso de noche puede ser cansador.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Termas_Valle_de_Colina.jpg/1280px-Termas_Valle_de_Colina.jpg"
    },
    {
        id: "5",
        nombre: "Cerro Santa Lucía",
        coordenadas: {
            latitud: -33.4378,
            longitud: -70.6436
        },
        comunas: ["Santiago"],
        estacionamiento: "No propio (usar estacionamiento Saba en calle Victoria Subercaseaux)",
        descripcion: "Un parque urbano histórico con arquitectura neoclásica, fuentes, castillos y miradores. Es un oasis bonito y elegante en medio del centro ruidoso.",
        tips: "Suban hasta la 'Torre Mirador' en la cima para la foto clásica del centro.",
        imageUrl: "https://www.laguiadesantiago.com/wp-content/uploads/2017/08/cerro-santa-lucia-santiago-chile.jpg"
    },
    {
        id: "6",
        nombre: "Barrio Lastarria",
        coordenadas: {
            latitud: -33.4376,
            longitud: -70.6397
        },
        comunas: ["Santiago"],
        estacionamiento: "Sí, pagado (varios subterráneos, como en calle José Victorino Lastarria 70)",
        descripcion: "Barrio bohemio y patrimonial con arquitectura europea, cafés, restaurantes y el cine El Biógrafo. Perfecto para caminar y sentir la vibra cultural de la ciudad.",
        tips: "Visita el MAVI (Museo de Artes Visuales) o camina hacia el Parque Forestal que está al lado. Ideal para ir a comer después de visitar el Santa Lucía.",
        imageUrl: "https://www.laguiadesantiago.com/wp-content/uploads/2022/06/lastarria-santiago-2022.jpg"
    },
    {
        id: "7",
        nombre: "Pueblito Los Dominicos",
        coordenadas: {
            latitud: -33.4033,
            longitud: -70.5392
        },
        comunas: ["Las Condes"],
        estacionamiento: "Sí, pagado (acceso por calle Patagonia)",
        descripcion: "Centro artesanal construido como un antiguo pueblo colonial chileno, con iglesia, pasajes de tierra y talleres de artistas (joyas, cuero, lapislázuli).",
        tips: "Es el mejor lugar si ella quiere comprar recuerdos de calidad o ver artesanía típica chilena.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Pueblito_Los_Dominicos_-_Santiago%2C_Chile.jpg/1280px-Pueblito_Los_Dominicos_-_Santiago%2C_Chile.jpg"
    },
    {
        id: "8",
        nombre: "Parque Bicentenario",
        coordenadas: {
            latitud: -33.4011,
            longitud: -70.5764
        },
        comunas: ["Vitacura"],
        estacionamiento: "Sí, gratuito (bordea el parque)",
        descripcion: "Uno de los parques más modernos de Santiago. Tiene lagunas con flamencos, peces koi, cisnes de cuello negro y amplias áreas verdes impecables.",
        tips: "Compren un helado o café en el restaurant 'Mestizo' y caminen por el borde de la laguna.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Parque_Bicentenario_de_Vitacura.jpg/1280px-Parque_Bicentenario_de_Vitacura.jpg"
    },
    {
        id: "9",
        nombre: "Sky Costanera",
        coordenadas: {
            latitud: -33.4172,
            longitud: -70.6061
        },
        comunas: ["Providencia"],
        estacionamiento: "Sí, en Mall Costanera Center",
        descripcion: "El mirador más alto de Sudamérica (pisos 61 y 62). Ofrece una vista en 360° de toda la ciudad y la cordillera.",
        tips: "Sube justo antes del atardecer para ver la ciudad de día, la puesta de sol y luego de noche.",
        imageUrl: "https://images.myguide-cdn.com/chile/companies/sky-costanera/large/sky-costanera-2352408.jpg"
    },
    {
        id: "10",
        nombre: "Viña Concha y Toro",
        coordenadas: {
            latitud: -33.6464,
            longitud: -70.5797
        },
        comunas: ["Pirque"],
        estacionamiento: "Sí, gratuito para visitas",
        descripcion: "Una de las viñas más famosas del mundo. El tour incluye paseo por los jardines de la casona de verano, viñedos y la famosa bodega del 'Casillero del Diablo'.",
        tips: "Reserva el tour con anticipación en su web.",
        imageUrl: "https://www.laguiadesantiago.com/wp-content/uploads/2022/06/vinoteca-santiago-chile.jpg"
    }
];
