"use client";

import {
  Button,
  Checkbox,
  Input,
  LanguageSwitcher,
  Logo,
  Paper,
  Popover,
  Select,
  Tooltip,
  UserIcon,
} from "@/shared/ui";
import styles from "./UiKitPage.module.css";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowItems}>{children}</div>
    </div>
  );
}

export function UiKitPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>UI Kit</h1>

      <Section title="Paper">
        <Paper className={styles.paperDemo}>
          <Logo size="md" />
          <Input
            label="Логин"
            placeholder="Введите логин"
            icon={<UserIcon />}
          />
          <Input label="Пароль" type="password" placeholder="Введите пароль" />
          <Button variant="primary">Войти</Button>
        </Paper>
      </Section>

      <Section title="Logo">
        <Row label="xs">
          <Logo size="xs" />
        </Row>
        <Row label="sm">
          <Logo size="sm" />
        </Row>
        <Row label="md">
          <Logo size="md" />
        </Row>
        <Row label="lg">
          <Logo size="lg" />
        </Row>
        <Row label="xl">
          <Logo size="xl" />
        </Row>
      </Section>

      <Section title="Button">
        <Row label="Primary">
          <Button variant="primary">Submit</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" focusableWhenDisabled disabled>
            Focusable disabled
          </Button>
        </Row>
        <Row label="Secondary">
          <Button variant="secondary">Cancel</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" focusableWhenDisabled disabled>
            Focusable disabled
          </Button>
        </Row>
      </Section>

      <Section title="Input">
        <Row label="Default">
          <Input placeholder="Placeholder" />
        </Row>
        <Row label="With label">
          <Input label="Логин" placeholder="Введите логин" />
        </Row>
        <Row label="With icon">
          <Input
            label="Логин"
            placeholder="Введите логин"
            icon={<UserIcon />}
          />
        </Row>
        <Row label="Password">
          <Input label="Пароль" type="password" placeholder="Введите пароль" />
        </Row>
        <Row label="Error">
          <Input
            label="Логин"
            placeholder="Введите логин"
            icon={<UserIcon />}
            defaultValue="wrong_input"
            error="Неверный логин или пароль"
          />
        </Row>
        <Row label="Disabled">
          <Input label="Логин" placeholder="Введите логин" disabled />
        </Row>
      </Section>

      <Section title="Tooltip">
        <Row label="Default">
          <Tooltip content="Подсказка">
            <Button variant="secondary">Hover me</Button>
          </Tooltip>
        </Row>
        <Row label="Long content">
          <Tooltip content="Это более длинная подсказка, которая переносится на несколько строк при необходимости">
            <Button variant="secondary">Long tooltip</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Popover">
        <Row label="Default">
          <Popover trigger={<Button variant="secondary">Click me</Button>}>
            Это содержимое поповера. Здесь можно разместить любой контент.
          </Popover>
        </Row>
        <Row label="With link">
          <Popover trigger={<Button variant="secondary">With link</Button>}>
            Используйте данные с{" "}
            <a
              href="https://dummyjson.com/users"
              target="_blank"
              rel="noopener noreferrer"
            >
              dummyjson.com/users
            </a>
          </Popover>
        </Row>
      </Section>

      <Section title="Select">
        <Row label="Default">
          <Select
            options={[
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
              { value: "3", label: "Option 3" },
            ]}
            placeholder="Select an option"
          />
        </Row>
        <Row label="With label">
          <Select
            label="Category"
            defaultValue="2"
            options={[
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
              { value: "3", label: "Option 3" },
            ]}
          />
        </Row>
        <Row label="Disabled">
          <Select
            defaultValue="1"
            disabled
            options={[
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
            ]}
          />
        </Row>
      </Section>

      <Section title="Language Switcher">
        <Row label="Default">
          <LanguageSwitcher />
        </Row>
      </Section>

      <Section title="Checkbox">
        <Row label="Unchecked">
          <Checkbox label="Запомнить меня" />
        </Row>
        <Row label="Checked">
          <Checkbox label="Запомнить меня" defaultChecked />
        </Row>
        <Row label="Indeterminate">
          <Checkbox label="Выбрать всё" indeterminate />
        </Row>
        <Row label="Error">
          <Checkbox
            label="Принять условия"
            error="Необходимо принять условия"
          />
        </Row>
        <Row label="Disabled">
          <Checkbox label="Недоступно" disabled />
          <Checkbox label="Недоступно (checked)" defaultChecked disabled />
        </Row>
      </Section>
    </main>
  );
}
