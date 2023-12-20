interface Usuario {
    Id: number | null;
    UserName: string;
    Password: string | null;
    passTemp: string | null;
    Activo: boolean;
    FechaAlta: Date;
    RolId: number | null;
    ClienteId?: number | null;
    Correo: string;
}

interface UserCreate {
    UserName: string;
    Password: string | null;
    FechaAlta: Date;
    RolId: number | null;
    ClienteId?: number | null;
    Correo: string;
}

interface UserEdit {
    Id: number | null;
    UserName: string;
    Password: string | null;
    RolId: number | null;
    Activo: boolean;
    Correo: string;
}
