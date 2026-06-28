import type { BotContext } from "../types/intent";
import { UserRepository } from "../repositories/user.repository";
import { TaskRepository } from "../repositories/task.repository";
import { MistralService } from "../ai/mistral.service";
import { TaskService } from "../services/task.service";
import { UserService } from "../services/user.service";
import { IntentRouterService } from "../services/intent-router.service";
import { ResponseService } from "../services/response.service";

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
