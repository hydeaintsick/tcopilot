import type { BotContext } from "../types/intent.js";
import { UserRepository } from "../repositories/user.repository.js";
import { TaskRepository } from "../repositories/task.repository.js";
import { MistralService } from "../ai/mistral.service.js";
import { TaskService } from "../services/task.service.js";
import { UserService } from "../services/user.service.js";
import { IntentRouterService } from "../services/intent-router.service.js";
import { ResponseService } from "../services/response.service.js";

export interface AppServices {
  userRepository: UserRepository;
  taskRepository: TaskRepository;
  mistralService: MistralService;
  taskService: TaskService;
  userService: UserService;
  intentRouter: IntentRouterService;
  responseService: ResponseService;
}

export function createServices(): AppServices {
  const userRepository = new UserRepository();
  const taskRepository = new TaskRepository();
  const mistralService = new MistralService();
  const taskService = new TaskService(taskRepository);
  const userService = new UserService(userRepository);
  const intentRouter = new IntentRouterService(taskService, userService);
  const responseService = new ResponseService();

  return {
    userRepository,
    taskRepository,
    mistralService,
    taskService,
    userService,
    intentRouter,
    responseService,
  };
}

export async function resolveBotContext(
  services: AppServices,
  telegramUserId: bigint
): Promise<BotContext> {
  const user = await services.userRepository.findOrCreateByTelegramId(
    telegramUserId
  );

  return {
    userId: user.id,
    telegramUserId: user.telegramUserId,
    timezone: user.timezone,
  };
}
