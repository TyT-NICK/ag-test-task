"use client";

import { useDebouncedCallback } from "@react-hookz/web";
import { useSearchParams } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { Input } from "@/shared/ui/Input";
import { SearchIcon } from "@/shared/ui/icons";

type SearchBarProps = Omit<
  ComponentProps<typeof Input>,
  "icon" | "type" | "value" | "onChange" | "defaultValue"
> & {
  paramName?: string;
  debounce?: number;
};

export function SearchBar({
  paramName = "q",
  debounce = 300,
  ...props
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState(searchParams?.get(paramName) ?? "");

  const pushParam = useDebouncedCallback(
    (newValue: string) => {
      const params = new URLSearchParams();
      if (newValue) {
        params.set(paramName, newValue);
      }
      router.replace({ pathname, query: Object.fromEntries(params.entries()) });
    },
    [searchParams, router, pathname, paramName],
    debounce,
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);
    pushParam(newValue);
  }

  return (
    <Input
      icon={<SearchIcon />}
      type="search"
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}
