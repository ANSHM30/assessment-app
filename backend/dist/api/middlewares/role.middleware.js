"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCandidate = requireCandidate;
function requireCandidate(req, res, next) {
    const role = req.user?.role?.toUpperCase();
    if (role !== "CANDIDATE") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
}
