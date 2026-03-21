"use client";

import { useForm, UseFormProps } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import z, { ZodObject, ZodRawShape } from "zod";

export const useZodForm = <TShape extends ZodRawShape>(
  schema: ZodObject<TShape>,
  useFormProps?: UseFormProps<z.output<ZodObject<TShape>>>,
) => {
  return useForm<z.output<ZodObject<TShape>>>({
    resolver: standardSchemaResolver(schema),
    mode: "onSubmit",
    ...useFormProps,
  });
};
