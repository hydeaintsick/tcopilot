import type { BotContext } from "../types/intent";
import { resolveLanguage } from "../lib/i18n";
import { UserRepository } from "../repositories/user.repository";
import { TaskRepository } from "../repositories/task.repository";
import { QuestionLogRepository } from "../repositories/question-log.repository";
import { MistralService } from "../ai/mistral.service";
import { TaskService } from "../services/task.service";
import { UserService } from "../services/user.service";
import { IntentRouterService } from "../services/intent-router.service";
import { ResponseService } from "../services/response.service";
import { SubscriptionService } from "../services/subscription.service";
import { getAdminUserIds } from "./env";

export interface AppServices {
  userRepository: UserRepository;
  taskRepository: TaskRepository;
  questionLogRepository: QuestionLogRepository;
  mistralService: MistralService;
  taskService: TaskService;
  userService: UserService;
  intentRouter: IntentRouterService;
  responseService: ResponseService;
  subscriptionService: SubscriptionService;
}

export function createServices(): AppServices {
  const userRepository = new UserRepository();
  const taskRepository = new TaskRepository();
  const questionLogRepository = new QuestionLogRepository();
  const mistralService = new MistralService();
  const taskService = new TaskService(taskRepository, userRepository);
  const userService = new UserService(userRepository);
  const intentRouter = new IntentRouterService(taskService, userService);
  const responseService = new ResponseService();
  const subscriptionService = new SubscriptionService(userRepository);

  return {
    userRepository,
    taskRepository,
    questionLogRepository,
    mistralService,
    taskService,
    userService,
    intentRouter,
    responseService,
    subscriptionService,
  };
}

export async function resolveBotContext(
  services: AppServices,
  telegramUserId: bigint,
  languageCode?: string | null
): Promise<BotContext> {
  const user = await services.userRepository.findOrCreateByTelegramId(
    telegramUserId,
    languageCode
  );

  const isAdmin = getAdminUserIds().has(telegramUserId);
  const status = services.subscriptionService.getStatus(user);
  const hasPremium = isAdmin || status.hasAccess;

  return {
    userId: user.id,
    telegramUserId: user.telegramUserId,
    timezone: user.timezone,
    language: resolveLanguage(user.language),
    isAdmin,
    hasPremium,
    isWhitelisted: user.isWhitelisted,
    subscriptionExpiresAt: user.subscriptionExpiresAt,
    trialEndsAt: user.trialEndsAt,
  };
}
