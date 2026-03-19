"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/features/auth";
import { UserIcon } from "@/shared/ui/icons";
import styles from "./UserInfo.module.css";

export function UserInfo() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: Infinity,
  });

  return (
    <div className={styles.root}>
      <div className={styles.avatar}>
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.firstName}
            width={32}
            height={32}
            className={styles.avatarImage}
          />
        ) : (
          <UserIcon className={styles.avatarFallback} />
        )}
      </div>
      {user && (
        <span className={styles.name}>
          {user.firstName} {user.lastName}
        </span>
      )}
    </div>
  );
}
