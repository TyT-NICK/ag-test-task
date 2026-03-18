"use client";

import { Button, Checkbox, Input, Logo, Paper, UserIcon } from "@/shared/ui";
import styles from "./UiKitPage.module.css";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
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
          <Input label="Логин" placeholder="Введите логин" icon={<UserIcon />} />
          <Input label="Пароль" type="password" placeholder="Введите пароль" />
          <Button variant="primary">Войти</Button>
        </Paper>
      </Section>

      <Section title="Logo">
        <Row label="xs"><Logo size="xs" /></Row>
        <Row label="sm"><Logo size="sm" /></Row>
        <Row label="md"><Logo size="md" /></Row>
        <Row label="lg"><Logo size="lg" /></Row>
        <Row label="xl"><Logo size="xl" /></Row>
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
          <Input label="Логин" placeholder="Введите логин" icon={<UserIcon />} />
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
          <Checkbox label="Принять условия" error="Необходимо принять условия" />
        </Row>
        <Row label="Disabled">
          <Checkbox label="Недоступно" disabled />
          <Checkbox label="Недоступно (checked)" defaultChecked disabled />
        </Row>
      </Section>
    </main>
  );
}
