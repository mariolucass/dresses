import { z } from "zod";

export type ActionState<T> = {
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  timestamp?: number;
};

export const createActionState = <T>(initialData?: T): ActionState<T> => ({
  data: initialData,
  timestamp: Date.now(),
});

function parseFormData(formData: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (Reflect.has(data, key)) {
      const currentValue = data[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(value);
      } else {
        data[key] = [currentValue, value];
      }
    } else {
      data[key] = value;
    }
  }

  return data;
}

export const createSafeAction = <Schema extends z.ZodType<any, any>, Output>(
  schema: Schema,
  action: (data: z.infer<Schema>) => Promise<ActionState<Output>>,
) => {
  return async (
    _prevState: ActionState<Output>,
    formData: FormData,
  ): Promise<ActionState<Output>> => {
    const rawData = parseFormData(formData);

    const result = schema.safeParse(rawData);

    if (!result.success) {
      return {
        fieldErrors: result.error.flatten().fieldErrors,
        error: "Validation failed",
        timestamp: Date.now(),
      } as ActionState<Output>;
    }

    try {
      return await action(result.data);
    } catch (error) {
      console.error("[SafeAction Error]:", error);

      return {
        error: "An unexpected error occurred. Please try again later.",
        timestamp: Date.now(),
      } as ActionState<Output>;
    }
  };
};
