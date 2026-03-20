import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/features/auth";
import { UserIcon } from "@/shared/ui/icons";
import styles from "./UserInfo.module.css";

type UserInfoProps = {
  onClick?: () => void;
};

export function UserInfo({ onClick }: UserInfoProps) {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: Infinity,
  });

  return (
    <button className={styles.root} onClick={onClick}>
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
    </button>
  );
}
