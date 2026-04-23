import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import * as admin from "firebase-admin";

admin.initializeApp();

// ⚙️ Configuración global
setGlobalOptions({ maxInstances: 10 });

/**
 * 🚀 FUNCIÓN: Crear usuario desde Admin
 * ✔ No cierra sesión del admin
 * ✔ Crea en Auth
 * ✔ Guarda en Firestore
 */
export const createUserByAdmin = onRequest(async (req: any, res: any) => {
  try {
    // 🔒 Solo permitir POST
    if (req.method !== "POST") {
      return res.status(405).send("Método no permitido");
    }

    const { email, password, nombre, apellido, rol } = req.body;

    // 🔥 Validación básica
    if (!email || !password || !nombre || !apellido || !rol) {
      return res.status(400).json({
        error: "Faltan campos obligatorios",
      });
    }

    // 🔐 Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // 💾 Guardar datos en Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      nombre,
      apellido,
      email,
      rol,
      activo: true,
      createdAt: new Date(),
    });

    logger.info("Usuario creado:", userRecord.uid);

    return res.status(200).json({
      success: true,
      uid: userRecord.uid,
    });

  } catch (error: any) {
    logger.error("Error creando usuario:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
});