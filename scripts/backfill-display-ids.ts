import { PrismaClient } from "@prisma/client";

// Charge .env (Node 22+) pour un usage local sans flag supplémentaire.
try {
  (process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }).loadEnvFile?.();
} catch {
  // Pas de fichier .env : on s'appuie sur l'environnement ambiant.
}

/**
 * Attribue un identifiant lisible séquentiel (#1, #2, ...) aux tâches existantes
 * qui n'en ont pas encore, par utilisateur et dans l'ordre de création, puis
 * synchronise le compteur `taskSeq` de chaque utilisateur.
 */
async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({ select: { id: true, taskSeq: true } });
    let updatedTasks = 0;

    for (const user of users) {
      const tasks = await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
        select: { id: true, displayId: true },
      });

      let maxId = tasks.reduce(
        (max, t) => (t.displayId != null && t.displayId > max ? t.displayId : max),
        0
      );

      for (const task of tasks) {
        if (task.displayId == null) {
          maxId += 1;
          await prisma.task.update({
            where: { id: task.id },
            data: { displayId: maxId },
          });
          updatedTasks += 1;
        }
      }

      const newSeq = Math.max(maxId, user.taskSeq);
      if (newSeq !== user.taskSeq) {
        await prisma.user.update({
          where: { id: user.id },
          data: { taskSeq: newSeq },
        });
      }
    }

    console.log(
      `Backfill terminé : ${updatedTasks} tâche(s) mise(s) à jour sur ${users.length} utilisateur(s).`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
