export declare const config: {
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    admin: {
        email: string;
        password: string;
    };
    cors: {
        origin: string[];
    };
    server: {
        port: number;
    };
};
