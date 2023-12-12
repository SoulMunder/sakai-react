import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            Token: string;
            name: string;
            unique_name: string;
            role: string;
            Cliente: string;
            AccesoFacturacion: boolean | undefined;
            AccesoCancelaciones: boolean | undefined;
            AccesoEdicionAddenda: boolean | undefined;
            AccesoEDI: boolean | undefined;
            AccesoCertificados: boolean;
            AccesoTickets: boolean | undefined;
            nbf: number;
            exp: number;
            iat: number;
        };
    }
}