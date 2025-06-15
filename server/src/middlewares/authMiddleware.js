import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1]; // Captura só o token

	if (!token) {
		return res.status(401).json({error: "Token não fornecido"});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(403).json({error: "Token inválido ou expirado"});
	}
}
