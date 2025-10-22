import {Request, Response, NextFunction } from "express";
import { Roles } from "../constants/role";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  roles?: string[];
}

const UserRoles = {
   User: Roles.User,
   Admin: Roles.Admin,
}

const checkRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req?.user && !req?.roles) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const rolesArray = [...allowedRoles];
        const rolesFound = req.roles!.map((role: string) => rolesArray.includes(role)).find((val: boolean) => val === true);

        if (!rolesFound) {
            return res.status(403).json({ message: "Forbidden: You don't have enough permission to access this resource" });
        }

        next();
    };
};

const role = {
    UserRoles,
    checkRole,
};

export default role;
