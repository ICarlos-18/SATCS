import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";

import { User } from "../types";

/* =========================
   👥 USERS
========================= */

// 🔹 Obtener todos
export const getUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<User, "id">),
  }));
};

// 🔥 Obtener por email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0];
    return {
      id: docData.id,
      ...(docData.data() as Omit<User, "id">),
    };
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
};

// 🔴 Tiempo real USERS
export const listenUsers = (callback: (data: User[]) => void) => {
  return onSnapshot(collection(db, "users"), (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));
    callback(users);
  });
};

/* =========================
   📋 TASKS
========================= */

export const getTasks = async () => {
  const snapshot = await getDocs(collection(db, "tasks"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const listenTasks = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, "tasks"), (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tasks);
  });
};

/* =========================
   📢 ANNOUNCEMENTS
========================= */

export const getAnnouncements = async () => {
  const snapshot = await getDocs(collection(db, "announcements"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const listenAnnouncements = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, "announcements"), (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};

/* =========================
   ➕ TASKS CRUD
========================= */

export const addTask = async (task: any) => {
  await addDoc(collection(db, "tasks"), task);
};

export const updateTask = async (id: string, data: any) => {
  await updateDoc(doc(db, "tasks", id), data);
};

export const deleteTask = async (id: string) => {
  await deleteDoc(doc(db, "tasks", id));
};

/* =========================
   👤 USERS CRUD (🔥 IMPORTANTE)
========================= */

// 🔥 CREAR USUARIO (FLUJO PROFESIONAL)
export const addUser = async (user: any) => {
  await addDoc(collection(db, "users"), {
    ...user,
    activo: true,
    needsPassword: true, // 🔥 CLAVE DEL SISTEMA
    createdAt: new Date()
  });
};

export const updateUser = async (id: string, data: any) => {
  await updateDoc(doc(db, "users", id), data);
};

export const deleteUser = async (id: string) => {
  await deleteDoc(doc(db, "users", id));
};

/* =========================
   📢 ANNOUNCEMENTS CRUD
========================= */

export const addAnnouncement = async (data: any) => {
  await addDoc(collection(db, "announcements"), data);
};

export const deleteAnnouncement = async (id: string) => {
  await deleteDoc(doc(db, "announcements", id));
};